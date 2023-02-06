
<template>
  <div class="blockly-editor page">
    <HeaderNav
      sub-title="Cobo 小游戏"
      @back="navigatorBack">
      <div class="logo" />
      <a-button class="rule-btn"
                shape="round"
                @click="visibleOfGameRule = true">
        玩法规则
      </a-button>

      <a-button key="2"
                class="header-btn"
                @click="connectJoyo">
        <span class="connect-text">
          <span class="connect-dot"
                :class="{'active': connectStatus}" />
          {{ connectStatus? $t(LANG.BLOCKLY_MENU.DISCONNECT) : $t(LANG.BLOCKLY_MENU.CONNECT) }}
        </span>
      </a-button>
      <a-button type="primary"
                class="header-btn"
                @click="runCode">
        {{ !runStatus ? $t(LANG.BLOCKLY_MENU.RUN) : $t(LANG.BLOCKLY_MENU.STOP) }}
      </a-button>
    </HeaderNav>

    <VariableDrawer :workspace="workspace"
                    :variable-drawer-visible="variableDrawerVisible"
                    @close="variableDrawerVisible = false" />
  </div>
</template>

<script lang="ts">
import {
  ClientResponse,
  ClientResponseWithData,
  BleList,
} from '@/api/common-type'
import router from '@/router'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import GameRule from '@/components/GameRule.vue'

import {
  defineComponent,
  getCurrentInstance,
  reactive,
  onMounted,
  toRefs,
  onUnmounted,
  nextTick,
  markRaw,
  watch,
  computed,
  useAttrs,
} from 'vue'

import { blePlayMusic, bleSetLight, bleSetSingleLight, clearAllLight } from '@/api/joyo-ble/index'
import { bleSetLightAnimation, clearAnimation } from '@/api/joyo-ble/light-animation'
// import { connectJoyo, bleState } from '@/api/joyo-ble/web-ble-server'

import * as Blockly from 'blockly/core'
import { WorkspaceSvg } from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { CrossTabCopyPaste } from '@blockly/plugin-cross-tab-copy-paste'
import { registerCustomToolboxCategory } from '@/lib/blockly/plugins/CustomTypeVariable'
import basicCategories from '@/lib/blockly/category-toolbox/toolbox'
import preSet from '@/lib/blockly/blocks/preBlock'
import '@/lib/blockly/blocks/index'
import { locale, LocaleEnum } from '@/locale/index'

import HeaderNav from '@/components/HeaderNav.vue'
import BlocklyModal from '@/components/blockly-modal/index.vue'

import VariableDrawer from '@/components/VariableDrawer.vue'

import '@/style/blockly-category.scss'
import '@/style/blockly.scss'

import LANG from '@/i18n/type'

import { playPreviewMusic } from '@/lib/blockly/blocks/audio'
// import { setLocale } from '@/lib/blockly/i18n'
import { initBlocklyStore } from '@/lib/blockly/blockly-use-vuex/index'
import { useStore } from 'vuex'

const Interpreter = window.Interpreter

declare global {
    interface Window {
      oidChange: any;
      JOYO_identify: any;
      // lastOID: any;
      workspace: any;
      blePlayMusic: any;
      bleSetLight: any;
      sleepFn: any;
      setUp: any;
      Interpreter: any;
      javascriptGenerator: any,
      blockly: any
    }
}

export default defineComponent({
  name: 'BleUsage',
  components: {
    HeaderNav,
    VariableDrawer,
    // BlocklyModal,
    // InfoCircleOutlined,
    // GameRule,
  },

  setup () {
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    const myInterpreter: any = markRaw({})
    const preserveVar = ['window', 'self', 'print', 'getDateNow', 'sleepFn', 'blePlayMusic', 'bleSetLight', 'clearAllLight', 'bleSetLightAnimation', 'value', 'JOYO_identify', 'setUp']
    const state = reactive({
      lang: locale.getLocale(),
      workspace: null,
      recoverFlag: false,
      runStatus: false,
      currentState: 'local',
      visible: false,
      gameVisible: false,
      variableDrawerVisible: false,
      infoList: [] as string[],
      // varInfo: [] as string[],
      varInfo: {} as Record<string, any>,
      varInfoOrigin: {} as Record<string, any>,
      // OIDstatus: [] as number[], // 识别的OID序列
      debugInfo: [] as any,
      sandBoxStepCount: 0,
      sandBoxMaxStep: 8000,
      sandBoxMaxSetupTime: 5000,
      sandBoxMaxSetupBegin: 0,
      lastOID: 0,
      visibleOfGameRule: false,
      ruleBook: {
        tokenList: '',
        gamePlay: '',
      },
    })
    const timer = null as any
    const workspace = null as any

    const route = useRoute()
    const attrs = useAttrs()
    const store = useStore()
    initBlocklyStore(store)

    const connectStatus = computed(() => { // 看下行否
      return store.getters['ble/connectStatus']
    })

    // watch(() => connectStatus.value, (val) => {
    // })

    const navigatorBack = () => {
      router.push({ name: 'Home' })
    }

    function connectJoyo () {
      if (!connectStatus.value) {
        store.dispatch('ble/bleConnect')
      } else {
        store.dispatch('ble/bleDisconnect')
      }
    }

    const handleOIDVal = (num: number) => { // 预先处理下OID码, 将8010 ···值映射到 1···
      return num
    }

    // 暂停运行代码
    const stopRun = () => {
      // runCode

      clearAnimation()
      clearAllLight()
      // clearInterval(timer)
      state.runStatus = false
    }

    // 初始化沙盒的全局对象
    // type CardUnit = []
    let playerNum = 0
    let playerArr = [] as any[] // 保存玩家牌型的多维数组
    const cardPool = [] as any[] // 卡牌池
    const colorMap = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00] // 颜色
    const runCode = async () => {
      if (state.runStatus) {
        stopRun()
      }
      // 开始游戏
    }
    function initGame (num: number) {
      playerNum = num
      playerArr = Array(num) // 生成对应长度的数组
    }
    function initCardPool () { // 初始化牌池
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 4; j++) {
          cardPool.push([i, j]) // [数字, 花色]
        }
      }
    }
    function shuffle (arr: any[]) { // 洗牌
      let m = arr.length
      while (m > 1) {
        const index = Math.floor(Math.random() * m--);
        [arr[m], arr[index]] = [arr[index], arr[m]]
      }
      return arr
    }

    function initPlayerCard () { // 玩家发牌
      for (let i = 0; i < playerNum; i++) {
        playerArr[i] = []
        for (let j = 0; j < 4; j++) {
          playerArr[i].push(cardPool.shift())
        }
      }
    }

    // 路由守卫
    // onBeforeRouteLeave((to, from) => {
    // })

    onUnmounted(() => {
      //
    })

    onMounted(() => {
      locale.setLocale(locale.getLocale())

      ;(window as any).handleNotifyEvent = (msg: number[]) => {
        if (msg.length === 11 && msg[2] === 0x05 && msg[3] === 0xB1 && msg[4] === 0x04) {
          const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
          state.lastOID = val
        }
      }
    })

    return {
      connectStatus,
      // testColorCode,
      ...toRefs(state),
      runCode,

      connectJoyo,
      // loadCode,
      navigatorBack,
      LANG,
      // LocaleEnum,
      // setLocale: locale.setLocale,
    }
  },
})
</script>

