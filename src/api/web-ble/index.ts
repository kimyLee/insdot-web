
import { jsBridgeInstance } from '@/common/poly-js-bridge/js-bridge'
import type {
  ClientResponse,
  ClientResponseWithData,
  BleList,
} from '@/api/common-type'

export default {
  /**
   * 获取 app固件缓存信息
   *
   */
  getFirmwareConfig (): Promise<ClientResponse> {
    return jsBridgeInstance.$call('getFirewareConfig', {}, true) //
  },

  scan (name = 'joyo'): Promise<ClientResponseWithData<BleList>> { // 扫描蓝牙，返回列表
    return jsBridgeInstance.$call('scan', { name }, true)
  },

  connectBle (name: string): Promise<ClientResponse> {
    return jsBridgeInstance.$call('connectBle', { name }, true)
  },

  disConnectBle (): Promise<ClientResponse> {
    return jsBridgeInstance.$call('disConnectBle', {}, true)
  },

  DFUUpgrade (): Promise<ClientResponse> {
    return jsBridgeInstance.$call('DFUUpgrade', {}, true)
  },

  // todo: 如果断开连接，主动通知怎么做
  getConnectStatus (): Promise<ClientResponse> { // 获取当前连接状态
    return jsBridgeInstance.$call('getConnectStatus', {}, true)
  },

  registerNotifyEvt (): Promise<ClientResponse> {
    return jsBridgeInstance.$call('connectBle', {}, true)
  },

  autoConnect (): Promise<ClientResponse> {
    return jsBridgeInstance.$call('autoConnect', {}, true)
  },

  sendCommand (cmd: number[]): Promise<ClientResponse> {
    return jsBridgeInstance.$call('sendCommand', {
      cmd,
    }, false)
  },
}
