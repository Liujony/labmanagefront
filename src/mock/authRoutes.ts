import type { RouteRecordRaw } from 'vue-router'

export const SystemManagerRouter: RouteRecordRaw[] = [
  {
    path: 'semester',
    name: 'semester',
    component: () => import('@/views/systemManager/Semester.vue'),
    meta: {
      title: '学期管理',
      icon: 'semester',
      routeIndex: 1
    }
  },
  {
    path: 'user',
    name: 'user',
    component: () => import('@/views/systemManager/user/index.vue'),
    meta: {
      title: '平台用户管理',
      icon: 'user',
      routeIndex: 2
    }
  },
  {
    path: 'experimentSchedule',
    name: 'experimentSchedule',
    component: () => import('@/views/systemManager/approveTeacherLabApply/index.vue'),
    meta: {
      title: '实验排课',
      icon: 'schedule',
      routeIndex: 3
    }
  },
  {
    path: 'labApplyApprove',
    name: 'labApplyApprove',
    component: () => import('@/views/systemManager/approveStudentLabApply/index.vue'),
    meta: {
      title: '实验室借用审批',
      icon: 'approve',
      routeIndex: 4
    }
  },
]

export const LabTechnicianRouter: RouteRecordRaw[] = [
  {
    path: 'repair',
    name: 'repair',
    component: () => import('@/views/labTechnician/Repair.vue'),
    meta: {
      title: '实验室维修管理',
      icon: 'repair',
      routeIndex: 1
    }
  },
]

export const TeacherRouter: RouteRecordRaw[] = [
  {
    path: 'labApply',
    name: 'labApply',
    component: () => import('@/views/teacher/labApply/index.vue'),
    meta: {
      title: '实验室申请管理',
      icon: 'lab',
      routeIndex: 1
    }
  },
  {
    path: 'equipmentRepair',
    name: 'equipmentRepair',
    component: () => import('@/views/teacher/EquipmentRepair.vue'),
    meta: {
      title: '实验室设备保修管理',
      icon: 'repair',
      routeIndex: 2
    }
  },
]

export const StudentRouter: RouteRecordRaw[] = [
  {
    path: 'labApply',
    name: 'labApply',
    component: () => import('@/views/student/LabApply.vue'),
    meta: {
      title: '实验室申请',
      icon: 'lab',
      routeIndex: 1

    }
  }
]
