<template>
  <el-row class="user-table-container">
    <el-col :span="24">
      <el-card>
        <student-apply-table></student-apply-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { type GetUsersByFiltersRequest } from '@/api/user'
import { onBeforeMount, provide, reactive, ref } from 'vue'
import StudentApplyTable from './studentApplyTable.vue'
import { ElMessage } from 'element-plus/lib/components/index.js'
import { SystemManagerApplyApi, type GetStudentApplyListResponse, type ExamineApplyRequest } from '@/api/apply'
import { APPROVE_STUDENT_INJECTION_KEY } from '@/context/approveStudent'

const pageSize = ref(20)
const curPage = ref(1)
const total = ref(1)
const form = reactive<GetUsersByFiltersRequest>({
  auth: 2,
  uuid: '',
  username: '',
  major: '',
  classnum: '',
})
const data = ref([] as GetStudentApplyListResponse['records'])

const getApplyList = async () => {
  const page = curPage.value
  const num = pageSize.value
  const { total: totalNum, current, records } = (await SystemManagerApplyApi.getStudentApplyList(page, num)) as unknown as GetStudentApplyListResponse
  total.value = totalNum
  curPage.value = current
  data.value = records
}

const approveApply = async (data: ExamineApplyRequest) => {
  try {
    await SystemManagerApplyApi.examineStudentApply(data)
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

provide(APPROVE_STUDENT_INJECTION_KEY, {
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,
  data,
  getApplyList, 
  approveApply
})
</script>

<style lang="scss">
.user-table-container {
  margin: 20px 0;
}
</style>