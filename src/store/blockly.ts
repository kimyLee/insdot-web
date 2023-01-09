import { message } from 'ant-design-vue'
import { Module, createStore } from 'vuex'

import type State from '@/store/interface'

export interface BlocklyStateType {
  popLightVisible: boolean,
}

const naviga: any = window.navigator

const subModule: Module<BlocklyStateType, State> = {
  namespaced: true,
  state: {
    popLightVisible: false,
  },
  getters: {
  },
  mutations: {
    togglePopLightVisible (state, visible) {
      console.log('togglePopLightVisible', visible)
      state.popLightVisible = visible
    },
  },
  actions: {
  },
}

export default subModule
