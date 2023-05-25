<template>
  <div>
    <el-row v-if="creatable">
      <el-button type="primary" @click="() => createFormVisible = true">
        添加
      </el-button>
    </el-row>
    <el-row style="margin: 30px 0">
      <el-col :span="24">
        <!-- <el-card> -->
          <el-table :data="tableData" :style="{ width: tableWidth ?? '100%'}" fit>
            <el-table-column 
              v-for="{prop, label, fixed, width} in visibleFields"
              :key="label"
              :prop="prop"
              :label="label"
              :fixed="fixed"
              :width="width"
              :formatter="formatter"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="180" v-if="editable || delable || $slots.operate">
              <template #default="scope">
                <slot name="operate" :row="scope.row" :loadTable="loadTable"></slot>
                <el-button link type="primary" @click="() => handleEdit(scope.row)" v-if="editable">编辑</el-button>
                <el-button link type="danger" @click="() => handleDel(scope.row[id])" v-if="delable">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        <!-- </el-card> -->
      </el-col>
    </el-row>
    <el-row v-if="needSplitPage">
      <div class="pagination-container">
        <el-pagination 
          background
          layout="prev, pager, next"
          :page-count="totalPage"
          :current-page="curPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
  
    <el-dialog v-model="createFormVisible" :title="createDialogTitle">
      <el-form :model="createForm" :rules="createFormRules" ref="createFormElem" label-width="100px">
        <el-form-item 
          :label="label" 
          :prop="prop" 
          :key="label"
          v-for="{ label, prop, isNumber, values, options } in creationFields"
        >
          <el-radio-group v-model="createForm[prop]" v-if="values">
            <el-radio :label="value" v-for="value in values" :key="value"></el-radio>
          </el-radio-group>
          <el-select v-model="createForm[prop]" v-else-if="options">
            <el-option
              v-for="{ label, value } in options"
              :key="label"
              :label="label"
              :value="value"
            />
          </el-select>
          <el-input v-model.number="createForm[prop]" autocomplete="off" v-else-if="isNumber" />
          <el-input v-model="createForm[prop]" autocomplete="off" v-else />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleCreate">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <el-dialog v-model="editFormVisible" :title="editDialogTitle">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormElem" label-width="100px">
        <el-form-item :label="label" :prop="prop" :key="prop" v-for="{ label, prop, isNumber, values, options } in editFields">
          <el-radio-group v-model="editForm[prop]" v-if="values">
            <el-radio :label="value" v-for="value in values" :key="value"></el-radio>
          </el-radio-group>
          <el-select v-model="editForm[prop]" v-else-if="options">
            <el-option
              v-for="{ label, value } in options"
              :key="label"
              :label="label"
              :value="value"
            />
          </el-select>
          <el-input v-model.number="editForm[prop]" autocomplete="off" v-else-if="isNumber" />
          <el-input v-model="editForm[prop]" autocomplete="off" :disabled="prop === id" v-else />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleUpdate">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormItemRule, FormRules, TableColumnCtx } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref, reactive, computed, watch } from 'vue'

type Option = {
  label: string
  value: any
}

function isOption (val: any): val is Option {
  return typeof val === 'object' && ('label' in val) && ('value' in val)
}

type Field = {
  prop: string
  label: string
  fixed?: boolean
  width?: number
  isId?: boolean
  isNumber?: boolean
  creationRequired?: boolean
  editable?: boolean
  invisible?: boolean
  rule?: Array<FormItemRule>
  values?: Array<any>
  options?: Array<Option>
  default?: any
}

const props = defineProps<{
  dialogTitle: string
  fields: Field[]
  rules?: FormRules
  create?: (fields: Record<string, any>) => Promise<any>
  update?: (fields: Record<string, any>, oldData?: Record<string, any>) => Promise<any>
  list: () => Promise<any>
  data?: Array<any>
  delete?: (id: number | string) => Promise<any>
  
  creatable?: boolean
  editable?: boolean
  delable?: boolean

  tableWidth?: number | string
  needSplitPage?: boolean
  dataProp?: string
}>()

const curPage = ref(1)
const totalPage = ref(1)
const pageSize = ref(20)

const id = computed(() => (props.fields.filter(field => field.isId))[0].prop)
const visibleFields = computed(() => props.fields.filter(field => !field.invisible))
const editFields = computed(() => props.fields.filter(field => !!field.editable))
const creationFields = computed(() => props.fields.filter(field => !!field.creationRequired))
const createDialogTitle = computed(() => `添加${props.dialogTitle}`)
const editDialogTitle = computed(() => `修改${props.dialogTitle}`)

