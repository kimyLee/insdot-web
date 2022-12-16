
import type { ParamsRule, ClientResponse } from './type'
import { ParamsType } from './type'

import {
  productType,
  contactHexString,
  RequestParamsRule,
  CommandCallbackRule,
} from './config'

import { sendCommand } from '@/api/joyo-ble/web-ble-server'

// import bleApi from '@/api/native-ble'

function getCmdFromParams (arr: number[]) { // 如'a1-b1-01'
  if (arr.length < 7) return ''
  return arr[1].toString(16) + '-' + arr[3].toString(16) + '-' + arr[4].toString(16)
}

function floatToHex (num: number, isReverse = false): number[] {
  const getHex = (i: number) => Number('0x' + ('00' + i.toString(16)).slice(-2))
  const view = new DataView(new ArrayBuffer(4))
  view.setFloat32(0, num)
  if (isReverse) {
    return Array(4).fill(0).map((_, i) => getHex(view.getUint8(i))).reverse()
  }
  return Array(4).fill(0).map((_, i) => getHex(view.getUint8(i)))
}

export function generateReqParams (commandType: number, commandOrder: number, params?: any, hasCB?: boolean) {
  // https://cuby.atlassian.net/wiki/spaces/CBY/pages/279478374/05+CBY

  const cmd = contactHexString(productType, commandType, commandOrder)
  const paramsCfg = RequestParamsRule[cmd]
  const len = paramsCfg?.params?.reduce((sum, val: ParamsRule) => {
    if (val.type === ParamsType.STRING_END) {
      return sum + params[val.name].length + 1
    }
    return sum + val.len
  }, 0) || 0x00 // 参数总长度
  const hasCallback = hasCB === undefined ? (!(paramsCfg?.hasCallback === false)) : hasCB // 可以显式设置不需要回调函数, 默认有
  let reqParams = [0x55, productType, 0, commandType, commandOrder, hasCallback ? 0x01 : 0x00, len]
  if (paramsCfg?.params) {
    paramsCfg.params.forEach((item) => {
      if (item.type === ParamsType.VERSION) {
        const param = params[item.name].split('.').map((e: string) => parseInt(e))
        // 重要TODO!: @jason, 移除0x55 和 0xe6, 0x07, 0x02, 0x0f， 没有实际意义
        reqParams = reqParams.concat(0x55, param, 0xe6, 0x07, 0x02, 0x0f)
        // reqParams = reqParams.concat([0x55, 0xa1, 0x0d, 0xb3, 0xC9, 0x01, 0x09, 0x55, 0x00, 0x00, 0x01, 0x00, 0xe6, 0x07, 0x02, 0x0f])
      }
      if (item.type === ParamsType.NUMBER || item.type === ParamsType.NUMBER_REVERSE) { // 注意是否有小端要求
        let hex = params[item.name].toString(16)
        hex = hex.padStart(item.len * 2, '0')
        let param = []
        if (item.type === ParamsType.NUMBER_REVERSE) {
          param = hex.match(/.{2}/g).reverse().map((val: string) => {
            return Number('0x' + val)
          })
        } else {
          param = hex.match(/.{2}/g).map((val: string) => {
            return Number('0x' + val)
          })
        }
        reqParams = reqParams.concat(param)
      }
      if (item.type === ParamsType.FLOAT) {
        reqParams = reqParams.concat(floatToHex(params[item.name], true)) // todo: 小端抽成配置
      }
      if (item.type === ParamsType.NUMBER_ARRAY) {
        const data = params[item.name]
        if (Array.isArray(data)) {
          data.forEach((element: any) => {
            let hex = element.toString(16)
            hex = hex.padStart((item.subLen || 1) * 2, '0')
            const param = hex.match(/.{2}/g).map((val: string) => {
              return Number('0x' + val)
            })
            reqParams = reqParams.concat(param) // 依次拼接
          })
        }
      }
      if (item.type === ParamsType.STRING || item.type === ParamsType.STRING_END) {
        const str = params[item.name]
        const len = item.type === ParamsType.STRING ? str.length : str.length + 1
        const arr = Array(len).fill(0)
        for (let i = 0; i < str.length; i++) {
          arr[i] = str[i].charCodeAt(0)
        } // 字符串to ascii码

        reqParams = reqParams.concat(arr)
      }
    })
  }
  reqParams[2] = reqParams.length - 3 // 总长度
  return reqParams
}

export function generateRspResult (arr: number[]) {
  const cmd = getCmdFromParams(arr)
  const paramsModel = CommandCallbackRule[cmd]
  if (!paramsModel) {
    return {
      cmd: '',
      code: -1, // 找不到返回体
    }
  }
  const result = {} as Record<string, string | number>
  paramsModel.forEach((item) => {
    const param = arr.slice(item.start, item.start + item.len)
    if (item.type === ParamsType.VERSION) {
      result[item.name] = param.join('.')
    }
    if (item.type === ParamsType.STRING) {
      result[item.name] = param.join('.')
    }
    if (item.type === ParamsType.NUMBER) {
      result[item.name] = param.reduce((sum, item) => {
        return sum * 10 + item
      }, 0)
    }
  })
  return {
    cmd,
    code: 200, // 200表示success, 需要固件端定义其他错误码
    result,
  }
}

const evtSet = {} as Record<string, any>

// 检测蓝牙广播，接收消息回包
(window as any).webBleNotify = (val: number[]) => {
  const res = generateRspResult(val)
  console.log(res)
  if (res.cmd && evtSet[res.cmd]) evtSet[res.cmd](res)
}

export function handleSendCommand (params: number[]) {
  const cmd = getCmdFromParams(params)
  if (!cmd) {
    return Promise.resolve({ code: -1 }) as unknown as ClientResponse // 找不到对应cmd
  }
  if (evtSet[cmd]) {
    return Promise.resolve({ code: -2 }) as unknown as ClientResponse// 重复请求返回错误
  }
  sendCommand(params)

  return new Promise((resolve) => {
    const timer = setTimeout(() => { // 超时处理
      evtSet[cmd] = null
      resolve({ code: -3 }) // 请求超时
    }, 5000)
    evtSet[cmd] = (d: number[]) => {
      resolve(d)
      clearTimeout(timer)
      evtSet[cmd] = null
    }
  }) as unknown as ClientResponse
}

// export function handleSendCommandWithoutRsp (params: number[]) {
//   const cmd = getCmdFromParams(params)
//   if (!cmd) {
//     return Promise.resolve({ code: -1 }) as unknown as ClientResponse // 找不到对应cmd
//   }

//   bleApi.sendCommand(params)
// }
