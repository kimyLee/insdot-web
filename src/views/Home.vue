<template>
  <div class="home">
    <button @click="start_demo">
      开始demo
    </button>
    <textarea v-model="msg"
              style="height: 100vh; width: 100%" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {
  },
  setup () {
    const state = reactive({
      msg: '',
      recordTimes: 30,
      acc: {} as any,
      begin: 0,
      end: 0,
    })

    function updateRecord () {
      if (state.recordTimes > 0) {
        state.recordTimes--
        setTimeout(() => {
          state.msg = state.msg + `x: ${state.acc.x}, y: ${state.acc.y}, z: ${state.acc.z}\n`
          if (state.begin && state.end) {
            const time = (state.end - state.begin) / 1000
            const dis = (0.5 * 9.8 * time * time).toFixed(3)
            alert('从' + dis + 'm下降')
            state.begin = 0
            state.end = 0
          }
          updateRecord()
        }, 1000)
      }
    }
    function handleMotion (event: any) {
      state.acc = {
        x: event?.acceleration?.x.toFixed(4),
        y: event?.acceleration?.y.toFixed(4),
        z: event?.acceleration?.z.toFixed(4),
      }
      if (state.begin === 0 && state.acc?.y > 2) { // 开始下降，火箭上升应该 << -2
        state.begin = Date.now()
      }
      if (state.end === 0 && state.acc?.y < 0.5 && state.begin) { // 开始下降，火箭上升应该 << -2
        state.end = Date.now()
      }
      // updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x)
      // updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y)
      // updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z)

      // updateFieldIfNotNull('Accelerometer_x', event.acceleration.x)
      // updateFieldIfNotNull('Accelerometer_y', event.acceleration.y)
      // updateFieldIfNotNull('Accelerometer_z', event.acceleration.z)

      // updateFieldIfNotNull('Accelerometer_i', event.interval, 2)

      // updateFieldIfNotNull('Gyroscope_z', event.rotationRate.alpha)
      // updateFieldIfNotNull('Gyroscope_x', event.rotationRate.beta)
      // updateFieldIfNotNull('Gyroscope_y', event.rotationRate.gamma)
      // incrementEventCount()
    }

    function start_demo (e: any) {
      // e.preventDefault()

      // Request permission for iOS 13+ devices
      if (
        DeviceMotionEvent &&
    typeof (DeviceMotionEvent as any).requestPermission === 'function'
      ) {
        (DeviceMotionEvent as any).requestPermission()
      }

      window.addEventListener('devicemotion', handleMotion)
    }
    onMounted(async () => {
      // window.addEventListener('devicemotion', function (event: any) {
      //   state.acc = event.acceleration
      //   // console.log(event.acceleration.x + ' m/s2')
      // })
      // function handleOrientation (event) {
      //   updateFieldIfNotNull('Orientation_a', event.alpha)
      //   updateFieldIfNotNull('Orientation_b', event.beta)
      //   updateFieldIfNotNull('Orientation_g', event.gamma)
      //   incrementEventCount()
      // }

      // function incrementEventCount () {
      //   const counterElement = document.getElementById('num-observed-events')
      //   const eventCount = parseInt(counterElement.innerHTML)
      //   counterElement.innerHTML = eventCount + 1
      // }

      // function updateFieldIfNotNull (fieldName, value, precision = 10) {
      //   if (value != null) { document.getElementById(fieldName).innerHTML = value.toFixed(precision) }
      // }

      // const is_running = false
      // const demo_button = document.getElementById('start_demo')

      // (DeviceMotionEvent as any).requestPermission()
      //   .then((permissionState: any) => {
      //     if (permissionState === 'granted') {
      //       window.addEventListener('devicemotion', (event: any) => {
      //         state.acc = event.acceleration
      //       })
      //     }
      //   })
      //   .catch((err: any) => {
      //     console.log(err)
      //   })

      // if (DeviceOrientationEvent && typeof ((DeviceOrientationEvent as any).requestPermission) === 'function') {
      //   const permissionState = await (DeviceOrientationEvent as any).requestPermission()

      //   if (permissionState === 'granted') {
      //   // Permission granted
      //     window.addEventListener('devicemotion', function (event: any) {
      //       state.acc = event.acceleration
      //       // console.log(event.acceleration.x + ' m/s2')
      //     })
      //   } else {
      //   // Permission denied
      //   }
      // }
      updateRecord()

      // 测试手机加速度
    })

    return {
      ...toRefs(state),
      start_demo,
    }
  },
})
</script>
