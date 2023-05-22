import router from '@/router'
import nProgress from 'nprogress'
import useUserStore from './stores/user'
import { IUserAuth } from './type/user'
import useRouteStore from './stores/route'
// const whiteList: RouteRecordName[] = ['Login', 'Init']

// const getRouter = async(userAuth: IUserAuth) => {
//   const routeStore = useRouteStore()
//   routeStore.addRoutesByAuth(userAuth)
// }

// async function handleKeepAlive(to) {
//   if (to.matched.some(item => item.meta.keepAlive)) {
//     if (to.matched && to.matched.length > 2) {
//       for (let i = 1; i < to.matched.length; i++) {
//         const element = to.matched[i - 1]
//         if (element.name === 'layout') {
//           to.matched.splice(i, 1)
//           await handleKeepAlive(to)
//         }
//         // 如果没有按需加载完成则等待加载
//         if (typeof element.components.default === 'function') {
//           await element.components.default()
//           await handleKeepAlive(to)
//         }
//       }
//     }
//   }
// }




// import useRouteStore from './stores/route';
// import useUserStore from './stores/user';
// import { IUserAuth } from './type/user';

// const { auth } = useUserStore()
// const routeStore = useRouteStore()
// if (auth !== IUserAuth.Unauthorized) routeStore.addRoutesByAuth(auth)