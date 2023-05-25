import type { DeleteApplyRequest } from "@/api/apply"
import { type RepairApplyListResponse, type ApplyRepairRequest, type UpdateApplyRequest } from "@/api/repair"
import type { Ref, InjectionKey } from "vue"

interface labTechnicianRepairContext {
  data: Ref<RepairApplyListResponse['records']>
  pageSize: Ref<number>
  curPage: Ref<number>
  total: Ref<number>
  handlePageSizeChange: (newSize: number) => void
  handlePageChange: (page: number) => void

  getApplyList: () => Promise<void>
  updateApply: (data: UpdateApplyRequest) => Promise<void>
}

export const LAB_TECHNICIAN_REPAIR_INJECTION_KEY: InjectionKey<labTechnicianRepairContext> = Symbol('labTechnicianRepair') 
