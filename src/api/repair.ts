import instance from './index'

export type RepairStatus = '未维修' | '维修中' | '已维修'
export interface RepairApplyItem {
  id: number
  labname: string
  reason: string
  applydate: Date
  status: RepairStatus
  repairdate?: Date
}

export interface RepairApplyListResponse {
  current: number
  total: number
  records: RepairApplyItem[]
}

export interface ApplyRepairRequest {
  labid: number
  reason: string
  status: RepairStatus
}

export interface UpdateApplyRequest extends ApplyRepairRequest {
  id: number
}

export interface DeleteApplyRequest {
  id: number
}

export interface Lab {
  id: number
  name: string
}

export type LabsList = Lab[]

export interface UpdateRepairRequest {
  id: number
  status: Omit<RepairStatus, '未维修'>
}

export const teacherRepairApi = {

  /** @description 获取当前老师所申报的实验室报修 */
  getApplyList: (page: number = 1, num: number = 20) => instance.post<RepairApplyListResponse>('/repair/getMyApply', JSON.stringify({ page, num })),

  /** @description 申请报修 */
  applyRepair: (data: ApplyRepairRequest) => instance.post<ApplyRepairRequest, {}>('/repair/applyLabRepair', data),

  /** @description 修改报修申请单内容 */
  updateApply: (data: UpdateApplyRequest) => instance.post<UpdateApplyRequest, {}>('/repair/updateMyApply', data),

  /** @description 删除申请 */
  deleteApply: (data: DeleteApplyRequest) => instance.post<DeleteApplyRequest, {}>('/repair/deleteMyApply', data),

  /** @description 获取所有的 ID + 实验室 */
  getAllLab: () => instance.get<LabsList>('/repair/getAllLab'),
}

export const LabTechnicianRepairApi = {

  /** @description 获取当前实验员所管理的实验室报修 */
  getRepairList: (page: number = 1, num: number = 20) => instance.post<RepairApplyListResponse>(`/repair/getLabRepair`, JSON.stringify({ page, num })),

  /** @description 修改报修 */
  updateRepair: (data: UpdateRepairRequest) => instance.post<UpdateRepairRequest, {}>('/repair/updateLabRepair', data),
}
