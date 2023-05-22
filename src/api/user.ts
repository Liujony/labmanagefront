
import instance from '@/api/index'
import { IUserAuth, type LabTechnician, type Student, type Teacher, type User } from '@/type/user'

export interface Semester {
  semester: string
}

export interface GetUsersByFiltersRequest {
  auth?: Omit<IUserAuth, IUserAuth.SystemManager>
  uuid?: string
  username?: string
  major?: string
  classnum?: string
  page?: number
  num?: number
}

export interface GetUsersByFiltersResponse {
  current: number
  total: number
  records: User[]
}

export type AddUserRequest =
  | Omit<Teacher, 'uuid'>
  | Omit<Student, 'uuid'>
  | Omit<LabTechnician, 'uuid'>

export interface DeleteUserRequest {
  uuid: string[]
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
  uuid: string
}

export interface ImportUsersRequest {
  auth: Omit<IUserAuth, IUserAuth.SystemManager>
  file: File
}

const userApi = {
  getUsersByFilters: ({
    auth = IUserAuth.LabTechnician,
    uuid = '',
    username = '',
    major = '',
    classnum,
    page = 1,
    num = 20
  }: GetUsersByFiltersRequest) => {
    const requestData = JSON.stringify({ auth, uuid, username, major, classnum, page, num })
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
