export enum IUserAuth {
  SystemManager = 1,
  LabTechnician,
  Teacher,
  Student,
  Unauthorized = -1
}

export const AUTH_LABEL_MAP = ['unknown', '系统管理员', '实验员', '教师', '学生'] as const

interface UserBasic {
  uuid: string
  username: string
  role: typeof AUTH_LABEL_MAP[number]
}

type TeacherTitle = '教授' | '副教授' | '讲师'
type LabTechnicianTitle = '实验师'

export interface Teacher extends UserBasic {
  auth: IUserAuth.Teacher
  title: TeacherTitle
}

export interface LabTechnician extends UserBasic {
  auth: IUserAuth.LabTechnician
  title: LabTechnicianTitle
}

export interface Student extends UserBasic {
  auth: IUserAuth.Student
  major: string
  classnum: string
}

export type User = Teacher | Student | LabTechnician
