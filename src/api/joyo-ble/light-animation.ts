
import { bleSetLight, clearAllLight } from './index'

function hexBrightness (color: number, factor: number) {
  // const color = c.toString(16).padStart(6, '0')
  // const R = Math.floor(Number('0x' + color[0] + color[1]) * factor / 255)
  // const G = Math.floor(Number('0x' + color[2] + color[3]) * factor / 255)
  // const B = Math.floor(Number('0x' + color[4] + color[5]) * factor / 255)
  const R = Math.floor(Math.floor(color / 256 / 256) * factor / 256)
  const G = Math.floor(Math.floor(color / 256 % 256) * factor / 256)
  const B = Math.floor(Math.floor(color % 256) * factor / 256)
  // return Number('0x' + R.toString(16).padStart(2, '0') + G.toString(16).padStart(2, '0') + B.toString(16).padStart(2, '0'))
  return R * 256 * 256 + G * 256 + B
}

let animationTimer = null as any

export function clearAnimation () {
  clearTimeout(animationTimer)
}

export const bleSetLightAnimation = (type: string, time: number, color: number) => {
  if (isNaN(color as any)) { // 不是数字
    color = Number(color)
  }
  const stopFlag = false
  if (time) {
    setTimeout(() => {
      clearAnimation()
      // stopFlag = true
    }, time * 1000)
  }
  const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if (type === 'run') {
    const step = 100
    let count = 0
    const loop = () => {
      if (stopFlag) { // 退出animation
        clearAllLight()
        return
      }
      const index = count % 8
      for (let i = 0; i < 8; i++) {
        arr[i] = 0
      }
      arr[index] = color
      arr[(index - 1) < 0 ? (index + 8 - 1) : (index - 1)] = hexBrightness(color, 180)
      arr[(index - 2) < 0 ? (index + 8 - 2) : (index - 2)] = hexBrightness(color, 120)
      arr[(index - 3) < 0 ? (index + 8 - 3) : (index - 3)] = hexBrightness(color, 50)
      arr[(index - 4) < 0 ? (index + 8 - 4) : (index - 4)] = hexBrightness(color, 10)
      animationTimer = setTimeout(() => {
        // sendCommand(`set_led 1,2,3,4,5,6,7,8 ${arr.join()}`)
        bleSetLight({
          colors: arr,
          bright: 1,
        })
        count = count + 1
        if (count >= 100) {
          count = 0
        }
        loop()
      }, step)
    }
    loop()
  } else if (type === 'star') { // 闪烁
    const step = 500
    let count = step

    for (let i = 0; i < 8; i++) {
      arr[i] = color
    }

    const loop = () => {
      if (stopFlag) { // 退出animation
        clearAllLight()
        return
      }
      animationTimer = setTimeout(() => {
        if ((count % 1000) !== 0) {
          clearAllLight()
        } else {
          bleSetLight({
            colors: arr,
            bright: 1,
          })
        }
        count = count + 500
        if (count >= 100000) {
          count = 0
        }
        loop()
      }, step)
    }
    loop()
  } else if (type === 'breath') { // 呼吸
    const step = 50
    let count = 0

    for (let i = 0; i < 8; i++) {
      arr[i] = color
    }

    const loop = () => {
      if (stopFlag) { // 退出animation
        clearAllLight()
        return
      }
      animationTimer = setTimeout(() => {
        const factor = 255 - (count < 150 ? count : (300 - count))
        const newColor = hexBrightness(color, factor)
        console.log(factor, 'factor')
        for (let i = 0; i < 8; i++) {
          arr[i] = newColor
        }
        bleSetLight({
          colors: arr,
          bright: 1,
        })
        count = count + 4
        if (count >= 300) {
          count = 0
        }
        loop()
      }, step)
    }
    loop()
  } else if (type === 'boom') { // 炸弹
    const step = 400
    let count = step

    for (let i = 0; i < 4; i++) {
      arr[i * 2] = color
      arr[i * 2 + 1] = 0
    }
    const arr2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < 4; i++) {
      arr2[i * 2] = 0
      arr2[i * 2 + 1] = color
    }

    const loop = () => {
      if (stopFlag) { // 退出animation
        clearAllLight()
        return
      }
      animationTimer = setTimeout(() => {
        if ((count % 1000) !== 0) {
          bleSetLight({
            colors: arr2,
            bright: 1,
          })
        } else {
          bleSetLight({
            colors: arr,
            bright: 1,
          })
        }
        count = count + 500
        if (count >= 100000) {
          count = 0
        }
        loop()
      }, step)
    }
    loop()
  }
  // return bleSetLight(JSON.parse(str))
}
