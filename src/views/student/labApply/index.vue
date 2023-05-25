<template>
  <el-row class="user-table-container">
    <el-col :span="24">
      <el-row style="margin-bottom: 20px">
        <el-button type="primary" @click="() => createFormVisible = true">
          申请实验室
        </el-button>
      </el-row>
      <el-card>
        <student-apply-table></student-apply-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onBeforeMount, provide, ref } from 'vue'
import studentApplyTable from './studentApplyTable.vue'
import { ElMessage } from 'element-plus/lib/components/index.js'
import { StudentApplyApi, type StudentApplyLabRequest, type DeleteApplyRequest, type GetApplyListByStudentResponse, type GetStudentApplyListResponse, type UpdateLabStatusRequest } from '@/api/apply'
import { STUDENT_LAB_APPLY_INJECTION_KEY } from '@/context/studentLabApply'

const pageSize = ref(20)
const curPage = ref(1)
const total = ref(1)
const data = ref([] as GetApplyListByStudentResponse['records'])
const createFormVisible = ref(false)
const hideCreateForm = () => {
  createFormVisible.value = false
}

const getApplyList = async () => {
  const page = curPage.value
  const num = pageSize.value
  const { total: totalNum, current, records } = (await StudentApplyApi.getApplyList(page, num)) as unknown as GetStudentApplyListResponse
  console.log(totalNum, current, records)
  total.value = totalNum
  curPage.value = current
  data.value = records
}

const createApply = async (data: StudentApplyLabRequest) => {
  try {
    await StudentApplyApi.applyLab(data)
  } catch (err) {
    ElMessage.error('修改失败！')
  }
  getApplyList()
}

const updateApply = async (data: StudentApplyLabRequest & { id: number }) => {
  try {
    await StudentApplyApi.updateApply(data)
  } catch (err) {
    ElMessage.error('修改失败！')
  }
  getApplyList()
}

const deleteApply = async (data: DeleteApplyRequest) => {
  try {
    await StudentApplyApi.deleteApply(data)
  } catch (err) {
    ElMessage.error('删除失败！')
  }
  getApplyList()
}

const finishApply = async (data: UpdateLabStatusRequest) => {
  try {
    await StudentApplyApi.updateLabStatus(data)
  } catch (err) {
    ElMessage.error('更改状态失败！')
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
provide(STUDENT_LAB_APPLY_INJECTION_KEY, {
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
  finishApply,
  createFormVisible,
  hideCreateForm,
})
</script>

<style lang="scss">
.user-table-container {
  margin-bottom: 20px;
}
</style>