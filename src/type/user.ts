export enum IUserAuth {
  SystemManager = 1,
  LabTechnician,
  Teacher,
  Student
}


interface UserBasic {
  UUID: string
  username: string
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
  class: string
}

export type User = Teacher | Student | LabTechnician
