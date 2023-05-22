import type { FormItemRule } from "element-plus/lib/components/form/src/types.js"
import { IUserAuth, type LabTechnician, type Student, type Teacher } from "./user"

export type Option = {
  label: string
  value: any
}

export function isOption (val: any): val is Option {
  return typeof val === 'object' && ('label' in val) && ('value' in val)
}

export type Field = {
  prop: string
  label: string
  fixed?: boolean
  width?: number
  isId?: boolean
  isNumber?: boolean
  creationRequired?: boolean
  updateRequired?: boolean
  editable?: boolean
  invisible?: boolean
  rule?: Array<FormItemRule>
  values?: Array<any>
  options?: Array<Option>
  default?: any
}

export const authOption = [
  { label: '教师', value: IUserAuth.Teacher },
  { label: '实验员', value: IUserAuth.LabTechnician },
  { label: '学生', value: IUserAuth.Student },
]


export const studentField = [
  {
    prop: 'uuid',
    label: '学号',
    fixed: false,
    isId: true,
    creationRequired: false,
    updateRequired: true,
    editable: false,
  },
  {
    prop: 'auth',
    label: '权限等级',
    creationRequired: false,
    updateRequired: false,
    default: IUserAuth.Student,
    invisible: true,
    editable: false,
    options: authOption,
  },
  {
    prop: 'username',
    label: '姓名',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    rule: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
    ]
  },
  {
    prop: 'major',
    label: '专业',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    rule: [
      { required: true, message: '请输入专业', trigger: 'blur' },
    ]
  },
  {
    prop: 'classnum',
    label: '班级',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
] as Field[]

export const teacherField = [
  {
    prop: 'uuid',
    label: '工号',
    fixed: false,
    isId: true,
    creationRequired: false,
    updateRequired: true,
    editable: false,
  },
  {
    prop: 'auth',
    label: '权限等级',
    creationRequired: false,
    updateRequired: false,
    default: IUserAuth.Teacher,
    invisible: true,
    editable: false,
    options: authOption,
  },
  {
    prop: 'username',
    label: '姓名',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    rule: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
    ]
  },
  {
    prop: 'title',
    label: '职称',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    options: [
      { label: '教授', value: '教授' },
      { label: '副教授', value: '副教授' },
      { label: '讲师', value: '讲师' }
    ],
    default: '教授',
    rule: [
      { required: true, message: '请输入职称', trigger: 'blur' },
    ]
  }
] as Field[]

export const labTechnicianField = [
  {
    prop: 'uuid',
    label: '工号',
    fixed: false,
    isId: true,
    creationRequired: false,
    updateRequired: true,
    editable: false,
  },
  {
    prop: 'auth',
    label: '权限等级',
    creationRequired: false,
    updateRequired: false,
    default: IUserAuth.LabTechnician,
    editable: false,
    invisible: true,
    options: authOption,
  },
  {
    prop: 'username',
    label: '姓名',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    rule: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
    ]
  },
  {
    prop: 'title',
    label: '职称',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    options: [
      { label: '实验员', value: '实验员' },
    ],
    default: '实验员',
    rule: [
      { required: true, message: '请输入职称', trigger: 'blur' },
    ]
  }
] as Field[]

export type AuthFieldMapKey = Exclude<IUserAuth, IUserAuth.Unauthorized | IUserAuth.SystemManager>
export const authFieldMap: Record<AuthFieldMapKey, Field[]> = {
  [IUserAuth.Student]: studentField,
  [IUserAuth.LabTechnician]: labTechnicianField,
  [IUserAuth.Teacher]: teacherField
}

export type AddUserFormByAuth<T extends IUserAuth> = 
  T extends IUserAuth.Student
    ? Omit<Student, 'uuid'>
    : T extends IUserAuth.LabTechnician
      ? Omit<LabTechnician, 'uuid'>
      : Omit<Teacher, 'uuid'>



