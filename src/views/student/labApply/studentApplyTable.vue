<template>
  <div>
    <el-row>
      <el-col :span="24">
          <el-table 
            :data="tableData"
            style="100%"
            fit
          >
            <el-table-column 
              v-for="{prop, label, fixed, width} in visibleFields"
              :key="label"
              :prop="prop"
              :label="label"
              :fixed="fixed"
              :width="width"
              :formatter="formatter"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template #default="scope">
                <!--  -->
                <el-row>
                  <el-col align="end">
                    <el-button link type="primary" @click="() => handleEdit(scope.row)" v-if="scope.row.status === '审核中'">编辑</el-button>
                    <el-button type="primary" @click="() => handleFinish(scope.row[id])" v-if="scope.row.status === '审核通过'">使用完毕</el-button>
                    <el-button link type="danger" @click="() => handleDel(scope.row[id])">删除</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <div class="pagination-container">
        <el-pagination 
          background
          layout="prev, pager, next, sizes"
          :total="total"
          :current-page="curPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-row>

    <el-dialog v-model="createFormVisible" :title="createDialogTitle">
      <el-form :model="createForm" :rules="createFormRules" ref="createFormElem" label-width="100px">
        <el-form-item label="学期" >
          <el-input v-model="createForm.semester" disabled></el-input>
        </el-form-item>
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
        <el-form-item :label="label" :prop="prop" :key="prop" v-for="{ label, prop, isNumber, values, options, editable } in editFields">
          <el-radio-group v-model="editForm[prop]" v-if="values" :disabled="!editable">
            <el-radio :label="value" v-for="value in values" :key="value"></el-radio>
          </el-radio-group>
          <el-select v-model="editForm[prop]" v-else-if="options" :disabled="!editable">
            <el-option
              v-for="{ label, value } in options"
              :key="label"
              :label="label"
              :value="value"
            />
          </el-select>
          <el-input v-model.number="editForm[prop]" autocomplete="off" :disabled="!editable" v-else-if="isNumber" />
          <el-input v-model="editForm[prop]" autocomplete="off" :disabled="!editable" v-else />
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
import { ref, computed, watch, inject } from 'vue'
import type { Field } from '@/type/field'
import { isOption, type Option } from '@/type/field'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import type { TableColumnCtx } from 'element-plus/lib/components/index.js'
import ElMessage from 'element-plus/lib/components/message/index.js'
import { field } from './field'
import { type StudentLabDetail } from '@/api/lab'
import semesterApi, { type Semester, type SemesterList } from '@/api/semester'
import type { StudentApplyLabRequest } from '@/api/apply'
import { STUDENT_LAB_APPLY_INJECTION_KEY } from '@/context/studentLabApply'

const {
  data,
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,

  createApply,
  updateApply,
  deleteApply,
  finishApply,
  
  createFormVisible,
  hideCreateForm,
} = inject(STUDENT_LAB_APPLY_INJECTION_KEY)!

// 配置项
const fields = field

const id = computed(() => (fields.filter(field => field.isId))[0].prop)
const visibleFields = computed(() => fields.filter(field => !field.invisible))
const editFields = computed(() => fields.filter(field => !!field.updateRequired))
const editDialogTitle = '修改实验室申请单'

const creationFields = computed(() => fields.filter(field => !!field.creationRequired))
const createDialogTitle = '申请实验室'

const initForm = creationFields.value.reduce((formObj, item) => {
  formObj[item.prop] = item.default ?? ''
  return formObj
}, {} as Record<string, any>)

let editForm = ref<Record<string, any>>({})
let createForm = ref(initForm)


const createFormElem = ref<FormInstance | undefined>()
const createFormRules = computed(() => creationFields.value.reduce((rules, field) => ({ ...rules, [field.prop]: field.rule }), {} as Record<string, any>))


const editFormElem = ref<FormInstance | undefined>()
const editFormVisible = ref(false)
const editFormRules = computed(() => editFields.value.reduce((rules, field) => ({ ...rules, [field.prop]: field.rule }), {} as Record<string, any>))

const tableData = ref(data)
const oldData = ref<Record<string, any> | null>(null)
const semesterList = ref<string[]>([])

const formatter = (row: any, column: TableColumnCtx<Field>) => {
  const prop = column.property
  const fieldConfig: Field = fields.find((field) => field.prop === prop) || {} as Field
  if ('options' in fieldConfig) {
    const options = fieldConfig.options!
    return options.find(option => row[prop] === option.value)?.label
  } else return row[prop]
}

const handleCancel = () => {
  editFormVisible.value = false
  createFormElem.value?.resetFields()
  oldData.value = null
  hideCreateForm()
}

function handleEdit(row: any) {
  const rowData = Object.assign({}, row)
  const editFormData = {} as Record<string, any>
  console.log('?', editFields.value)
  editFields.value.forEach(({ prop, options }) => {
    if (options) {
      const option = options.find(option => option.value === rowData[prop])
      if (option) {
        editFormData[prop] = option.value
        return
      }
    } 
    editFormData[prop] = rowData[prop]
  })
  oldData.value = Object.assign({}, editFormData) as any
  editForm = ref(editFormData as any)
  editFormVisible.value = true
  
  const { semester, labtype, week, day, section } = row
  console.log(row)
  const labCondition: StudentLabDetail = {
    semester,
    labtype,
    week,
    day,
    section
  }
  console.log(labCondition)
  // labApi.getLabsForStudent(labCondition)
}

const getSemesterList = async () => {
  const { semesters } = (await semesterApi.getAllSemester()) as unknown as SemesterList
  semesterList.value = semesters
}

const handleCreate = async() => {
  try {
    if (!createFormElem.value || !createApply) return
    const isValid = await createFormElem.value.validate((valid: boolean) => !!valid)
    if (!isValid) return
    // if (createForm.value.startweek > createForm.value.endweek) {
    //   ElMessage.error('起始周次不能晚于结束周次！')
    //   return
    // }
  
    await createApply(createForm.value as StudentApplyLabRequest)
    ElMessage.success('添加成功')
  } catch (err: any) {
    ElMessage.success(err)
  }

  createFormElem.value?.resetFields()
  createFormVisible.value = false
}

const handleUpdate = async () => {
  try {
    if (!editFormElem.value || !updateApply) return
    const isValid = await editFormElem.value.validate((valid: boolean) => !!valid)
    if(!isValid) return
    // if (editForm.value.startweek > editForm.value.endweek) {
    //   ElMessage.error('起始周次不能晚于结束周次！')
    //   return
    // }
  
    const data = Object.assign({}, editForm.value)
    for(const [key, val] of Object.entries(data)) {
      if(isOption(val)) data[key] = val.value
    }

    console.log('?! data', data)
    await updateApply(data as StudentApplyLabRequest & { id: number })
    ElMessage.success('修改成功')
  } catch (err: any) {
    ElMessage.error(err)
  }
  editFormVisible.value = false
}

function handleDel(id: number) {
  if (!deleteApply) return
  deleteApply({
    id
  })
}

function handleFinish(id: number) {
  if (!deleteApply) return
  finishApply({
    id,
    status: '使用完毕'
  })
}
watch(
  () => data,
  (data) => {
    tableData.value = data.value ?? []
  }
)
watch(
  () => createFormVisible.value,
  async (isVisible) => {
    if (!isVisible) return
    const { semester } = await semesterApi.getCurrentSemester() as unknown as Semester
    createForm.value.semester = semester
  }
)

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