<style lang="scss" scoped>
.connect-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  margin-top: -4px;
  vertical-align: middle;
  background: #ccc;
  border-radius: 50%;
  &.active {
    background: #52c41a;
  }
}
.rule-btn {
  background-color: #faad14;
  color: #fff;
  border: none;
}
.blockly-editor::v-deep {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .logo {
    left: 50px;
  }
  .ant-page-header-back-button {
    color: #fff;
  }
  .header-btn {
    color: #fff;
    background: rgba(255, 255, 255, .2);
    border-color: rgba(255, 255, 255, .2);
    &:hover {
      background: rgba(255, 255, 255, .5);
      border-color: rgba(255, 255, 255, .5);
    }
  }

  .blocklyToolboxDiv {
    background-color: #fff;
    border-right: 1px solid #eee;
  }
  .blocklyTreeRow {
    // padding: 20px 0;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
    &.blocklyTreeSelected {
      background-color: rgb(89, 124, 250) !important;
    }
  }
}
.header {
  width: 100%;
  height: 88px;
  background-color: #232528;
  display: flex;
  justify-content: space-between;
  padding: 13px 17px 10px;
  span {
    display: inline-block;
  }
  .back {
    height: 66px;
    padding: 0 12px;
    background: #6c6c6c;
    color: #fff;
    border-radius: 10px;
    font-weight: bold;
    font-size: 30px;
    line-height: 65px;
  }
  .title {
    font-weight: bold;
    font-size: 30px;
    color: #fff;
    height: 65px;
    line-height: 65px;
    margin-right: 20px;
    cursor: pointer;
    &.active {
      font-size: 24px !important;
    }
  }
  .header-btn {
    background-color: #497cff;
    border-radius: 5px;
    padding: 0 10px;
    height: 65px;
    display: inline-block;
    box-sizing: border-box;

    &.delete {
      background-color: red;
    }
    &.run {
      background-color: #02ebae;
    }
    &:active {
      opacity: 0.7;
    }
  }
}
.dropdown {
  .menu-item {
    font-size: 20px;
    padding: 15px 10px;
  }
}
.block-box {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  .blockly-info {
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
    height: calc(100vh - 80px);

    width: 300px;
    text-align: left;
    color: #444;
    font-size: 16px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    // border-left: 1px solid #ccc;
    // box-shadow: -9px 0px 10px 0px rgba(0, 0, 0, 0.25);

    // 连接点
    .info-card::v-deep {

      .create-var {
        background-color: #faad14;
        color: #fff;
        border: none;
      }
      .placeholder-text {
        color: #aaa;
        font-size: 14px;
      }
      .info-header {
        color: #000000d9;
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 12px;
        line-height: 32px;
        position: relative;
        height: 32px;
        .text-right {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .ant-form-item {
        margin-bottom: 0;
      }

      &.console {
        padding: 10px 0;
        height: 35%;
        overflow-y: scroll;
        overflow-x: hidden;
      }
    }

    .connected {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      background: #02ebae;
      margin-right: 5px;
      &.offline {
        background: red;
      }
    }
    .var-info-box {
      max-height: calc(35vh);
      overflow-y: auto;
      overflow-x: hidden;

    }
    .var-info {
      width: 100%;
      overflow: auto;
      padding: 0;
      margin: 0;
      display: flex;
      &:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }
      .var-label {
        width: 50%;
        padding: 10px;
        box-sizing: border-box;
        border-right: 1px solid #ccc;
        overflow: hidden;
        text-overflow: ellipsis;
        // background-color: #6c6c6c;
      }
      .var-value {
        // overflow: hidden;
        // text-overflow: ellipsis;
        width: 50%;
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }
}
#blocklyDiv {
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  .clear-canvas {
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 1000;
  }
}
</style>
