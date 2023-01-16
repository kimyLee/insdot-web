<template>
  <!-- 不同步骤下的升级状态 -->
  <div>
    <!-- step1 版本信息 -->
    <a-modal v-model:visible="popVisible"
             class="connect-tip"
             :width="1000"
             :cancel-text="$t(LANG.COMMON.OK_TEXT)"
             :title="$t(LANG.HOME_CONNECT_TIP.TITLE)"
             @cancel="handleCancel">
      <div>
        <div class="cc">
          <h2>{{ $t(LANG.HOME_CONNECT_TIP.P1_TITLE) }}</h2>

          <ol>
            <li>{{ $t(LANG.HOME_CONNECT_TIP.P1_1) }}</li>
            <li data-outlined="false"
                class="">
              {{ $t(LANG.HOME_CONNECT_TIP.P1_2) }}
            </li>
            <li>{{ $t(LANG.HOME_CONNECT_TIP.P1_3) }}</li>
            <li>{{ $t(LANG.HOME_CONNECT_TIP.P1_4) }}</li>
            <li>{{ $t(LANG.HOME_CONNECT_TIP.P1_5) }}</li>
          </ol>

          <h3>{{ $t(LANG.HOME_CONNECT_TIP.P2_TITLE) }}</h3>

          <p>{{ $t(LANG.HOME_CONNECT_TIP.P2_1) }}</p>

          <p>{{ $t(LANG.HOME_CONNECT_TIP.P2_2) }}</p>

          <ul>
            <li>
              <a href="https://support.microsoft.com/zh-cn/help/15290/windows-connect-bluetooth-device"
                 target="_blank"
                 rel="noopener">Windows</a>
            </li>
            <li>
              <a href="https://support.apple.com"
                 rel="noopener"
                 target="_blank">Mac</a>
            </li>
            <li>
              <a href="https://help.ubuntu.com/stable/ubuntu-help/bluetooth-turn-on-off.html"
                 target="_blank"
                 rel="noopener">Linux</a>
            </li>
            <li><a href="/chromebook/answer/2587653">Chromebook</a></li>
          </ul>

          <p>{{ $t(LANG.HOME_CONNECT_TIP.P2_3) }}</p>

          <p>
            <strong>{{ $t(LANG.HOME_CONNECT_TIP.P2_4) }}</strong>{{ $t(LANG.HOME_CONNECT_TIP.P2_5) }}<a href="https://support.microsoft.com/zh-cn/hub/4338813/windows-help"
                                                                                                        rel="noopener">{{ $t(LANG.HOME_CONNECT_TIP.P2_6) }}</a>。
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { reactive, ref, toRefs, defineComponent, onMounted, watch, computed } from 'vue'
// import ContainerDialog from '@/components/dialog/ContainerDialog.vue'
import { useStore } from 'vuex'
import LANG from '@/i18n/type'

export default defineComponent({
  components: {
    // ContainerDialog,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, { emit }) {
    const state = reactive({
      popVisible: false,
    })

    watch(() => props.modelValue, () => {
      if (props.modelValue) {
        state.popVisible = true
      }
    })
    function handleCancel () {
      emit('update:modelValue', false)
    }

    const store = useStore()

    // onMounted(() => {
    // })
    return {
      handleCancel,
      LANG,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" >
.connect-tip {
  .ant-btn-primary {
    display: none;
  }
}
</style>
