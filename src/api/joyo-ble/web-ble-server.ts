
import { reactive } from 'vue'
import { floatToHex } from './utils'

let writeCharacteristic = null as any
let notifyCharacteristic = null as any
let gattServer: any = null
let commandService = null as any

// DFU 相关属性
let DFUControlCharacteristic = null as any // 可notify、可写
let DFUPackCharacteristic = null as any
let DFUService = null as any
const underDFU = false
const tempBuffer = null as any

export const bleState = reactive({
  connectStatus: false,
})

export let bleDevice = null as any

declare global {
  interface Window {
    handleNotifyEvent: any,
    webBleNotify: any,
    dfu: any,
  }
}

const naviga: any = window.navigator

function handleDisconnect () { // TODO：这里同一设备会重复两次
  console.log('断开连接')
  writeCharacteristic = null
  bleDevice = null
  notifyCharacteristic = null
  gattServer = null
  commandService = null
  bleState.connectStatus = false

  DFUControlCharacteristic = null
  DFUPackCharacteristic = null
  DFUService = null
}

export function disconnectJoyo () {
  if (!bleDevice) {
    return
  }
  if (bleDevice.gatt.connected) {
    bleDevice.gatt.disconnect()
    // bleDevice.removeEventListener('gattserverdisconnected', handleDisconnect)
    bleDevice = null
  } else {
    console.log('already disconnect')
  }
}

export function connectJoyo () {
  console.log('Connecting...')
  if (writeCharacteristic === null) {
    naviga.bluetooth.requestDevice({
      filters: [{
        namePrefix: 'Joyo', // todo: 换设备
      }],
      optionalServices: [
        ('00002530-1212-efde-1523-785feabcd123').toLowerCase(),
        ('00001530-1212-efde-1523-785feabcd123').toLowerCase(),
        ('00002160-0000-1000-8000-00805F9B34FB').toLowerCase(),
      ],
    })
      .then((device: any) => {
        console.log('Connecting to GATT Server...')
        // 断连监听
        bleDevice = device
        bleDevice.addEventListener('gattserverdisconnected', handleDisconnect)
        return bleDevice.gatt.connect()
      })
      .then((server: any) => {
        console.log('> Found GATT server')
        gattServer = server
        // todo: 获取service
        return gattServer.getPrimaryService(('00002160-0000-1000-8000-00805F9B34FB').toLowerCase())
      })
      .then((service: any) => {
        console.log('> Found command service')
        console.log(service)
        commandService = service
        // Get write characteristic
        return commandService.getCharacteristic(('00000000-0000-0000-0000-000000002162').toLowerCase())
      })
      .then((characteristic: any) => {
        console.log('> Found write characteristic')
        writeCharacteristic = characteristic
        // const params = [85, 161, 44, 178, 54, 0, 40, 207, 0, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 205, 204, 204, 61]
        // sendCommand(params)
        return commandService.getCharacteristic(('00002161-0000-1000-8000-00805F9B34FB').toLowerCase())
      })
      .then((characteristic: any) => {
        console.log('> Found notice characteristic')
        notifyCharacteristic = characteristic
        bleState.connectStatus = true
        // 设置断连监听

        return notifyCharacteristic.startNotifications().then(() => {
          console.log('> Notifications started')
          notifyCharacteristic.addEventListener('characteristicvaluechanged',
            handleNotifications)
        })
      })
      .catch((err: any) => {
        bleState.connectStatus = false
        console.log(err)
      })
  } else {
  }
}

function handleNotifications (event: any) {
  const value = event.target.value
  const a = []
  for (let i = 0; i < value.byteLength; i++) {
    a.push(value.getUint8(i))
  }
  window.handleNotifyEvent && window.handleNotifyEvent(a)
  window.webBleNotify && window.webBleNotify(a)
}

export function sendCommand (command: number[]) {
  if (writeCharacteristic) {
    const cmd = Uint8Array.from(command)
    return writeCharacteristic.writeValue(cmd)
  } else {
    return Promise.resolve()
  }
}

// DFU 升级相关，引入DFU库
export function DFUUpgrade (buffer: any, progressCb: any): Promise<any> { // DFU 升级
  // dfu.findDevice({
  //   namePrefix: 'Joyo',
  // })
  //   .then((device: any) => {
  //     console.log('开始writeMode')
  //     return dfu.writeMode(bleDevice)
  //   })
  const dfu = window.dfu
  return dfu.writeMode(bleDevice)
    .then((device: any) => {
      console.log('开始transfer')
      return transfer(device, buffer, progressCb)
    })
    .catch((err: any) => {
      console.log(err)
    })
}

function transfer (device: any, buffer: any, progressCb: any) {
  const dfu = window.dfu

  return new Promise(function (resolve, reject) {
    dfu.provision(device, buffer, (progress: number) => {
      progressCb(progress)
    })
      .then(() => {
        console.log('dfu complete')
        resolve(true)
      })
      .catch((error: any) => {
        console.log(error)
        reject(error)
      })
  })
}

function handleDFUNotifications (event: any) {
  const value = event.target.value
  console.log(value)
}
