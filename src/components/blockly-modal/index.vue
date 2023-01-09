<template>
  <div>
    <LightColor />
  </div>
</template>

<script>
import { reactive, ref, toRefs, defineComponent, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import LightColor from './light-color/LightColor.vue'

export default defineComponent({
  components: {
    LightColor,
  },
  props: {
    // modelValue: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  // emits: ['update:modelValue'],
  setup (props, { emit }) {
    // const containerDialog = ref()
    const state = reactive({
      popVisible: false,
    })

    // const store = useStore()

    // const lastVersion = computed(() => {
    //   return store.state.ble.lastVersion
    // })
    // const currentVersion = computed(() => {
    //   return store.state.ble.currentVersion
    // })
    // const updateStep = computed(() => { // 升级步骤
    //   return store.state.ble.updateStep
    // })
    // const transferProgress = computed(() => { // 升级步骤
    //   return store.state.ble.transferProgress
    // })

    // watch(() => props.modelValue, () => {
    //   if (props.modelValue) {
    //     // 初次打开弹窗：获取固件版本
    //     state.popVisible = true
    //     // store.dispatch('ble/bleGetOriginVersion')
    //     // store.dispatch('ble/bleGetCurrentVersion')
    //   }
    // })

    // 获取当前固件版本号
    // function fetchCurrentVersion () {
    //   store.dispatch('')
    // }

    // const open = () => {
    //   containerDialog.value.open()
    // }
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

    // function handleCancel () {
    //   emit('update:modelValue', false)
    // }
    // function handleConfirm () { // 开始升级
    //   // store.dispatch('ble/bleUpgradeDevice')
    // }

    onMounted(() => {
      // state.versionPopVisible = true
      //
    })
    return {
      ...toRefs(state),
      // modelValue,
      // containerDialog,

      // handleConfirm,
      // handleCancel,

      // lastVersion,
      // currentVersion,
      // updateStep,
      // transferProgress,

      // open,
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
</style>
