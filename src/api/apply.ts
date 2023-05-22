
import instance from '@/api/index'

export type ApplyStatus = '审核中' | '审核通过' | '审核不通过'
export type WeekDay = 1 | 2 | 3 | 4 | 5
export type SectionSlot = '1-2' | '3-4' | '5-6' | '7-8' | '9-10'

// 已申请的记录
export interface ApplyRecordBase {
  id: number
  username: string
  semester: string
  labtype: string
  day: WeekDay
  section: SectionSlot
  status: ApplyStatus
  lab: string
}

export interface TeacherApplyRecord extends ApplyRecordBase {
  class: string
  stunum: number
  startweek: number
  endweek: number
}

export interface StudentApplyRecord extends ApplyRecordBase {
  week: number
  reason: string
}

// 管理员角度，查看教师和学生的申请
export interface GetTeacherApplyListResponse {
  current: number
  total: number
  records: TeacherApplyRecord[]
}

export interface GetStudentApplyListResponse {
  current: number
  total: number
  records: StudentApplyRecord[]
}

// 教师角度，查看自己的申请
export interface GetApplyListByTeacherResponse {
  current: number
  total: number
  records: Omit<TeacherApplyRecord, 'username'>[]
}

// 学生角度，查看自己的申请
export interface GetApplyListByStudentResponse {
  current: number
  total: number
  records: Omit<StudentApplyRecord, 'username'>[]
}


export interface ExamineApplyRequest {
  id: number // 申请单 ID
  status: '通过' | '不通过',
  lab?: number
}


export interface ApplyLabBase {
  semester: string
  labtype: string
  day: WeekDay
  section: SectionSlot
}

export interface TeacherApplyLabRequest extends ApplyLabBase {
  class: string
  stunum: number
  startweek: number
  endweek: number
}

export interface StudentApplyLabRequest extends ApplyLabBase {
  week: number
  reason: string
}

export interface DeleteApplyRequest {
  id: number
}

export interface UpdateLabStatusRequest {
  id: number
  status: '使用完毕'
}

export const SystemManagerApplyApi = {

  /** @description 获取申请列表(教师授课) */
  getTeacherApplyList: (page: number = 1, num: number = 20) => instance.post<GetTeacherApplyListResponse>(`/apply/getTApply`, JSON.stringify({ page, num })),

  /** @description 审批并发放实验室(教师授课) */
  examineTeacherApply: (data: ExamineApplyRequest) => instance.post<ExamineApplyRequest, {}>('/apply/examineTApply', JSON.stringify(data)),

  /** @description 获取申请列表(学生借用) */
  getStudentApplyList: (page: number = 1, num: number = 20) => instance.post<GetStudentApplyListResponse>(`/apply/getSApply`, JSON.stringify({ page, num })),

  /** @description 审批并发放实验室(学生借用) */
  examineStudentApply: (data: ExamineApplyRequest) => instance.post<ExamineApplyRequest, {}>('/apply/examineSApply', data),
}


export const TeacherApplyApi = {

  /** @description 获取当前老师所申请的实验室 */
  getApplyList: (page: number = 1, num: number = 20) => instance.post<GetApplyListByTeacherResponse>(`/apply/getClassApply`,  JSON.stringify({ page, num })),

  /** @description 申请授课实验室 */
  applyLab: (data: TeacherApplyLabRequest) => instance.post<TeacherApplyLabRequest, {}>('/apply/applyClassLab', data),

  /** @description 修改实验室申请单内容 */
  updateApply: (data: TeacherApplyLabRequest & { id: number }) => instance.post<TeacherApplyLabRequest & { id: number }, {}>('/apply/updateClassApply', data),

  /** @description 删除申请 */
  deleteApply: (data: DeleteApplyRequest) => instance.post<DeleteApplyRequest, {}>('/apply/deleteClassApply', data),
}


export const StudentApplyApi = {

  /** @description 获取当前学生所申请的实验室 */
  getApplyList: (page: number = 1, num: number = 20) => instance.post<GetApplyListByStudentResponse>(`/apply/getStuLabApply`, JSON.stringify({ page, num })),

  /** @description 申请使用实验室 */
  applyLab: (data: StudentApplyLabRequest) => instance.post<StudentApplyLabRequest, {}>('/apply/applyStuLab', data),

  /** @description 修改实验室申请单内容 */
  updateApply: (data: StudentApplyLabRequest & { id: number }) => instance.post<StudentApplyLabRequest & { id: number }, {}>('/apply/updateStuLabApply', data),

  /** @description 删除申请 */
  deleteApply: (data: DeleteApplyRequest) => instance.post<DeleteApplyRequest, {}>('/apply/deleteStuLabApply', data),

  /** @description 更新实验室使用状态 */
  updateLabStatus: (data: UpdateLabStatusRequest) => instance.post<UpdateLabStatusRequest, {}>('/apply/updateStuLabUseStatus', data),
}
