import type { GetTeacherApplyListResponse } from "@/api/apply"
import type { Ref, InjectionKey } from "vue"

interface experimentScheduleContext {
  data: Ref<GetTeacherApplyListResponse['records']>
  pageSize: Ref<number>
  curPage: Ref<number>
  total: Ref<number>
  handlePageSizeChange: (newSize: number) => void
  handlePageChange: (page: number) => void

  getApplyList: () => Promise<void>
  approveApply: () => Promise<void>
}

export const EXPERIMENT_SCHEDULE_INJECTION_KEY: InjectionKey<experimentScheduleContext> = Symbol('experimentSchedule') 
