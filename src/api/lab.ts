import instance from '@/api/index'
import type { LabType } from './apply'

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

export interface GetClassByDayRequest {
  day: WeekDay
}

export interface OccupiedClass {
  segment: SectionSlot
  course: string
  username: string
  major: string
  classnum: string
  startweek: number
  endweek: number
}
export interface IdleClass {
  segment: SectionSlot
  course?: null
  username?: null
  major?: null
  classnum?: string
  startweek?: null
  endweek?: null
}

export interface LabClasses {
  labtype: LabType
  roomid: string
  classByDay: Array<OccupiedClass | IdleClass>
}
export type GetClassByDayResponse = LabClasses[] 

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

  getClassByDay: (data: GetClassByDayRequest) => instance.post<GetClassByDayRequest, GetClassByDayResponse>('/common/getClassByDay', data)
}

export default labApi
