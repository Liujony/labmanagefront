<template>
  <el-row class="layout-container">
    <el-col :span="4">
      <nav-bar></nav-bar>
    </el-col>
    <el-col :span="20">
      <section class="layout-main">
        <header class="layout-header">
          <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item class="breadcrumb-item">{{ breadcrumbLabel }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 20px;">当前角色：{{ auth }}</div>
            <el-dropdown @command="handleCommand">
              <el-button type="primary" link>
                <div class="user-info">{{ username }}&nbsp;</div> 
                <el-icon><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
         
        </header>
        <Tab />
      </section>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './NavBar.vue'
import Tab from './Tabs.vue'
import useUserStore from '@/stores/user'
import { authFieldMap, authOption } from '@/type/field'

const route = useRoute()
const breadcrumbLabel = computed(() => route.meta.title)
const userStore = useUserStore()
const username = computed(() => userStore.username)
const auth = computed(() => authOption.find(authOpt => authOpt.value === userStore.auth)?.label)

const handleCommand = (command: string) => {
  if( command === 'logout') userStore.logout()
}
</script>
<style lang="scss">
.layout-container {
  width: 100vw;
  height: 100vh;
}

.layout-header {
  margin: 15px 20px;

  .breadcrumb-item {
    font-size: 16px;
  }
}

.el-menu {
  height: 100%;
}

.layout-main {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.user-info {

}
</style>