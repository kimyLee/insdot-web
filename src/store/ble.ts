import { Module, createStore } from 'vuex'

import type State from '@/store/interface'

import { blePlayMusic, bleSetLight, bleSetSingleLight, clearAllLight } from '@/api/joyo-ble/index'

import { connectJoyo, bleState, disconnectJoyo } from '@/api/web-ble/web-ble-server'
import { getFirmwareVersion } from '@/api/http/index'

export interface BleStateType {
  bleConnectStatus: boolean,
  lastVersion: string,
}

// 连接JOYO时，持续发送心跳包
let timer = null as any
function heartBeat () {
  clearInterval(timer)
  timer = setInterval(() => { // 定时防止休眠
    console.log('beat')
    bleSetSingleLight(11, 0x000000)
  }, 5000)
}

const bleModule: Module<BleStateType, State> = {
  namespaced: true,
  state: {
    bleConnectStatus: false, // 蓝牙连接状态
    lastVersion: '',
  },
  getters: {
    connectStatus (state) {
      return bleState.connectStatus
    },
    lastVersion (state) {
      return bleState.connectStatus
    },
  },
  mutations: {
  },
  actions: {
    bleConnect ({ commit, state }) { // 蓝牙连接
      // 1. 持续保持连接， 2. 连接JOYO
      heartBeat()
      connectJoyo()
    },
    bleDisconnect ({ commit, state }) { // 蓝牙断开连接
      clearInterval(timer) // 停止heartbeat
      disconnectJoyo()
    },
    async bleGetCurrentVersion ({ commit, state }) { // 获取当前远程固件版本
      getFirmwareVersion()
        .then((version: string) => {
          state.lastVersion = version
          console.log(state.lastVersion, 99)
        })
    },
  },
}

export default bleModule
