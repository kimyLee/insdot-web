<template>
  <div>
    <div ref="panelBg"
         class="light-panel">
      <div ref="lightCenter"
           class="panel-center"
           :class="{'selected': 0 === lightIndex,
                    'yellowBorder': 0 === lightIndex && frames[0] === '#FFFFFF' }"
           :style="{'background': frames[0]}"
           @click="selectLight(0)" />
      <div ref="lightGroup">
        <div v-for="(item, index) in 8"
             :key="index"
             :class="{'selected': index + 1 === lightIndex,
                      'yellowBorder': index + 1 === lightIndex && frames[lightIndex] === '#FFFFFF'}"
             :style="{'background': frames[index + 1]}"
             :data-index="item"
             class="light-btn"
             @click="selectLight(index + 1)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref, reactive, toRefs, onMounted, onUnmounted, computed, defineComponent, onBeforeUnmount } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  props: {
    selectedColor: {
      type: String,
      default: '#000000',
    },
    lightArray: {
      type: Array,
      default: Array(12).fill('#000000'),
    },
  },
  emits: ['sync-color'],
  setup (props:any, { emit }) {
    const panelBg = ref()
    const lightGroup = ref()
    const lightCenter = ref()

    // const store = useStore()

    const state = reactive({
      isCenter: false, // 判断是不是中心按钮
      lightIndex: -1,
      frames: Array(9).fill('#000000'),
      isPressing: false,
    })

    watch(() => props.lightArray, () => {
      // 初次打开弹窗：获取固件版本
      const top = props.lightArray.slice(0, 8)
      state.frames = [props.lightArray[8], ...top]
    }, {
      deep: true,
    })

    // const lightIndex = computed(() => store.state.light.currentLightIndex)

    // const frames = computed(() => store.getters['light/currentFrame'])

    // const centerColor = computed(() => frames.value[0])

    // 初始化 lightPanel
    const init = () => {
      const lightBtn = lightGroup.value.children
      // 偏移量
      const pre = lightBtn[0].offsetWidth / 2
      const halfWidth = panelBg.value.offsetWidth / 2
      const radius = panelBg.value.offsetWidth / 2 * 0.65
      const panelBorder = parseFloat(window.getComputedStyle(panelBg.value).borderWidth)

      const deg = (360 / lightBtn.length) * Math.PI / 180
      for (let i = 0; i < lightBtn.length; i++) {
        lightBtn[i].style.left = halfWidth + (Math.sin(deg * i)) * radius - pre - panelBorder + 'px'
        lightBtn[i].style.top = halfWidth - (Math.cos(deg * i)) * radius - pre - panelBorder + 'px'
      }
    }

    // 选中 light-btn app
    const selectLight = (index: number) => {
      state.lightIndex = index
      state.frames[index] = props.selectedColor || '#000000'
      emit('sync-color', state.frames)
      // store.commit('light/setCurrentLightIndex', index)
    }
    // 中心点击
    const centerBtn = () => {
      state.lightIndex = 0
      // store.commit('light/setCurrentLightIndex', 0)
    }
    // 滑动触发事件
    const touchListener = (event:any) => {
      if (!state.isPressing) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      console.log(event, 'event')
      const ele:any = document.elementFromPoint(event.pageX, event.pageY)

      // 有 panel-center 这个类名
      if (ele.classList.value.indexOf('panel-center') !== -1) {
        selectLight(0)
        // store.commit('light/setCurrentLightIndex', 0)
      }
      // 有 light-btn 这个类名
      if (ele.classList.value.indexOf('light-btn') !== -1) {
        const ledIndex = parseInt(ele.attributes['data-index'].value)
        selectLight(ledIndex)
        // store.commit('light/setCurrentLightIndex', ledIndex)
      }
    }

    // // 滑动监听
    const touchDownEvt = () => { // 按压下去时候
      state.isPressing = true
    }
    const touchUpEvt = () => { // 按压下去时候
      state.isPressing = false
    }
    const onTouchMove = () => {
      const lightBtn = lightGroup.value.children
      lightCenter.value.addEventListener('mousemove', touchListener)
      panelBg.value.addEventListener('mousedown', touchDownEvt)
      panelBg.value.addEventListener('mouseup', touchUpEvt)

      for (let i = 0; i < lightBtn.length; i++) {
        lightBtn[i].addEventListener('mousemove', touchListener)
      }
    }
    const onTouchMoveDestroy = () => {
      const lightBtn = lightGroup.value.children
      lightCenter.value.removeEventListener('mousemove', touchListener)
      panelBg.value.removeEventListener('mousedown', touchDownEvt)
      panelBg.value.removeEventListener('mouseup', touchUpEvt)

      for (let i = 0; i < lightBtn.length; i++) {
        lightBtn[i].removeEventListener('mousemove', touchListener)
      }
    }

    onMounted(() => {
      init()
      window.onresize = () => {
        init()
      }

      onTouchMove()
    })

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount')
      window.onresize = null
      onTouchMoveDestroy()
    })

    return {
      panelBg,
      lightGroup,
      lightCenter,
      selectLight,
      centerBtn,
      // frames,
      // centerColor,
      // lightIndex,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.light-panel {
  width: 400px;
  height: 400px;
  background: #3f3f3f;
  border-radius: 50%;
  border: 8px solid #565656;
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(-12deg);
  .panel-center {
    width: calc(35%);
    height: calc(35%);
    border-radius: 50%;
    border: 8px solid transparent;
    box-sizing: border-box;
    position: absolute;
    transition: transform 0.3s ease;
    &.selected {
      border-color: #fff;
      animation: light-show 0.4s;
    }
    &.yellowBorder {
      border-color: #faff00;
    }
  }
  .light-btn {
    width: calc(24%);
    height: calc(24%);
    position: absolute;
    border-radius: 50%;
    border: 8px solid transparent;
    transition: transform 0.4s ease;
    &.selected {
      border-color: #fff;
      animation: light-show 0.4s;
    }
    &.yellowBorder {
      border-color: #faff00;
    }
  }
}

@keyframes light-show {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>
