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

const route = useRoute()
const breadcrumbLabel = computed(() => route.meta.title)

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
</style>