const initForm = creationFields.value.reduce((formObj, item) => {
  formObj[item.prop] = item.default ?? ''
  return formObj
}, {} as Record<string, any>)

let createForm = reactive(initForm)
let editForm = ref(props.fields)

const createFormElem = ref<FormInstance | undefined>()
const createFormVisible = ref(false)
const createFormRules = computed(() => creationFields.value.reduce((rules, field) => ({ ...rules, [field.prop]: field.rule }), {} as Record<string, any>))
const editFormElem = ref<FormInstance | undefined>()
const editFormVisible = ref(false)
const editFormRules = computed(() => editFields.value.reduce((rules, field) => ({ ...rules, [field.prop]: field.rule }), {} as Record<string, any>))

const tableData = ref(props.data ?? [])
const oldData = ref<Record<string, any> | null>(null)

const formatter = (row: any, column: TableColumnCtx<Field>) => {
  const prop = column.property
  const fieldConfig: Field = props.fields.find((field) => field.prop === prop) || {} as Field
  if ('options' in fieldConfig) {
    const options = fieldConfig.options!
    return options.find(option => row[prop] === option.value)?.label
  } else return row[prop]
}

const handleCreate = async() => {
  try {
    if (!createFormElem.value || !props.create) return
    const isValid = await createFormElem.value.validate((valid: boolean) => !!valid)
    if(!isValid) return
  
    const data = await props.create(createForm)
    ElMessage.success('添加成功')
  } catch (err: any) {
    ElMessage.success(err)
  }

  createFormElem.value?.resetFields()
  createFormVisible.value = false
  loadTable()
}

const handleCancel = () => {
  createFormElem.value?.resetFields()
  createFormVisible.value = false
  editFormVisible.value = false
  oldData.value = null
}

function handleEdit(row: any) {
  const rowData = Object.assign({}, row)
  const editFormData = {} as Record<string, any>
  editFields.value.forEach(({ prop, options }) => {
    if (options) {
      const option = (options.filter(option => option.value === rowData[prop]))[0]
      if (option) {
        editFormData[prop] = option
        return
      }
    } 
    editFormData[prop] = rowData[prop]
  })
  // console.log(editFields.value, editFormData)
  oldData.value = Object.assign({}, editFormData) as any
  editForm.value = editFormData as any
  // console.log('editForm', editForm)
  editFormVisible.value = true
}

const handleUpdate = async () => {
  try {
    if (!editFormElem.value || !props.update) return
    const isValid = await editFormElem.value.validate((valid: boolean) => !!valid)
    // console.log('isValid', isValid)
    if(!isValid) return
  
    const data = Object.assign({}, editForm.value)
    for(const [key, val] of Object.entries(data)) {
      if(isOption(val)) data[key] = val.value
    }
    await props.update(data, Object.assign({}, oldData.value))
    ElMessage.success('修改成功')
  } catch (err: any) {
    ElMessage.error(err)
  }

  editFormVisible.value = false
  loadTable()
}

function handleDel(id: string | number) {
  if (!props.delete) return
  props.delete(id)
  .then(data => {
    ElMessage.success('删除成功')
    loadTable()
  })
  .catch(err => {
    ElMessage.error(err)
  })
}


const loadTable = async () => {
  try {
    if(props.data) {
      props.list()
      return
    }
    const data = await props.list()
    if (props.needSplitPage) {
      const { page, totalPage: total } = data
      totalPage.value = total
      curPage.value = page
      tableData.value = data[props.dataProp as string]
    }
    // console.log('loadTable', data)
    else tableData.value = data
  } catch (err) {
    console.error(err)
  }
}

loadTable()

watch(
  () => props.data,
  (data) => {
    tableData.value = data ?? []
  }
)


const handleSizeChange = (val: number) => {
  loadTable()
}

</script>

<style scoped>
.load-more {
  margin-left: 120px;
}

.avatar-img {
  float: left;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  margin-top: 15px;
}

.org-img {
  height: 150px;
  width: 150px;
}

.author-name {
  float: left;
  line-height: 65px !important;
  margin-left: 10px;
  color: darkblue;
  line-height: 100px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.dom-center {
  margin-left: 50%;
  transform: translateX(-50%);
}
.pagination-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
