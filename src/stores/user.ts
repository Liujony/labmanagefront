import userApi, { type LoginRequest } from '@/api/user'
import { IUserAuth } from '@/type/user'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import useRouteStore from './route'
import router from '@/router'
import md5 from 'md5'
interface IUserState {
  uuid: string
  username: string
  auth: IUserAuth
  token: string
}

const uuid_KEY = 'uuid'
const USERNAME_KEY = 'username'
const AUTH_KEY = 'auth'

const useUserStore = defineStore('user', {
  state: (): IUserState => {
    const defaultUserInfo = {
      uuid: '',
      username: '',
      auth: IUserAuth.Unauthorized,
    }
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo') ?? 'null')
    return userInfo ?? defaultUserInfo
  },

  getters: {

  },

  actions: {
    async login (loginData: LoginRequest) {
      loginData.password = md5(loginData.password)
      try {
        const res = await userApi.login(loginData)
        const { auth, uuid, username } = res
        this.uuid = uuid
        this.username = username
        this.auth = auth

        const userInfo = {
          uuid,
          username,
          auth
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))

        const routeStore = useRouteStore()
        routeStore.addRoutesByAuth(auth)

        ElMessage.success('登录成功')
        router.push('/')
      } catch (err) {
        console.error(err)
        ElMessage.error('登录失败')
      }
      // router.push(redirectRoute)
    },
    async logout () {
      localStorage.clear()
      router.push('/login')
    }
  }
})

export default useUserStore
