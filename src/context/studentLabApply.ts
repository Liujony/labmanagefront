import type { DeleteApplyRequest, GetApplyListByStudentResponse, StudentApplyLabRequest, UpdateLabStatusRequest } from "@/api/apply"
import type { Ref, InjectionKey } from "vue"

interface studentLabApplyContext {
  data: Ref<GetApplyListByStudentResponse['records']>
  pageSize: Ref<number>
  curPage: Ref<number>
  total: Ref<number>
  handlePageSizeChange: (newSize: number) => void
  handlePageChange: (page: number) => void

  getApplyList: () => Promise<void>
  createApply: (data: StudentApplyLabRequest) => Promise<void>
  updateApply: (data: StudentApplyLabRequest & { id: number }) => Promise<void>
  deleteApply: (data: DeleteApplyRequest) => Promise<void>
  finishApply: (data: UpdateLabStatusRequest) => Promise<void>
  createFormVisible: Ref<boolean>
  hideCreateForm: () => void
}

export const STUDENT_LAB_APPLY_INJECTION_KEY: InjectionKey<studentLabApplyContext> = Symbol('studentLabApply') 
