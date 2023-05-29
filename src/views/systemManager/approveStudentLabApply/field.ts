import type { Field } from "@/type/field";
const checkStatus = (rule: any, value: any, callback: any) => {
  if (value !== '审核通过' && value !== '审核不通过') callback(new Error('请给出审批意见'))
  else callback()
}
export const field = [
  {
    prop: 'id',
    label: 'id',
    fixed: true,
    isId: true,
    updateRequired: true,
    editable: false,
    width: 40
  },
  {
    prop: 'username',
    label: '用户名',
    updateRequired: false,
    invisible: false,
    editable: false,
  },
  {
    prop: 'semester',
    label: '学期',
    fixed: false,
    updateRequired: false,
    editable: true,
    width: 120
  },
  {
    prop: 'labtype',
    label: '实验室类型',
    fixed: false,
    updateRequired: false,
    editable: true,
    width: 140
  },
  {
    prop: 'week',
    label: '周次',
    fixed: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
  {
    prop: 'reason',
    label: '申请理由',
    fixed: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
  {
    prop: 'day',
    label: '星期',
    fixed: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
  {
    prop: 'section',
    label: '节次',
    fixed: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
  {
    prop: 'status',
    label: '状态',
    fixed: false,
    updateRequired: true,
    editable: true,
    options: [
      { label: '审核通过', value: '审核通过' },
      { label: '审核不通过', value: '审核不通过' },
    ],
    rule: [
      { validator: checkStatus, trigger: 'blur' }
    ]
  },
  {
    prop: 'name',
    label: '实验室',
    fixed: false,
    updateRequired: false,
    editable: true,
  },
] as Field[]