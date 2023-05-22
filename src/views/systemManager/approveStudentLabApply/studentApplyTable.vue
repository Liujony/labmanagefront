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
                <el-button type="primary" @click="() => handleEdit(scope.row)" v-if="scope.row.status === '审核中'">审批</el-button>
                <el-button link type="primary" @click="() => handleEdit(scope.row)" disabled v-else>已审批</el-button>
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
        <el-form-item label="实验室" prop="lab">
          <el-option
            v-for="item in idleLabs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleApprove">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, inject, unref } from 'vue'
import type { Field } from '@/type/field'
import { authFieldMap, authOption, isOption, studentField, type Option } from '@/type/field'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import type { TableColumnCtx } from 'element-plus/lib/components/index.js'
import ElMessage from 'element-plus/lib/components/message/index.js'
import { EXPERIMENT_SCHEDULE_INJECTION_KEY } from '@/context/experimentSchedule'
import { field } from './field'
import { SystemManagerApplyApi } from '@/api/apply'
import labApi, { type TeacherLabDetail } from '@/api/lab'
import { APPROVE_STUDENT_INJECTION_KEY } from '@/context/approveStudent'

const {
  data,
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,

  getApplyList,
  approveApply
} = inject(APPROVE_STUDENT_INJECTION_KEY)!

// 配置项
const fields = field

const id = computed(() => (fields.filter(field => field.isId))[0].prop)
const visibleFields = computed(() => fields.filter(field => !field.invisible))
const editFields = computed(() => fields.filter(field => !!field.updateRequired))
const editDialogTitle = '审批实验排课申请'

let editForm = ref(fields)

const editFormElem = ref<FormInstance | undefined>()
const editFormVisible = ref(false)
const editFormRules = computed(() => editFields.value.reduce((rules, field) => ({ ...rules, [field.prop]: field.rule }), {} as Record<string, any>))

const tableData = ref(data)
const oldData = ref<Record<string, any> | null>(null)
const idleLabs = ref<Option[]>([])

const formatter = (row: any, column: TableColumnCtx<Field>) => {
  const prop = column.property
  const fieldConfig: Field = fields.find((field) => field.prop === prop) || {} as Field
  if ('options' in fieldConfig) {
    const options = fieldConfig.options!
    return options.find(option => row[prop] === option.value)?.label ?? row[prop]
  } else return row[prop]
}

const handleCancel = () => {
  editFormVisible.value = false
  oldData.value = null
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
  
  const { semester, labtype, stunum, startweek, endweek, day, section } = row
  console.log(row)
  const labCondition: TeacherLabDetail = {
    semester,
    labtype,
    stunum,
    startweek,
    endweek,
    day,
    section
  }
  console.log(labCondition)
  labApi.getLabsForTeacher(labCondition)
}

const handleApprove = async () => {
  try {
    if (!editFormElem.value || !approveApply) return
    const isValid = await editFormElem.value.validate((valid: boolean) => !!valid)
    if(!isValid) return
  
    const data = Object.assign({}, editForm.value)
    for(const [key, val] of Object.entries(data)) {
      if(isOption(val)) data[key] = val.value
    }

    console.log('?! data', data)
    await approveApply(data)
    ElMessage.success('修改成功')
  } catch (err: any) {
    ElMessage.error(err)
  }

  editFormVisible.value = false
}

watch(
  () => data,
  (data) => {
    tableData.value = data.value ?? []
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

