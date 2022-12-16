import { message } from 'ant-design-vue'
import { Module, createStore } from 'vuex'

import type State from '@/store/interface'

import { blePlayMusic, bleSetLight, bleSetSingleLight, bleGetFirmWareVersion, bleUpgrade } from '@/api/joyo-ble/index'

import { connectJoyo, bleState, disconnectJoyo, bleDevice, DFUUpgrade } from '@/api/joyo-ble/web-ble-server'
import { fetchOriginVersion, fetchFirmware } from '@/api/http/index'

export interface BleStateType {
  bleConnectStatus: boolean,
  lastVersion: string,
  currentVersion: string,
  downloadLink: string,
  updateStep: number,
}

declare global {
  interface Window {
    SecureDfu: any,
  }
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

async function DDUpgrade (buffer: any, isReconnect: boolean) { // 升级
  const SecureDfu = window.SecureDfu
  const dfu = new SecureDfu(buffer)
  console.log('发送升级命令')
  dfu.addEventListener('log', (event: any) => {
    console.log(event.message, 'test')
  })
  dfu.addEventListener('progress', (event: any) => {
    console.log(event, 'testss')
  })

  // dfu.requestDevice(bleDevice, {
  //   service: '00002530-1212-efde-1523-785feabcd123',
  //   // control: '00002531-1212-efde-1523-785feabcd123',
  //   // packet: '00002532-1212-efde-1523-785feabcd123',
  //   button: '00002531-1212-efde-1523-785feabcd123',
  // })
  dfu.requestDevice(true, isReconnect)
    .then((device: any) => {
      console.log('after', device)
      if (!device) { // 蓝牙重连
        message.warning('请重连')
        // DDUpgrade(buffer)
      } else {
        console.log('进入传输')
        dfu.update(device, [], buffer)
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
}

const naviga: any = window.navigator

const bleModule: Module<BleStateType, State> = {
  namespaced: true,
  state: {
    bleConnectStatus: false, // 蓝牙连接状态
    lastVersion: '--',
    currentVersion: '--',
    downloadLink: '',
    updateStep: 0,
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

    async bleGetOriginVersion ({ commit, state }) { // 获取当前远程固件版本
      fetchOriginVersion()
        .then((data: any) => {
          state.lastVersion = data.version
          state.downloadLink = data.url
        })
    },

    // 获取固件版本
    async bleGetCurrentVersion ({ commit, state }) { // 获取当前远程固件版本
      bleGetFirmWareVersion()
        .then((data: any) => {
          if (data.code === 200) {
            state.currentVersion = data.result?.version || '--'
          }
        })
    },

    async bleReconnect ({ commit, state }) {
      const buffer = await fetchFirmware(state.downloadLink)
      console.log('开始进入DFU')
      DDUpgrade(buffer, true)
    },

    async bleUpgradeDevice ({ commit, state }) {
      state.updateStep = 0
      const buffer = await fetchFirmware(state.downloadLink)
      console.log(buffer, '文件下载完毕')
      // state.updateStep = 1 // 下载完毕
      console.log('开始初始化DFU')
      // const SecureDfu = window.SecureDfu
      // const dfu = new SecureDfu(buffer)
      console.log('发送升级命令')
      const res = await bleUpgrade({ // 发送准备升级命令
        version: state.lastVersion,
      })
      console.log('发送成功 res:', res)
      if (res.result.status === 1) {
        // DDUpgrade(buffer)
        // 可以升级
        // (window as any).handleDFUProgress(0)
        // BleApi.DFUUpgrade()
      } else {
        // 升级失败处理
        // updateJoyoDialog.value.updateFail()
      }
    },
  },
}

export default bleModule
