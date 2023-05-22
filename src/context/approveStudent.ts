import type { GetStudentApplyListResponse } from "@/api/apply"
import type { Ref, InjectionKey } from "vue"

interface approveStudentContext {
  data: Ref<GetStudentApplyListResponse['records']>
  pageSize: Ref<number>
  curPage: Ref<number>
  total: Ref<number>
  handlePageSizeChange: (newSize: number) => void
  handlePageChange: (page: number) => void

  getApplyList: () => Promise<void>
  approveApply: () => Promise<void>
}

export const APPROVE_STUDENT_INJECTION_KEY: InjectionKey<approveStudentContext> = Symbol('approveStudent') 