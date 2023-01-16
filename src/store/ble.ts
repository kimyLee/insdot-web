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
  transferProgress: number,
}

declare global {
  interface Window {
    SecureDfuPackage: any,
  }
}

// 连接JOYO时，持续发送心跳包
let timer = null as any
function heartBeat () {
  clearInterval(timer)
  timer = setInterval(() => { // 定时防止休眠
    // console.log('beat')
    bleSetSingleLight(11, 0x000000)
  }, 5000)
}

const naviga: any = window.navigator

const bleModule: Module<BleStateType, State> = {
  namespaced: true,
  state: {
    bleConnectStatus: false, // 蓝牙连接状态
    lastVersion: '',
    currentVersion: '',
    downloadLink: '',
    updateStep: 0,
    transferProgress: 0,
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
    resetUpgradeStatus (state) {
      state.updateStep = 0
    },
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

    // async bleReconnect ({ commit, state }) {
    //   const buffer = await fetchFirmware(state.downloadLink)
    //   console.log('开始进入DFU')
    //   DFUpgrade(buffer, true)
    // },

    async bleUpgradeDevice ({ commit, state }) {
      state.updateStep = 1 // 准备下载固件
      // const buffer = await fetchFirmware(state.downloadLink)
      // 测试固件
      const buffer = await fetchFirmware('https://cuby-joyo.oss-cn-hongkong.aliyuncs.com/joyo_v4_1223_01_UUID2530.zip')
      const SecureDfuPackage = window.SecureDfuPackage
      const myPackage = new SecureDfuPackage(buffer)
      let firmware
      await myPackage.load()
        .then(() => {
          return myPackage.getAppImage().then((image: any) => {
            firmware = image.imageData
          })
        })
      state.updateStep = 2 // 固件下载完毕，准备传输
      const res = await bleUpgrade({ // 发送准备升级命令
        version: state.lastVersion,
      })
      if (res.result.status === 1) {
        DFUUpgrade(firmware, (progress: number) => { // 返回传输进度会调
          state.transferProgress = progress
        })
          .then(() => { // 升级完成等待设备重连
            state.updateStep = 3 // 传输完成，等待设备升级重启
            state.transferProgress = 0
            // reconnectDevice()
          })
          .catch((err) => {
            message.error('升级失败，请稍后重试')
            console.log(err)
            commit('resetUpgradeStatus')
          })
      } else {
        message.error('升级失败，写入固件版本号出错')
        commit('resetUpgradeStatus')
      }
    },
  },
}

export default bleModule
