<template>
  <el-row class="user-table-container">
    <el-col :span="24">
      <el-row style="margin-bottom: 20px">
        <el-button type="primary" @click="() => createFormVisible = true">
          申请实验室
        </el-button>
      </el-row>
      <el-card>
        <teacher-apply-table></teacher-apply-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, provide, reactive, ref } from 'vue'
import TeacherApplyTable from './teacherApplyTable.vue'
import { ElMessage, type FormInstance } from 'element-plus/lib/components/index.js'
import { type GetTeacherApplyListResponse, TeacherApplyApi, type GetApplyListByTeacherResponse, type TeacherApplyLabRequest, type DeleteApplyRequest } from '@/api/apply'
import { TEACHER_LAB_APPLY_INJECTION_KEY } from '@/context/teacherLabApply'

const pageSize = ref(20)
const curPage = ref(1)
const total = ref(1)
const data = ref([] as GetApplyListByTeacherResponse['records'])
const createFormVisible = ref(false)
const hideCreateForm = () => {
  createFormVisible.value = false
}

const getApplyList = async () => {
  const page = curPage.value
  const num = pageSize.value
  const { total: totalNum, current, records } = (await TeacherApplyApi.getApplyList(page, num)) as unknown as GetTeacherApplyListResponse
  console.log(totalNum, current, records)
  total.value = totalNum
  curPage.value = current
  data.value = records
}

const createApply = async (data: TeacherApplyLabRequest) => {
  try {
    await TeacherApplyApi.applyLab(data)
  } catch (err) {
    ElMessage.error('修改失败！')
  }
  getApplyList()
}

const updateApply = async (data: TeacherApplyLabRequest & { id: number }) => {
  try {
    await TeacherApplyApi.updateApply(data)
  } catch (err) {
    ElMessage.error('修改失败！')
  }
  getApplyList()
}

const deleteApply = async (data: DeleteApplyRequest) => {
  try {
    await TeacherApplyApi.deleteApply(data)
  } catch (err) {
    ElMessage.error('删除失败！')
  }
  getApplyList()
}

const handlePageSizeChange = (newSize: number) => {
  getApplyList()
}

const handlePageChange = (page: number) => {
  if (page === curPage.value) return
  curPage.value = page
  console.log('handlePageChange', page)
  getApplyList()
}

onBeforeMount(() => {
  getApplyList()
}),

console.log('data', data)
provide(TEACHER_LAB_APPLY_INJECTION_KEY, {
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,
  data,
  getApplyList, 
  createApply,
  updateApply,
  deleteApply,
  createFormVisible,
  hideCreateForm,
})
</script>

<style lang="scss">
.user-table-container {
  margin-bottom: 20px;
}
</style>