import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordName, RouteRecordRaw } from 'vue-router'
import Nprogress from 'nprogress'
import useUserStore from '@/stores/user'
import { IUserAuth } from '@/type/user'
import useRouteStore from '@/stores/route'
import nProgress from 'nprogress'

export interface RouteRecordConfig {
  path: string
  name: RouteRecordName | undefined
  meta: {
    title: string
    icon: string
    routeIndex: number
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        hidden: true,
      }
    },
    
  ]
})

export const layoutRoute = {
  path: '/',
  name: 'layout',
  component: () => import('@/views/layout/Layout.vue'),
  meta: {
    title: 'Layout'
  },
}

router.beforeEach(async(to, from) => {
  const userStore = useUserStore()
  const routeStore = useRouteStore()
  const { auth } = userStore
  const { isRouteInit } = routeStore

  console.log('router before')
  if (auth === IUserAuth.Unauthorized && to.name !== 'login') {
    return { name: 'login' }
  }
  if (auth !== IUserAuth.Unauthorized && !isRouteInit) {
    routeStore.init(auth)
    return { path: to.path }
  }
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})

router.onError(() => {
  nProgress.remove()
})

export default router
