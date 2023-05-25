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

export const repairStatusOption = [
  { label: '维修申报中', value: '维修申报中'},
  { label: '维修中', value: '维修中' },
  { label: '已维修', value: '已维修' },
  // { label: '维修完毕', value: '维修完毕' },
]

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
    prop: 'name',
    label: '实验室',
    fixed: false,
    creationRequired: false,
    updateRequired: false,
    editable: false,
    width: 140,
    rule: [
      { required: true, message: '请选择实验室', trigger: 'blur' },
    ]
  },
  {
    prop: 'reason',
    label: '故障描述',
    fixed: false,
    creationRequired: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入故障描述', trigger: 'blur' },
    ]
  },
  {
    prop: 'applydate',
    label: '报修日期',
    fixed: false,
    creationRequired: false,
    updateRequired: false,
    editable: false,
  },
  {
    prop: 'status',
    label: '状态',
    fixed: false,
    updateRequired: true,
    editable: true,
    options: repairStatusOption
  },
  {
    prop: 'finishdate',
    label: '维修日期',
    fixed: false,
    updateRequired: false,
    editable: false,
    width: 200,
  },
] as Field[]