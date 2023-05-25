<template>
  <div class="tab-container">
    <el-tabs
      v-model="activeTabName"
      :closable="isClosable"
      type="border-card"
      class="tab-bar"
      @tab-click="changeTab"
      @tab-remove="removeTab"
      @contextmenu.prevent="showContextMenu($event)" 
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        class="tab-pane"
        data-path="tab.path"
        lazy
      >
        <el-scrollbar>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </router-view>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <ul
      ref="contextMenuRef"
      v-show="contextMenuVisible"
      class="contextmenu"
      :style="{ top: contextMenuCoord.top, left: contextMenuCoord.left }"
    >
      <li @click="closeAll">关闭所有</li>
      <li @click="closeLeft">关闭左侧</li>
      <li @click="closeRight">关闭右侧</li>
      <li @click="closeOther">关闭其他</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
// import { emitter } from '@/utils/bus.js'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import useUserStore from '@/stores/user'
import useTabStore, { type Tab } from '@/stores/tab'
import useClickOutside from '@/utils/useClickOutside'
import type { TabPaneName, TabsPaneContext } from 'element-plus'

const route = useRoute()
const router = useRouter()

const contextMenuVisible = ref(false)
const contextMenuRef = ref<HTMLElement>()
const contextMenuTargetTab = ref<Tab>()
const contextMenuCoord = ref({
  left: '0px',
  top: '0px'
})

const userStore = useUserStore()
const tabStore = useTabStore()
const tabs = computed(() => {
  console.log('computed tabs', tabStore.tabs)
  return tabStore.tabs
})
const isClosable = computed(() => {
  console.log(tabs)
  return tabs.value.length > 1 || tabs.value[0]?.path !== '/welcome' 
})

const activeTab = computed(() => {
  console.log('computed activeTab', tabStore.activeTab)
  return tabStore.activeTab
})

const activeTabName = ref(activeTab.value?.path)

const showContextMenu = (event: MouseEvent) => {
  const { clientX, clientY } = event
  contextMenuCoord.value = {
    left: `${clientX}px`,
    top: `${clientY}px`
  }
  console.log(event.target)
  const target = (event.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null
  if (!target) return
  console.log(target, tabs.value.find(tab => tab.path === target.dataset.path))
  contextMenuTargetTab.value = tabs.value.find(tab => tab.path === target.dataset.path)
  contextMenuVisible.value = true
}

const hideContextMenu = () => {
  console.log('hide')
  if(!contextMenuVisible.value) return
  contextMenuVisible.value = false
}

const changeTab = async (tabsPaneContext: TabsPaneContext) => {
  const path = tabsPaneContext.props.name
  console.log('==[path]==', path, tabStore.tabs)
  if (!path) return
  const targetTab = tabStore.tabs.find((tab: Tab) => tab.path === path)!
  console.log('[targetTab]', targetTab)
  await router.push({
    path: targetTab.path,
    query: targetTab.query,
    params: targetTab.params,
  })
  console.log('[tabStore]', tabStore.activeTab?.path)
  console.log('[activeTabComputed]', activeTab.value!.path)
}

const removeTab = (path: TabPaneName) => {
  const tab = tabs.value.find((tab: Tab) => tab.path === path) as Tab
  tabStore.removeTab(tab)
}

const closeAll = () => {
  tabStore.removeAllTab()
}

const closeLeft = () => {
  if (!contextMenuTargetTab.value) return
  tabStore.removeLeftTab(contextMenuTargetTab.value)
}

const closeRight = () => {
  if (!contextMenuTargetTab.value) return
  tabStore.removeRightTab(contextMenuTargetTab.value)
}

const closeOther = () => {
  if (!contextMenuTargetTab.value) return
  // tabStore.removeOtherTab(contextMenuTargetTab.value)
}

useClickOutside(contextMenuRef, hideContextMenu)

watch(
  () => route,
  (to) => {
    console.log('watch route', to)
    if (to.name === 'login') return
    tabStore.addTab(to)
    
  },
  { deep: true, immediate: true }
)

watch(
  () => activeTab.value,
  () => {
    activeTabName.value = activeTab.value?.path
  }
)
onUnmounted(() => {
})
</script>

<style lang="scss">
.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.el-tabs__item .el-icon-close {
  color: initial !important;
}
.el-tabs__item .dot {
  content: "";
  width: 9px;
  height: 9px;
  margin-right: 8px;
  display: inline-block;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.contextmenu {
  position: fixed;
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
}
.contextmenu li:hover {
  background: #f2f2f2;
  cursor: pointer;
}

.tab-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tab-bar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tab-pane {
  height: 100%;
  flex: 1;
  overflow: auto;
}
</style>
