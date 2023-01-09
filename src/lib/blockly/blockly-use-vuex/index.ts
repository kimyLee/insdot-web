
// import { useStore } from 'vuex'
// import { useStore } from '@/store'

let store = null as any

export function initBlocklyStore (storeInstance: any) { // 初始化注册store
  store = storeInstance
}

export function openModalOfLightColor () {
  store.commit('blockly/togglePopLightVisible', true)
}
