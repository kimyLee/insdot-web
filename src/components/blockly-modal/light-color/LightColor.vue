<template>
  <a-modal :visible="popLightVisible"
           :width="1000"
           :ok-text="$t(LANG.COMMON.CONFIRM)"
           :cancel-text="$t(LANG.COMMON.CANCEL)"
           :title="$t(LANG.BLOCKLY_STATUS.SET_LIGHT)"
           @cancel="handleCancel"
           @ok="handleConfirm">
    <div class="joyo-light">
      <div class="container">
        <div class="colors-panel">
          <ul>
            <li v-for="{ key, value } in Colors"
                :key="key"
                :class="{
                  black: key === ColorEnum.BLACK,
                  white: key === ColorEnum.WHITE,
                  active: value === selectedColor,
                }"
                :style="{
                  backgroundColor: `${value}`,
                }"
                @click.stop="changeColor(value)" />
            <li :class="{
                  'active': customColorActive,
                  'plus': !customColor,
                  'white': customColorActive && (customColor === '#ffffff')}"
                :style="{
                  backgroundColor: `${customColor}`,
                }"
                @click="customColorActive = true" />
          </ul>
        </div>
        <!-- rgb 控制器 -->
        <div class="rgb-controller-box">
          <RGBController v-model="inputValueR"
                         title="R"
                         class="red"
                         :show="customColorActive"
                         @change="handleRGBChange" />
          <RGBController v-model="inputValueG"
                         class="green"
                         :show="customColorActive"
                         title="G"
                         @change="handleRGBChange" />
          <RGBController v-model="inputValueB"
                         title="B"
                         class="blue"
                         :show="customColorActive"
                         @change="handleRGBChange" />
        </div>

        <div class="light-panel-container">
          <LightPanel ref="lightPanel"
                      :selected-color="selectedColor"
                      class="light-panel"
                      :light-array="initLightArray"
                      @sync-color="updateLightArray" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { reactive, ref, toRefs, defineComponent, onMounted, watch, computed, markRaw } from 'vue'
import { useStore } from 'vuex'
// import { loadingOutlined } from '@ant-design/icons-vue'
import { Colors, ColorEnum } from './type'
import LightPanel from '@/components/blockly-modal/light-color/LightPanel.vue'
import RGBController from '@/components/blockly-modal/light-color/RGBController.vue'
import { eventBus } from '@/lib/blockly/blockly-use-vuex/index'
import LANG from '@/i18n/type'

export default defineComponent({
  components: {
    LightPanel,
    RGBController,
    // loadingOutlined,
    // ContainerDialog,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const containerDialog = ref()
    const state = reactive({
      popVisible: false,
      selectedColor: '',
      inputValueR: 0,
      inputValueG: 0,
      inputValueB: 0,
      customColor: '',
      customColorActive: false,
      lightArray: Array(12).fill('#000000'),
    })

    const store = useStore()

    // const currentColor = computed(() => store.state.light.currentColor)

    const popLightVisible = computed(() => {
      return store.state.blockly.popLightVisible
    })

    const initLightArray = computed(() => {
      return store.state.blockly.lightArray
    })

    // watch(() => props.modelValue, () => {
    //   if (props.modelValue) {
    //     // 初次打开弹窗：获取固件版本
    //     state.popVisible = true
    //   }
    // })

    const changeColor = (color: string) => { // 修改选中的颜色值
      state.customColorActive = false // 自定义颜色失去焦点
      if (color !== state.selectedColor) {
        state.selectedColor = color
      }
    }

    const handleRGBChange = () => {
      const currentColor: string = '#' +
      state.inputValueR.toString(16).padStart(2, '0') +
      state.inputValueG.toString(16).padStart(2, '0') +
      state.inputValueB.toString(16).padStart(2, '0')
      state.customColorActive = true
      state.customColor = currentColor
      state.selectedColor = currentColor
    }

    function updateLightArray (arr: string[]) {
      state.lightArray = [...(arr.slice(1)), arr[0], arr[0], arr[0], arr[0]]
      // todo: JOYO实时效果
    }
    function handleCancel () {
      store.commit('blockly/togglePopLightVisible', false)
    }

    function handleConfirm () { // 开始升级
      // 将灯效数组传输到外部
      eventBus.emit('updateLightColor', null, [...state.lightArray]) // 移除监听
      store.commit('blockly/togglePopLightVisible', false)
    }

    onMounted(() => {
      //
    })

    return {
      ...toRefs(state),
      LANG,
      Colors,
      ColorEnum,

      changeColor,
      handleRGBChange,
      updateLightArray,
      initLightArray,

      handleConfirm,
      handleCancel,
      popLightVisible,
    }
  },
})
</script>

<style lang="scss" scoped>
.joyo-light {
  position: relative;
  .container {
    position: relative;
    padding-top: 45px;
    // height: calc(100vh - 400px);
    height: 600px;
    min-height: 600px;
    width: 100%;
    .colors-panel {
      width: 100%;
      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        width: 100%;
        height: 72px;
        margin: 0 auto;

        li {
          width: 60px;
          height: 60px;
          border-radius: 25px;
          transition: transform 0.25s ease-out;
          border: 10px solid transparent;
          list-style: none;

          &.black {
            border: 2px solid #ffffff;
          }
          &:active {
            transform: scale(0.95);
          }
          &.white {
            border: 8px solid #ccc;
          }
          &.white.active {
            border: 8px solid #444;
          }
          &.active {
            border: 8px solid #444;
          }
          &.custom {
            border: 8px solid #faff00;
          }
          &.plus {
            background: rgba(255, 255, 255, 0.33);
            border: 8px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
            &:after {
              display: inline-block;
              font-weight: 700;
              font-size: 32px;
              margin-top: -2px;
              content: "+";
              color: #444;
            }
          }
        }
      }

      .custom-color-box {
        width: 144px;
        display: flex;
        height: 72px;
        justify-content: center;
        align-items: center;
        margin-left: 20px;
        box-sizing: border-box;
        border: none;
        &.custom-active {
          margin-left: 16px;
          border: 10px solid #faff00;
          .custom-arrow {
            border-top-right-radius: 18px;
            border-bottom-right-radius: 18px;
          }
          .custom-color {
            border-top-left-radius: 18px;
            border-bottom-left-radius: 18px;
          }
        }

        .custom-color {
          box-sizing: border-box;
          display: inline-block;
          width: 72px;
          height: 100%;
          border-top-left-radius: 26px;
          border-bottom-left-radius: 26px;
        }
        .custom-arrow {
          box-sizing: border-box;
          background: #fff;
          width: 48px;
          height: 100%;
          border-top-right-radius: 26px;
          border-bottom-right-radius: 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          .arrow {
            width: 0px;
            height: 0px;
            border-top: 10px solid #444;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
          }
        }
      }
    }

    .rgb-controller-box {
      position: absolute;
      right: 10px;
      top: 120px;
      // transform: translateY(-50%);
      z-index: 999;
    }

    .light-panel-container {
      position: absolute;
      left: 50%;
      margin-top: 20px;
      transform: translate(-50%, 0);
      .light-panel {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
