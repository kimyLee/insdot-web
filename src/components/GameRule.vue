<template>
  <!-- 不同步骤下的升级状态 -->
  <div>
    <!-- step1 版本信息 -->
    <a-modal v-model:visible="popVisible"
             class="game-rule-book"
             :width="800"
             :cancel-text="$t(LANG.COMMON.OK_TEXT)"
             :ok-text="$t(LANG.GAME_RULE.UPDATE_GAMEPLAY)"
             :title="$t(LANG.GAME_RULE.GAME_RULE)"
             @ok="handleOk"
             @cancel="handleCancel">
      <p>{{ $t(LANG.GAME_RULE.GAME_TOKEN) }}</p>
      <a-textarea v-model:value="tokenList"
                  :auto-size="{ maxRows: 4}"
                  :placeholder="$t(LANG.GAME_RULE.GAME_TOKEN_TIP)"
                  allow-clear />
      <p style="margin-top: 20px;">
        {{ $t(LANG.GAME_RULE.GAME_FLOW) }}
      </p>
      <a-textarea v-model:value="gamePlay"
                  :auto-size="{minRows: 6, maxRows: 14}"
                  :placeholder="$t(LANG.GAME_RULE.GAME_INTRO)"
                  allow-clear />
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
    ruleBook: {
      type: Object,
      default: () => {
        return {
          tokenList: '',
          gamePlay: '',
        }
      },
    },
  },
  emits: ['update:modelValue', 'updateRuleBook'],
  setup (props, { emit }) {
    const state = reactive({
      popVisible: false,
      tokenList: '',
      gamePlay: '',
    })

    watch(() => props.modelValue, () => {
      state.popVisible = props.modelValue
    })
    watch(() => props.ruleBook.tokenList, (val) => {
      state.tokenList = val
    })
    watch(() => props.ruleBook.gamePlay, (val) => {
      state.gamePlay = val
    })
    function handleCancel () {
      emit('update:modelValue', false)
    }
    function handleOk () {
      emit('updateRuleBook', {
        tokenList: state.tokenList,
        gamePlay: state.gamePlay,
      })
      emit('update:modelValue', false)
    }

    const store = useStore()

    // onMounted(() => {
    // })
    return {
      handleCancel,
      handleOk,
      LANG,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" >
.game-rule-book {
  .ant-btn:first-child {
    display: none;
  }
  // .ant-btn-primary {
  //   display: none;
  // }
}
</style>
