import type { Field } from "@/type/field";

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
    prop: 'classnum',
    label: '班级',
    fixed: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
  {
    prop: 'stunum',
    label: '上课人数',
    fixed: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
  {
    prop: 'startweek',
    label: '起始周次',
    fixed: false,
    updateRequired: false,
    editable: true,
    rule: [
      { required: true, message: '请输入班级', trigger: 'blur' },
    ]
  },
  {
    prop: 'endweek',
    label: '结束周次',
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
      { label: '通过', value: '通过' },
      { label: '不通过', value: '不通过' },
    ]
  },
  {
    prop: 'lab',
    label: '实验室',
    fixed: false,
    updateRequired: false,
    editable: true,
  },
] as Field[]