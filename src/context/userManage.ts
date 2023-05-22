import type { AddUserRequest, DeleteUserRequest, GetUsersByFiltersResponse } from "@/api/user"
import type { AuthFieldMapKey } from "@/type/field"
import type { User } from "@/type/user"
import type { Ref, InjectionKey } from "vue"

interface userManageContext {
  data: Ref<GetUsersByFiltersResponse['records']>
  pageSize: Ref<number>
  curPage: Ref<number>
  total: Ref<number>
  handlePageSizeChange: (newSize: number) => void
  handlePageChange: (page: number) => void

  auth: Ref<AuthFieldMapKey>
  createFormVisible: Ref<boolean>
  toggleCreateForm: () => void
  create: (data: AddUserRequest) => Promise<{}>
  getUserList: () => Promise<void>
  deleteUser: (userData: DeleteUserRequest) => Promise<void>
  updateUser: (userData: User) => Promise<void>
}

export const USER_MANAGE_INJECTION_KEY: InjectionKey<userManageContext> = Symbol('UserManage') 