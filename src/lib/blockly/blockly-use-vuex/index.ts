
// import { useStore } from 'vuex'
// import { useStore } from '@/store'
import EventBus from 'js-event-bus'

export const eventBus = new EventBus() // 所有回调通过eventBus
let store = null as any // 所有主动触发通过store

export function initBlocklyStore (storeInstance: any) { // 初始化注册store
  store = storeInstance
}

export function openModalOfLightColor (value: string[], cb: any) {
  store.commit('blockly/setLightArray', value)
  store.commit('blockly/togglePopLightVisible', true)
  eventBus.once('updateLightColor', (array: any) => {
    cb(array)
  })
}
