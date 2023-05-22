import { IUserAuth } from "@/type/user"
import { defineStore } from "pinia"
import router, { layoutRoute, type RouteRecordConfig } from "@/router"
import { LabTechnicianRouter, StudentRouter, SystemManagerRouter, TeacherRouter } from "@/mock/authRoutes"
import type { RouteRecordRaw } from "vue-router"

type AuthInRouterConfig = Exclude<IUserAuth, IUserAuth.Unauthorized>
const ROUTER_CONFIG: Record<AuthInRouterConfig, RouteRecordRaw[]> = {
  [IUserAuth.SystemManager]: SystemManagerRouter,
  [IUserAuth.LabTechnician]: LabTechnicianRouter,
  [IUserAuth.Teacher]: TeacherRouter,
  [IUserAuth.Student]: StudentRouter,
}

const useRouteStore = defineStore('route', {
  state: () => ({
    isRouteInit: false,
    routes: [] as RouteRecordConfig[],
  }),

  actions: {
    init(auth: AuthInRouterConfig) {
      this.addRoutesByAuth(auth)
      this.isRouteInit = true
    },
    addRoutesByAuth (auth: AuthInRouterConfig) {
      const routes = ROUTER_CONFIG[auth]
      this.routes = routes.map(({ path, name, meta}): RouteRecordConfig => {
        const { title, icon, routeIndex } = meta as RouteRecordConfig['meta']
        return {
          path,
          name,
          meta: {
            title,
            icon,
            routeIndex
          }
        }
      })
      router.addRoute(layoutRoute)
      routes.forEach((route) => router.addRoute('layout', route))
    }
  }
})

export default useRouteStore