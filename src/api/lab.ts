import instance from '@/api/index'

type WeekDay = 1 | 2 | 3 | 4 | 5
type SectionSlot = '1-2' | '3-4' | '5-6' | '7-8' | '9-10'

export interface LabDetailBase {
  semester: string
  labtype: string
  day: WeekDay
  section: SectionSlot
}

export interface TeacherLabDetail extends LabDetailBase {
  stunum: number
  startweek: number
  endweek: number
}

export interface StudentLabDetail extends LabDetailBase {
  week: number
}

export interface Lab {
  id: number
  lab: string
}

export type GetLabsResponse = Lab[]

const labApi = {

  /** @description 获取当前符合条件的实验室 */
  getLabsForTeacher: (data: TeacherLabDetail) => instance.post<TeacherLabDetail, GetLabsResponse>('/lab/getLabs', data),

  /** @description 获取当前符合条件的实验室 */
  getLabsForStudent: (data: StudentLabDetail) => instance.post<StudentLabDetail, GetLabsResponse>('/lab/getLabs', data),

}

export default labApi
