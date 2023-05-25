<template>
  <div class="blank-page-container">
    <div>
      <img class="blank-page-img" src="public/assets/工作.png"/>
    </div>
    <div>
      <h1>你好，{{ username }}</h1>
      <h3>请点击左侧导航栏开始使用</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
import useUserStore from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const username = computed(() => userStore.username)
</script>
<style lang="scss">
.blank-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 100%;
}

.blank-page-img {
  width: 600px;
  
}
</style>