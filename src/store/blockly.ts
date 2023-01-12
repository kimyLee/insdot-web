import { message } from 'ant-design-vue'
import { Module, createStore } from 'vuex'

import type State from '@/store/interface'

export interface BlocklyStateType {
  popLightVisible: boolean,
  lightArray: string[],
}

const naviga: any = window.navigator

const subModule: Module<BlocklyStateType, State> = {
  namespaced: true,
  state: {
    popLightVisible: false,
    lightArray: Array(12).fill('#000000'),
  },
  getters: {
  },
  mutations: {
    togglePopLightVisible (state, visible) {
      state.popLightVisible = visible
    },
    setLightArray (state, value) {
      state.lightArray = [...value]
    },
  },
  actions: {
  },
}

export default subModule
