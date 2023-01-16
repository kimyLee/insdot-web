
import {
  CommandType,
  CommandOrder,
} from './config'

import {
  generateReqParams,
  handleSendCommand,
  // handleSendCommandWithoutRsp,
} from './utils'

import { sendCommand } from '@/api/joyo-ble/web-ble-server'

export async function bleGetFirmWareVersion () {
  const params = generateReqParams(CommandType.COMMON, CommandOrder.GET_VERSION)
  return handleSendCommand(params)
}

// // 发送升级命令
export async function bleUpgrade (data: { version: string }) {
  const params = generateReqParams(CommandType.UPGRADE, CommandOrder.BEGIN_UPGRADE, data)
  return handleSendCommand(params)
}

// // 清除升级状态
// export async function bleResetUpgrade () {
//   const params = generateReqParams(CommandType.UPGRADE, CommandOrder.RESET_UPGRADE, null, false)
//   return handleSendCommandWithoutRsp(params)
// }

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 控制灯效
export async function bleSetLight (data: { colors: number[], bright: number }) { // todo: params ide提示
  try {
    data.colors = data.colors.map((e: any) => {
      if (typeof (e) === 'string' && e.indexOf('#') >= 0) {
        e = e.replace('#', '0x')
      }
      return Number(e)
    })
    const len = data.colors.length
    if (len < 12) {
      for (let i = 0; i < (12 - len); i++) {
        data.colors.push(0)
      }
    }
    const params = generateReqParams(CommandType.CONTROL, CommandOrder.CONTROL_LIGHT, data)
    // const params = [85, 161, 44, 178, 54, 0, 40, 207, 0, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 205, 204, 204, 61]
    // handleSendCommandWithoutRsp(params)
    sendCommand(params)
  } catch (err) {
    console.log(err)
  }
}

export async function clearAllLight () { // todo: params ide提示
  const arr = JSON.parse(JSON.stringify(Array(12).fill(0x000000)))
  const params = generateReqParams(CommandType.CONTROL, CommandOrder.CONTROL_LIGHT, {
    colors: arr,
    bright: 1,
  })
  sendCommand(params)
}

// 控制灯效动画
// export async function bleSetLight (data: { colors: number[], bright: number }) { // todo: params ide提示
//   const params = generateReqParams(CommandType.CONTROL, CommandOrder.CONTROL_LIGHT, data)
//   // const params = [85, 161, 44, 178, 54, 0, 40, 207, 0, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 205, 204, 204, 61]
//   // handleSendCommandWithoutRsp(params)
//   sendCommand(params)
// }

// 使能摇晃
export async function enableShake () { // todo: params ide提示
  // handleSendCommandWithoutRsp([0x55, 0xA1, 0x05, 0xB1, 0x05, 0x01, 0x00])
}

// 控制单个灯效
export async function bleSetSingleLight (num: number, color: number) { // todo: params ide提示
  const params = generateReqParams(CommandType.CONTROL, CommandOrder.CONTROL_SINGLE_LIGHT, { color: [color], num })
  // handleSendCommandWithoutRsp(params)
  sendCommand(params)
}

// 控制音效
export async function blePlayMusic (id: string) { // 长度小于4
  const params = generateReqParams(CommandType.CONTROL, CommandOrder.CONTROL_MUSIC, { id })
  // return handleSendCommandWithoutRsp(params)
  sendCommand(params)
  // await sleep(50)
}

// // 准备mp3传输, todo: CommandType 两个参数合并
// export async function readyMp3Transfer (data: { filename: string, size: number }) { // 长度小于4
//   const params = generateReqParams(CommandType.UPGRADE, CommandOrder.READY_AUDIO, data)
//   return handleSendCommand(params)
// }
// // 开始mp3传输
// export async function startMp3Transfer (order: number, pack: any) { // 长度小于4
//   const MTUSize = 185 // params 237
//   const tmp = new Uint8Array(185)
//   // const tmp = new Array(247)
//   tmp.set([0x55, 0xA1, MTUSize - 6, CommandType.UPGRADE, CommandOrder.TRANSFER_AUDIO, 0x01, 175], 0) // todo, 大数小端
//   tmp.set(pack, 7)
//   nativeApi.log(Array.from(tmp))
//   return handleSendCommandWithoutRsp(Array.from(tmp))
// }
