import type { DeleteApplyRequest } from "@/api/apply"
import { type RepairApplyListResponse, type ApplyRepairRequest, type UpdateApplyRequest } from "@/api/repair"
import type { Ref, InjectionKey } from "vue"

interface teacherRepairApplyContext {
  data: Ref<RepairApplyListResponse['records']>
  pageSize: Ref<number>
  curPage: Ref<number>
  total: Ref<number>
  handlePageSizeChange: (newSize: number) => void
  handlePageChange: (page: number) => void

  getApplyList: () => Promise<void>
  createApply: (data: ApplyRepairRequest) => Promise<void>
  updateApply: (data: UpdateApplyRequest) => Promise<void>
  deleteApply: (data: DeleteApplyRequest) => Promise<void>

  createFormVisible: Ref<boolean>
  hideCreateForm: () => void
}

export const TEACHER_REPAIR_APPLY_INJECTION_KEY: InjectionKey<teacherRepairApplyContext> = Symbol('teacherRepairApply') 
