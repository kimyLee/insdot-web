<template>
  <!-- RGB 控制器 -->
  <transition name="rotate">
    <div v-show="show"
         class="rgb-controller"
         :class="{'active': active}">
      <div class="left-side">
        <span class="color-text">{{ title }}</span>
        <span class="color-num">{{ modelValue }}</span>
      </div>
      <div class="right-side">
        <div class="color-slider">
          <div ref="sliderRail"
               class="color-slider-rail" />
          <div ref="sliderTrack"
               class="color-slider-track" />
          <div ref="sliderBar"
               class="color-slider-handle"
               @mousedown.stop="onMouseDownHandler" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ref, defineComponent, toRefs, getCurrentInstance, reactive, PropType, onMounted } from 'vue'

export default defineComponent({
  name: 'RGBController',
  // directives: {
  //   clickOutside: vClickOutside.directive,
  // },
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 255,
    },
    title: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    const state = reactive({
      active: false,
    })

    const sliderBar = ref<HTMLElement>()
    const sliderTrack = ref<HTMLElement>()
    const sliderRail = ref<HTMLElement>()

    // const onClickOutside = () => {
    //   state.active = false
    // }

    const onMouseDownHandler = (evt: any) => {
      if (!sliderRail.value || !sliderBar.value || !sliderTrack.value) {
        return
      }
      state.active = true
      const rest = sliderRail.value.offsetWidth - sliderBar.value.offsetWidth
      const dotL = sliderBar.value.offsetLeft
      const e = evt || window.event // 兼容性
      // const mouseX = e.touches[0].clientX // 鼠标按下的位置
      const mouseX = e.clientX // 鼠标按下的位置

      const onTouchMove = (ev: any) => {
        const e = ev || window.event
        // 浏览器当前位置减去鼠标按下的位置
        const moveL = Math.floor(e.clientX - mouseX) // 鼠标移动的距离

        let newL = dotL + moveL // left值
        // 判断最大值和最小值
        if (newL < 0) {
          newL = 0
        }
        if (newL >= rest) {
          newL = rest
        }
        // 改变left值
        if (sliderBar.value) {
          sliderBar.value.style.left = newL + 'px'
        }

        if (sliderTrack.value) {
          sliderTrack.value.style.width = newL + 5 + 'px'
        }
        // 计算变化
        const factor = newL / rest
        const range = props.max - props.min
        const res = Math.floor(factor * range + props.min)
        emit('update:modelValue', res)
        emit('change', res)

        return false // 取消默认事件
      }
      window.addEventListener('mousemove', onTouchMove)
      window.addEventListener('mouseup', function () {
        state.active = false
        window.removeEventListener('mousemove', onTouchMove) // 解绑移动事件
        return false
      })
      return false
    }

    function initLeft () {
      if (sliderBar.value && sliderTrack.value && sliderRail.value) {
        const rest = sliderRail.value.offsetWidth - sliderBar.value.offsetWidth
        const range = props.max - props.min
        const left = Math.floor(props.modelValue / range * rest)
        sliderBar.value.style.left = left + 'px'
        sliderTrack.value.style.width = left + 5 + 'px'
      }
    }

    onMounted(() => {
      // 初始化当前值
      initLeft()
    })

    return {
      sliderBar,
      sliderTrack,
      sliderRail,
      onMouseDownHandler,
      // onClickOutside,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.rgb-controller {
  width: 240px;
  height: 60px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 24px;
  touch-action: none;
  & + .rgb-controller {
    margin-top: 4px;
  }
  &.active,
  &:active,
  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.3);
    .left-side {
      opacity: 1;
    }
    .right-side {
      .color-slider {
        .color-slider-track {
          background-color: #fff;
        }
        // .color-slider-handle {
        //   border: 6px solid #eee;
        // }
      }
    }
  }

  .left-side {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    // text-align: center;
    flex-wrap: wrap;
    font-size: 18px;
    opacity: 0.7;
    // color: #ffffff;
    color: #3f3f3f;
    .color-text {
      width: 100%;
      font-weight: 700;
      font-size: 18px;
    }
    .color-num {
      margin-top: -10px;
      width: 100%;
      font-weight: 700;
      font-size: 14px;
    }
  }
  .right-side {
    flex: 1;
    display: flex;
    align-items: center;
    touch-action: none;
    .color-slider {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      height: 70px;
      touch-action: none;
      .color-slider-rail {
        position: absolute;
        width: 100%;
        height: 9px;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
      .color-slider-track {
        position: absolute;
        height: 9px;
        left: 0%;
        right: auto;
        background-color: rgba(255, 255, 255, 0.6);
        // background-color: #fff;
        border-radius: 5px;

        top: 50%;
        transform: translateY(-50%);
        // transition: background-color 0.3s;
      }
      .color-slider-handle {
        touch-action: none;
        position: absolute;
        width: 30px;
        height: 30px;
        margin-top: -15px;
        background-color: #fff;
        border-radius: 50%;
        top: 50%;
        right: auto;
      }
    }
  }
}

// 动画
.rotate-enter-active {
  opacity: 1;
  transform: rotateX(0deg);
  transition: all 0.5s ease;
  &.green {
    transition-delay: 250ms;
  }
  &.blue {
    transition-delay: 500ms;
  }
}
.rotate-leave-active {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.rotate-enter-from {
  opacity: 0;
  transform: rotateX(90deg);
}
.rotate-leave-to {
  opacity: 0;
}
</style>
