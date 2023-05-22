<template>
  <el-row class="user-table-container">
    <el-col :span="24">
      <el-card>
        <teacher-apply-table></teacher-apply-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { type GetUsersByFiltersRequest } from '@/api/user'
import { onBeforeMount, provide, reactive, ref } from 'vue'
import TeacherApplyTable from './teacherApplyTable.vue'
import { ElMessage } from 'element-plus/lib/components/index.js'
import { EXPERIMENT_SCHEDULE_INJECTION_KEY } from '@/context/experimentSchedule'
import { SystemManagerApplyApi, type GetTeacherApplyListResponse, type ExamineApplyRequest, TeacherApplyApi, type GetApplyListByTeacherResponse, type TeacherApplyLabRequest } from '@/api/apply'
import { TEACHER_LAB_APPLY_INJECTION_KEY } from '@/context/teacherLabApply'

const pageSize = ref(20)
const curPage = ref(1)
const total = ref(1)
const data = ref([] as GetApplyListByTeacherResponse['records'])

const getApplyList = async () => {
  const page = curPage.value
  const num = pageSize.value
  const { total: totalNum, current, records } = (await TeacherApplyApi.getApplyList(page, num)) as unknown as GetTeacherApplyListResponse
  total.value = totalNum
  curPage.value = current
  data.value = records
}

const updateApply = async (data: TeacherApplyLabRequest & { id: number }) => {
  try {
    await TeacherApplyApi.updateApply(data)
  } catch (err) {
    ElMessage.error('审批失败！')
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

provide(TEACHER_LAB_APPLY_INJECTION_KEY, {
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,
  data,
  getApplyList, 
  updateApply
})
</script>

<style lang="scss">
.user-table-container {
  margin: 20px 0;
}
</style>