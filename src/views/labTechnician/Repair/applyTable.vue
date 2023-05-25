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
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <!--  -->
                <el-row>
                  <el-col>
                    <el-button type="primary" @click="() => handleEdit(scope.row)" v-if="scope.row.status !== '已维修'">修改状态</el-button>
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

    <el-dialog v-model="editFormVisible" :title="editDialogTitle">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormElem" label-width="100px">
        <el-form-item label="id" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status">
            <el-option
              v-for="{ label, value } in repairStatusOptions"
              :key="label"
              :label="label"
              :value="value"
            />
          </el-select>
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
import { field, repairStatusOption } from './field'
import { type TeacherLabDetail } from '@/api/lab'
import { type UpdateApplyRequest, type LabsList } from '@/api/repair'
import { LAB_TECHNICIAN_REPAIR_INJECTION_KEY } from '@/context/labTechnicianRepair'

const {
  data,
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,
  updateApply,
} = inject(LAB_TECHNICIAN_REPAIR_INJECTION_KEY)!

// 配置项
const fields = field
const repairStatusOptions = computed(() => repairStatusOption.slice(1))

const id = computed(() => (fields.filter(field => field.isId))[0].prop)
const visibleFields = computed(() => fields.filter(field => !field.invisible))
const editFields = computed(() => fields.filter(field => !!field.updateRequired))
const editDialogTitle = '修改报修申请单'

let editForm = ref<Record<string, any>>({})

const editFormElem = ref<FormInstance | undefined>()
const editFormVisible = ref(false)
const editFormRules = computed(() => editFields.value.reduce((rules, field) => ({ ...rules, [field.prop]: field.rule }), {} as Record<string, any>))

const tableData = ref(data)
const oldData = ref<Record<string, any> | null>(null)
const labList = ref<Option[]>([])

const formatter = (row: any, column: TableColumnCtx<Field>) => {
  const prop = column.property
  const fieldConfig: Field = fields.find((field) => field.prop === prop) || {} as Field
  if ('options' in fieldConfig) {
    const options = fieldConfig.options!
    return options.find(option => row[prop] === option.value)?.label
  } else if (prop === 'labid') {
    return labList.value.find(option => row[prop] === option.value)?.label
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
    } else editFormData[prop] = rowData[prop]
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
  // labApi.getLabsForTeacher(labCondition)
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

    await updateApply(data as UpdateApplyRequest)
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

