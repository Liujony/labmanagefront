import type { RouteRecordConfig } from "@/router"
import router from "@/router"
import { defineStore } from "pinia"
import type { LocationQueryRaw, RouteLocationNormalizedLoaded, RouteParamsRaw } from "vue-router"

export interface Tab {
  title: string
  path: string
  query?: Record<string, any>
  params?: Record<string, any>
}

interface ITabState {
  tabs: Tab[],
  history: Tab[],
  activeTab: Tab | null
}

const useTabStore = defineStore('tab', {
  state: (): ITabState => ({
    tabs: JSON.parse(window.sessionStorage.getItem('tabs') ?? '[]'),
    activeTab: JSON.parse(window.sessionStorage.getItem('activeTab') ?? 'null'),
    history: JSON.parse(window.sessionStorage.getItem('history') ?? '[]'),
  }),

  getters: {
    activeTabPath: (state) => state.activeTab?.path
  },

  actions: {
    // init() {
    //   const historyTabs = JSON.parse(window.sessionStorage.getItem('tabs') ?? '[]')
    //   const historyActiveTab = 
    //   this.tabs = historyTabs as Tab[]
    //   this.activeTab = historyActiveTab
    // },
    updateSessionStorage () {
      window.sessionStorage.setItem('activeTab', JSON.stringify(this.activeTab))
      window.sessionStorage.setItem('tabs', JSON.stringify(this.tabs))
      window.sessionStorage.setItem('history', JSON.stringify(this.history))
    },
    addTab (route: RouteLocationNormalizedLoaded) {
      const { meta, path, query, params } = route
      const existTab = this.tabs.find(tab => tab.path === path)
      if (existTab) {
        this.activeTab = existTab
        const historyIndex = this.history.findIndex(tab => tab.path === existTab.path)
        this.history.splice(historyIndex, 1)
        this.history.push(existTab)
        this.updateSessionStorage()
        console.log('activeTab', this.activeTab)
        console.log('addTab over')
        return
      }

      const newTab = {
        title: meta.title as string,
        path,
        query,
        params
      }

      this.tabs.push(newTab)

      this.activeTab = newTab
      this.history.push(newTab)

      this.updateSessionStorage()
      console.log('activeTab', this.activeTab)
      console.log('addTab over')
    },

    removeTab (targetTab: Tab) {
      const isRemoveActiveTab = targetTab.path === this.activeTab?.path
      this.tabs = this.tabs.filter(tab => tab.path !== targetTab.path)
      this.history = this.history.filter(tab => tab.path !== targetTab.path)
      if (isRemoveActiveTab) {
        this.activeTab = this.history[this.history.length - 1]
        router.replace({ path: this.activeTabPath! })
      }
      this.updateSessionStorage()
    },

    removeAllTab () {
      this.tabs = []
      this.history = []
      window.sessionStorage.removeItem('tabs')
    },

    removeLeftTab (targetTab: Tab) {
      const startIndex = this.tabs.findIndex(tab => tab.path === targetTab.path)
      this.tabs = this.tabs.slice(startIndex)
      this.history = this.history.filter(historyTab => 
        this.tabs.some(tab => tab.path === historyTab.path)
      )
      this.updateSessionStorage()
    },

    removeRightTab (targetTab: Tab) {
      const endIndex = this.tabs.findIndex(tab => tab.path === targetTab.path)
      this.tabs = this.tabs.slice(0, endIndex + 1)
      this.history = this.history.filter(historyTab => 
        this.tabs.some(tab => tab.path === historyTab.path)
      )
      this.updateSessionStorage()
    },

    changeTab () {

    },
  }
})

export default useTabStore