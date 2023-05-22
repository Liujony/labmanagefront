
import { createApp } from 'vue'
import store from '@/stores'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/style.scss'
import ElementPlus from 'element-plus'
import './assets/main.css'
// import '@/permission'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(store)
app.use(router)

app.mount('#app')
