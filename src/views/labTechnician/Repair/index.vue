<template>
  <el-row class="user-table-container">
    <el-col :span="24">
      <el-card>
        <apply-table></apply-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onBeforeMount, provide, ref } from 'vue'
import applyTable from './applyTable.vue'
import { ElMessage } from 'element-plus/lib/components/index.js'
import { type UpdateApplyRequest, type RepairApplyListResponse, LabTechnicianRepairApi } from '@/api/repair'
import { LAB_TECHNICIAN_REPAIR_INJECTION_KEY } from '@/context/labTechnicianRepair'

const pageSize = ref(20)
const curPage = ref(1)
const total = ref(1)
const data = ref([] as RepairApplyListResponse['records'])

const getApplyList = async () => {
  const page = curPage.value
  const num = pageSize.value
  const { total: totalNum, current, records } = (await LabTechnicianRepairApi.getRepairList(page, num)) as unknown as RepairApplyListResponse
  console.log(totalNum, current, records)
  total.value = totalNum
  curPage.value = current
  data.value = records
}

const updateApply = async (data: UpdateApplyRequest) => {
  try {
    await LabTechnicianRepairApi.updateRepair(data)
  } catch (err) {
    ElMessage.error('修改失败！')
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
provide(LAB_TECHNICIAN_REPAIR_INJECTION_KEY, {
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,
  data,
  getApplyList, 
  updateApply,
})
</script>

<style lang="scss">
.user-table-container {
  margin-bottom: 20px;
}
</style>