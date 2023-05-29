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
    prop: 'course',
    label: '课程',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    width: 140,
    rule: [
      { required: true, message: '请输入课程名称', trigger: 'blur' },
    ]
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
  {
    prop: 'stunum',
    label: '上课人数',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    isNumber: true,
    rule: [
      { required: true, message: '请输入上课人数', trigger: 'blur' },
      { type: 'number', message: '请输入整数', trigger: 'blur' }
    ]
  },
  {
    prop: 'startweek',
    label: '起始周次',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    isNumber: true,
    rule: [
      { required: true, message: '请输入起始周次', trigger: 'blur' },
      { validator: checkWeek, trigger: 'blur' }
    ]
  },
  {
    prop: 'endweek',
    label: '结束周次',
    fixed: false,
    creationRequired: true,
    updateRequired: true,
    editable: true,
    isNumber: true,
    rule: [
      { required: true, message: '请输入结束周次', trigger: 'blur' },
      { validator: checkWeek, trigger: 'blur' },
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
    prop: 'status',
    label: '状态',
    fixed: false,
    updateRequired: false,
    editable: false,
    options: [
      { label: '未排课', value: '审核中'},
      { label: '已排课', value: '通过' },
      { label: '不通过', value: '不通过' },
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