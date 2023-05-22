import type { GetApplyListByTeacherResponse, TeacherApplyLabRequest } from "@/api/apply"
import type { Ref, InjectionKey } from "vue"

interface teacherLabApplyContext {
  data: Ref<GetApplyListByTeacherResponse['records']>
  pageSize: Ref<number>
  curPage: Ref<number>
  total: Ref<number>
  handlePageSizeChange: (newSize: number) => void
  handlePageChange: (page: number) => void

  getApplyList: () => Promise<void>
  updateApply: (TeacherApplyLabRequest & { id: number }) => Promise<void>
}

export const TEACHER_LAB_APPLY_INJECTION_KEY: InjectionKey<teacherLabApplyContext> = Symbol('experimentSchedule') 
