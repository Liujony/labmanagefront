// import useUserStore from "@/stores/user"
import router from '@/router'
import axios from 'axios'

const instance = axios.create({
  timeout: 10 * 1000,
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

type IErrorStatus = number
const handleError = (status: IErrorStatus, msg: string) => {
  switch (status) {
    case 401:
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.value
        }
      })
      break
    case 403:
      Toast({
        message: '登录过期，请重新登录',
        duration: 1000,
        forbidClick: true
      })
      // 清除token
      localStorage.removeItem('token')
      store.commit('loginSuccess', null)
      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
      setTimeout(() => {
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }, 1000)
      break

    case 404:
      Toast({
        message: '网络请求不存在',
        duration: 1500,
        forbidClick: true
      })
      break
    // 其他错误，直接抛出错误提示
    default:
      Toast({
        message: error.response.data.message,
        duration: 1500,
        forbidClick: true
      })
  }
  return Promise.reject(error.response)
}

axios.interceptors.request.use(
  config => config
    // const userStore = useUserStore()
    // const token = userStore.token
    // if (token) {
    //   config.headers.Authorization = token
    // }
  ,
  error => Promise.reject(error)
)

axios.interceptors.response.use(
  response => response.status === 200
      ? Promise.resolve(response)
      : Promise.reject(response),
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      handleError(response.status, response.data.msg)
      return Promise.reject(response)
  } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
         store.commit('changeNetwork', false)
      } else {
          return Promise.reject(error)
      }
  }

  }
)

export default instance
