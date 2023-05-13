
import instance from '@/api/index'
import { IUserAuth, type LabTechnician, type Student, type Teacher, type User } from '@/type/user'

export interface Semester {
  semester: string
}

export interface GetUsersByFiltersRequest {
  auth?: Omit<IUserAuth, IUserAuth.SystemManager>
  UUID?: string
  username?: string
  major?: string
  class?: string
  page?: number
  num?: number
}

export interface GetUsersByFiltersResponse {
  page: number
  totalPage: number
  userlist: User[]
}

export type AddUserRequest =
  | Omit<Teacher, 'UUID'>
  | Omit<Student, 'UUID'>
  | Omit<LabTechnician, 'UUID'>

export interface DeleteUserRequest {
  UUID: string[]
}


export type UpdateUserRequest = User

export interface LoginRequest {
  uuid: string
  password: string
}

export interface LoginResponse {
  uuid: string
  username: string
  auth: IUserAuth
}

export interface ResetPasswordRequest {
  UUID: string
}

export interface ImportUsersRequest {
  auth: Omit<IUserAuth, IUserAuth.SystemManager>
  file: File
}

const userApi = {
  getUsersByFilters: ({
    auth = IUserAuth.LabTechnician,
    UUID = '',
    username = '',
    major = '',
    class: className = '',
    page = 1,
    num = 20
  }: GetUsersByFiltersRequest) => {
    const requestData = { auth, UUID, username, major, class: className, page, num }
    return instance.post<GetUsersByFiltersRequest, GetUsersByFiltersResponse>('/user/getUsers', requestData)
  },
  addUser: (data: AddUserRequest) => instance.post<AddUserRequest, {}>('/user/addUser', data),
  deleteUser: (data: DeleteUserRequest) => instance.post<DeleteUserRequest, {}>('/user/deleteUser', data),
  updateUser: (data: UpdateUserRequest) => instance.post<UpdateUserRequest, {}>('/user/updateUser', data),
  login: (data: LoginRequest) => instance.post<LoginRequest, LoginResponse>('/user/login', data),
  resetPassword: (data: ResetPasswordRequest) => instance.post<ResetPasswordRequest, {}>('/user/resetPass', data),
  importUsers: (data: ImportUsersRequest) => instance.post<ImportUsersRequest, {}>('/user/importUsers', data),
}

export default userApi
