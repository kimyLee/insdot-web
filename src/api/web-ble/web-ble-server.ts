
import { reactive } from 'vue'

let writeCharacteristic = null as any
let notifyCharacteristic = null as any
let gattServer = null
let commandService = null as any

export const bleState = reactive({
  connectStatus: false,
})

declare global {
  interface Window {
    handleNotifyEvent: any
  }
}

const naviga: any = window.navigator

// function toLowerCase (str: string) {
//   return str.toLowerCase()
// }
function handleDisconnect () {
  console.log('断开连接')
  writeCharacteristic = null
  notifyCharacteristic = null
  gattServer = null
  commandService = null
  bleState.connectStatus = false
}

export function connectJoyo () {
  console.log('Connecting...')
  if (writeCharacteristic === null) {
    naviga.bluetooth.requestDevice({
      filters: [{
        namePrefix: 'Joyo', // todo: 换设备
      }],
      optionalServices: [
        ('00002160-0000-1000-8000-00805F9B34FB').toLowerCase(),
      ],
    })
      .then((device: any) => {
        console.log('Connecting to GATT Server...')
        // 断连监听
        device.addEventListener('gattserverdisconnected', () => {
          handleDisconnect()
        })
        return device.gatt.connect()
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
        const params = [85, 161, 44, 178, 54, 0, 40, 207, 0, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 240, 241, 242, 243, 244, 245, 246, 205, 204, 204, 61]
        sendCommand(params)
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
  window.handleNotifyEvent(a)
}

export function sendCommand (command: number[]) {
  if (writeCharacteristic) {
    const cmd = Uint8Array.from(command)
    return writeCharacteristic.writeValue(cmd)
    // .then(() => {})
  } else {
    return Promise.resolve()
  }
}

// function connect () {
//   const options = {} as any
//   options.acceptAllDevices = true
//   const log = console.log
//   log('Requesting Bluetooth Device...')
//   log('with ' + JSON.stringify(options))
//   navigator.bluetooth.requestDevice(options)
//     .then((device: any) => {
//       log('> Name:             ' + device.name)
//       log('> Id:               ' + device.id)
//       log('> Connected:        ' + device.gatt.connected)
//     })
//     .catch((error: any) => {
//       log('Argh! ' + error)
//     })
// }
