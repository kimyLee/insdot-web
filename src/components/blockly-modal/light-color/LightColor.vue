<template>
  <a-modal :visible="popLightVisible"
           :width="1000"
           ok-text="更新版本"
           cancel-text="我知道了"
           title="设置灯光"
           @cancel="handleCancel"
           @ok="handleConfirm">

    <div class="joyo-light">
      <div class="container">
        <div class="colors">
          <ul>
            <li v-for="{ key, value } in colors"
                :key="key"
                :class="{
                  black: key === ColorEnum.BLACK,
                  white: key === ColorEnum.WHITE,
                  active: value === currentColor,
                }"
                :style="{
                  backgroundColor: `${value}`,
                }"
                @click.stop="changeColour(value)" />
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
                         @change="handleChange" />
          <RGBController v-model="inputValueG"
                         class="green"
                         :show="customColorActive"
                         title="G"
                         @change="handleChange" />
          <RGBController v-model="inputValueB"
                         title="B"
                         class="blue"
                         :show="customColorActive"
                         @change="handleChange" />
        </div>

        <div class="light-panel-container">
          <LightPanel ref="lightPanel"
                      class="light-panel" />
        </div>
        <div class="actions">
          <span v-for="v in ActionsEnum"
                :key="v"
                :class="{
                  [v.toLowerCase()]: true,
                  [`x${currentSpeed / 8}`]: v === ActionsEnum.SPEED,
                  [playStatus ? 'start' : 'pause']: v === ActionsEnum.PLAY,
                  acitve: v === currentAction,
                }"
                @click.stop="changeActionEvent(v)" />
        </div>
        <div class="map">
          <LightPreview :play="playStatus"
                        :play-on-device="playOnDevice" />
        </div>
      </div>
      <LightFrame ref="lightFrame" />

      <ManualConnection ref="manualConnection"
                        class="manual-connection" />
      <LightFrame />
      <!-- 推出保存弹窗 -->
      <SaveDialog v-if="dialogType === 'save'"
                  ref="saveDialog"
                  @backBtnFn="onClickSaveCallback" />
      <!-- 重命名弹窗 -->
      <RenameDialog v-if="dialogType === 'rename'"
                    ref="renameDialog"
                    v-model:name="name" />
      <!-- share 弹窗 -->
      <ShareDialog v-if="dialogType === 'share'"
                   ref="shareDialog"
                   @saveLocalFn="saveToLocal" />
      <ConnectedDialog ref="connectedDialog" />
    </div>
  </a-modal>
</template>

<script>
import { reactive, ref, toRefs, defineComponent, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { loadingOutlined } from '@ant-design/icons-vue'
import { Colors, ColorEnum } from './type'

export default defineComponent({
  components: {
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
    })

    const store = useStore()

    const popLightVisible = computed(() => {
      return store.state.blockly.popLightVisible
    })

    watch(() => props.modelValue, () => {
      if (props.modelValue) {
        // 初次打开弹窗：获取固件版本
        state.popVisible = true
      }
    })

    function handleCancel () {
      store.commit('blockly/togglePopLightVisible', false)
    }

    function handleConfirm () { // 开始升级
    }

    onMounted(() => {
      //
    })

    return {
      ...toRefs(state),
      Colors,
      ColorEnum,

      handleConfirm,
      handleCancel,
      popLightVisible,
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
