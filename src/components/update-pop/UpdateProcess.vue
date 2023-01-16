<template>
  <!-- 不同步骤下的升级状态 -->
  <div>
    <!-- step1 版本信息 -->
    <a-modal v-model:visible="versionPopVisible"
             :width="360"
             ok-text="更新版本"
             cancel-text="我知道了"
             title="设备信息"
             :ok-button-props="{disabled: disabledOK}"
             @cancel="handleCancel"
             @ok="handleUpdateJOYO">
      <div v-show="connectStatus">
        当前版本号：{{ currentVersion || '--' }}
      </div>
      <div v-show="!connectStatus">
        当前版本号：<span style="color:#faad14">设备未连接</span>
      </div>
      <div>最新版本: {{ lastVersion || '--' }}</div>
      <div v-show="updateStep > 0">
        <a-spin />
        {{ updateStatusMap[updateStep] }}
        <span v-show="updateStep === 2">({{ transferProgress }}%)</span>
        <span v-show="updateStep === 2">，请勿关闭窗口</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { reactive, ref, toRefs, defineComponent, onMounted, watch, computed } from 'vue'
// import ContainerDialog from '@/components/dialog/ContainerDialog.vue'
import { useStore } from 'vuex'
import { loadingOutlined } from '@ant-design/icons-vue'

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
  emits: ['start-upgrade', 're-connect', 'update:modelValue'],
  setup (props, { emit }) {
    const containerDialog = ref()
    const state = reactive({
      versionPopVisible: false,
      disabledOK: false,
      // lastVersion: '',
      step: 1,
      title: [
        'Joyo needs an update',
        'Updating Joyo',
        'Update success!',
        'Update fail!',
        'Reconnection failed, please connect Joyo manually!',
        'Update Timeout!',
      ],
      updateStatusMap: [
        '升级完成',
        '下载固件',
        '固件下载完成，传输中',
        '升级完成，请等待设备重启后，重新连接JOYO',
      ],
    })

    const store = useStore()

    const connectStatus = computed(() => { // 看下行否
      return store.getters['ble/connectStatus']
    })
    const updateStep = computed(() => { // 升级步骤
      return store.state.ble.updateStep
    })

    watch(() => connectStatus.value, (val) => {
      if (val) {
        store.commit('ble/resetUpgradeStatus')
      } else {
        state.disabledOK = true
      }
    })
    watch(() => updateStep.value, (val) => {
      if (val > 0) {
        state.disabledOK = true
      } else {
        state.disabledOK = false
      }
    })

    const lastVersion = computed(() => {
      return store.state.ble.lastVersion
    })
    const currentVersion = computed(() => {
      return store.state.ble.currentVersion
    })

    const transferProgress = computed(() => { // 升级步骤
      return store.state.ble.transferProgress
    })

    watch(() => props.modelValue, () => {
      if (props.modelValue) {
        // 初次打开弹窗：获取固件版本
        state.versionPopVisible = true
        store.dispatch('ble/bleGetOriginVersion')
        store.dispatch('ble/bleGetCurrentVersion')
      }
    })

    // 获取当前固件版本号
    // function fetchCurrentVersion () {
    //   store.dispatch('')
    // }

    const open = () => {
      containerDialog.value.open()
    }
    // step 1 的操作
    // const resetUpdate = () => {
    //   state.step = 1
    // }
    // const startUpdate = () => {
    //   emit('start-upgrade')
    //   state.step = 2
    // }
    // const updateSuccess = () => {
    //   state.step = 3
    // }
    // const updateFail = () => {
    //   state.step = 4
    // }
    // const updateTimeout = () => {
    //   state.step = 6
    // }
    // const updateHandle = () => {
    //   state.step = 5
    // }
    // const finishUpdate = () => {
    //   containerDialog.value.close()
    // }
    // const closeToReConnect = () => {
    //   containerDialog.value.close()
    //   emit('re-connect')
    // }

    function handleCancel () {
      emit('update:modelValue', false)
      // store.dispatch('ble/bleReconnect')
    }
    function handleUpdateJOYO () { // 开始升级
      store.dispatch('ble/bleUpgradeDevice')
    }

    onMounted(() => {
      // state.versionPopVisible = true
      //
    })
    return {
      ...toRefs(state),
      // modelValue,
      // containerDialog,

      handleUpdateJOYO,
      handleCancel,

      connectStatus,

      lastVersion,
      currentVersion,
      updateStep,
      transferProgress,

      open,
      // resetUpdate,
      // startUpdate,
      // finishUpdate,
      // updateSuccess,
      // updateFail,
      // updateHandle,
      // updateTimeout,
      // closeToReConnect,
    }
  },
})
</script>

<style lang="scss" scoped>
// 过渡动画
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.5s ease;
// }

// .fade-enter-from,
// .fade-leave-to {
//   opacity: 0;
// }
// .content {
//   height: 500px;
//   position: relative;
//   display: flex;
//   justify-content: center;
//   .con-step {
//     position: absolute;
//     .title {
//       text-align: center;
//       font-size: 60px;
//       font-weight: 600;
//       margin: 0 auto;
//       &.step5 {
//         width: 90%;
//         font-size: 35px;
//         font-weight: 500;
//       }
//     }
//     .middle-pic {
//       display: flex;
//       justify-content: center;
//       &.updating {
//         flex-wrap: wrap;
//       }
//       .update-status {
//         width: 100%;
//         height: 60px;
//         line-height: 60px;
//         text-align: center;
//         font-size: 32px;
//         color: #444;
//       }
//       .icon-update {
//         width: 0.8rem;
//         height: 0.8rem;
//         margin-top: 40px;
//         background-image: url("~@/assets/image/joyo.png");
//         background-repeat: no-repeat;
//         background-size: 100% 100%;
//         position: relative;
//         .loading {
//           position: absolute;
//           width: 0.3rem;
//           height: 0.3rem;
//           left: 50%;
//           top: 20px;
//           margin-left: -0.15rem;
//           // margin: 20px auto;
//           background-image: url("~@/assets/image/icon-update-loading.svg");
//           background-repeat: no-repeat;
//           background-position: 0 1px; /*no*/
//           background-size: cover;
//           animation: rotateLoading 3s linear infinite;
//         }
//         .icon-update-success {
//           width: 27px;
//           height: 45px;
//           margin: 22px auto;
//           border-right: 8px solid #fff;
//           border-bottom: 8px solid #fff;
//           transform: rotate(45deg);
//         }
//       }
//     }
//     .footer {
//       display: flex;
//       flex-wrap: wrap;
//       justify-content: center;
//       &:not(.update) {
//         margin-top: 60px;
//       }

//       .footer-btn {
//         width: 300px;
//         height: 100px;
//         text-align: center;
//         line-height: 100px;
//         font-size: 50px;
//         font-weight: 500;
//         color: white;
//         border-radius: 20px;
//         &:not(:first-child) {
//           margin-left: 20px;
//         }
//         &.success {
//           background: $color-green;
//           &:hover {
//             background: $color-green-tapped;
//           }
//         }
//         &.fail {
//           background: $color-red;
//           &:hover {
//             background: $color-red-tapped;
//           }
//         }
//       }
//       .footer-text {
//         font-size: 40px;
//       }
//     }
//   }
// }
// @keyframes rotateLoading {
//   0% {
//     transform: rotate(0deg);
//     -webkit-transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//     -webkit-transform: rotate(360deg);
//   }
// }
</style>
