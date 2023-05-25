import { labTypeOption, type Field, sectionOption, dayOption } from "@/type/field";
const checkWeek = (rule: any, value: any, callback: any) => {
  const data = Number(value)
  if (Number.isNaN(data)) callback(new Error('请输入合法的周次'))
  else if (data <= 0 || data > 20) callback(new Error('请输入合法的周次'))
  else callback()
}
const checkDay = (rule: any, value: any, callback: any) => {
  const data = Number(value)
  if (Number.isNaN(data)) callback(new Error('请输入合法的星期'))
  else if (data <= 0 || data > 5) callback(new Error('请输入合法的星期'))
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
    prop: 'semester',
    label: '学期',
    fixed: false,
    updateRequired: true,
    editable: false,
    width: 120
    // options: 
  },
  {
    prop: 'labtype',
    label: '实验室类型',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    width: 140,
    options: labTypeOption,
    rule: [
      { required: true, message: '请选择实验室类型', trigger: 'blur' },
    ]
  },
  {
    prop: 'week',
    label: '周次',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    isNumber: true,
    rule: [
      { required: true, message: '请输入周次', trigger: 'blur' },
      { validator: checkWeek, trigger: 'blur' }
    ]
  },
  {
    prop: 'day',
    label: '星期',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    isNumber: true,
    options: dayOption,
    rule: [
      { required: true, message: '请选择星期', trigger: 'blur' },
    ]
  },
  {
    prop: 'section',
    label: '节次',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    rule: [
      { required: true, message: '请选择节次', trigger: 'blur' },
    ],
    options: sectionOption
  },
  {
    prop: 'reason',
    label: '申请理由',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    rule: [
      { required: true, message: '请输入申请理由', trigger: 'blur' },
    ]
  },
  {
    prop: 'status',
    label: '状态',
    fixed: false,
    updateRequired: false,
    editable: false,
    options: [
      { label: '审核中', value: '审核中'},
      { label: '审核通过', value: '审核通过' },
      { label: '审核不通过', value: '审核不通过' },
      { label: '使用完毕', value: '使用完毕' },
    ]
  },
  {
    prop: 'lab',
    label: '实验室',
    fixed: false,
    updateRequired: false,
    editable: false,
    width: 200,
  },
] as Field[]