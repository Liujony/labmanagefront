<template>
  <el-row class="navbar-container">
    <el-col :span="24">
      <!-- <h1>系统</h1> -->
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @open="handleOpen"
        router
      >
        <el-menu-item
          v-for="{ meta: { routeIndex, title, icon }, path } in menus"
          :index="path"
          :key="routeIndex"
        >
          <el-icon :type="icon"></el-icon>
          <span>{{ title }}</span>
        </el-menu-item>

      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import useRouteStore from '@/stores/route'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const routeStore = useRouteStore()
const router = useRouter()
const route = useRoute()
const activePath = computed(() => route.name)
const menus = routeStore.routes

const handleOpen = (path: string, keyPath: string[]) => {
  router.push(path)
}
</script>

<style scoped>
.navbar-container {
  height: 100%;
  width: 100%;
  background-color: #fff;
}

.navbar-label {
  margin: 10px 0 10px 20px;
  color: #aaa;
}
</style>