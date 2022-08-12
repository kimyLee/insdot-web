
// 负责转化ble的通信，建立握手
// 用法: jsBridgeInstance.$call('getConnectStatus', {}, true)

import { ClientResponse } from '@/api/common-type'
import { sendCommand } from './web-ble-server'

// todo 切换成 ts-events
// eslint-disable-next-line @typescript-eslint/no-var-requires
const EventEmitter = require('events')

class PolyWebBridge {
  private event: any
  constructor () {
    this.event = new EventEmitter()
    this._init()
  }

  /** call message and send to client */
  public $call (
    method: string,
    payload: Record<string, unknown>,
    hasCallback: boolean | string,
  ): Promise<ClientResponse> {
    console.log('web $call' + method)

    payload = payload || {}

    // 自定义回调id情况可以, 直接调用被注册的函数
    return new Promise((resolve, reject) => {
      const callbackId = hasCallback ? this.getCallbackId() : ''
      const message = this.generateMessage(method, payload, callbackId)

      if (callbackId) {
        this.$register(callbackId)

        // 增加7s无响应超时逻辑
        const timer = setTimeout(() => {
          console.log('js-bridge timeout')
          reject(new Error('timeout'))
        }, 7000)

        // @ts-ignore
        this.$on(callbackId, (result: ClientResponse) => {
          clearTimeout(timer)
          try {
            // todo: 错误码定义
            if (result.code === 200 || result.code === 401 || result.code === 403) {
              resolve(result)
            } else {
              reject(result)
            }
          } catch (error) {
            reject(error)
          } finally {
            // 接收到客户端的回调后,将解除订阅,方便垃圾回收
            this.$off(callbackId)
          }
        })
      }

      this.sendMessage(message)
    })
  }

  /** 订阅 */
  public $on (name: string, func: (result: ClientResponse) => any): any {
    if (this.event._events[name]) {
      this.$off(name)
    }
    this.event.on(name, func)
    return this
  }

  /** 解除订阅 */
  public $off (name: string, func?: (result: ClientResponse) => any): any {
    if (func) {
      this.event.removeListener(name, func)
    } else {
      this.event.removeAllListeners(name)
    }
    return this
  }

  /** register */
  public $register (name: string): void {
    const ar: string[] = name.split('.')
    const len: number = ar.length
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj = this
    const eventName = ar.join('_')

    ar.forEach((el, idx) => {
      if (idx === len - 1) {
        // @ts-ignore
        obj[el] = (json: any) => {
          this.event.emit(eventName, json)
        }
      } else {
        // @ts-ignore
        obj[el] = obj[el] || {}
        // @ts-ignore
        obj = obj[el]
      }
    })
  }

  /**
   * Generate the message
   *   {"method":"toast","payload":{"message":"你好"},"callbackId":"poly_sdk_callback_1632727252090577"}
   */
  private generateMessage (
    method: string,
    payload: Record<string, unknown>,
    callbackId?: string,
  ): string {
    const message = {
      method,
      payload,
      // callbackId,
    }

    if (callbackId) {
      Object.assign(message, {
        callbackId,
      })
    }

    return JSON.stringify(message)
  }

  /**
   * Generate random string, begin with `poly_sdk_callback_[random]`
   */
  private getCallbackId (): string {
    const random = parseInt(Math.random() * 10000 + '')
    return 'poly_sdk_callback_' + new Date().getTime() + random
  }

  /**
   * Post message to client
   */
  public sendMessage (msg: string): void {
    // browser
    try {
      // sendCommand(msg)
      // window?.PolySdk?.postMessage(msg)
      // todo: 发送消息
    } catch (error) {
      // todo: 失败重发, n次
      setTimeout(() => {
        this.sendMessage(msg)
      }, 1000)
    }
  }

  /**
   *  _init register  to native use
   */
  private _init (): void {
    //
  }
}

export const jsBridgeInstance = new PolyWebBridge() // 增加超时机制，超过7s接口返回错误
// window.PolyJsBridge = jsBridgeInstance

export default PolyWebBridge
