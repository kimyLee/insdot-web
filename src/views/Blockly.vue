
<template>
  <div class="blockly-editor page">
    <HeaderNav title="Design tool"
               sub-title="for JOYO Design"
               @back="navigatorBack">
      <a-button v-if="lang === LocaleEnum.EN"
                @click="setLocale(LocaleEnum.ZH)">
        En/中
      </a-button>

      <a-button v-else
                @click="setLocale(LocaleEnum.EN)">
        中/En
      </a-button>

      <a-button @click="toggleVariableDrawerVisible">
        {{ $t("VARIABLE_DRAWER.VARIABLE") }}
      </a-button>
      <a-button>
        clear
      </a-button>
      <a-button @click="saveCode">
        Save
      </a-button>
      <!-- <a-button @click="loadCode">
        Load
      </a-button> -->
      <a-button type="primary"
                @click="connect">
        {{ connectStatus ? 'Connected' : 'connect' }}
      </a-button>
      <a-button type="primary"
                @click="runCode">
        {{ !runStatus ? 'Run' : 'Stop' }}
      </a-button>
    </HeaderNav>

    <VariableDrawer :workspace="workspace"
                    :variable-drawer-visible="variableDrawerVisible" />

    <div class="block-box container">
      <div id="blocklyDiv" />
      <div class="blockly-info">
        <p>调试信息台：</p>
        <!-- 基础信息 -->
        <div class="info-card">
          <div class="info-header">
            基本信息
          </div>
          <a-form-item label="连接状态">
            <div v-show="connectStatus">
              <span class="connected" />已连接
            </div>
            <div v-show="!connectStatus">
              <span class="connected offline" />未连接
            </div>
          </a-form-item>
          <a-form-item label="识别码值">
            {{ lastOID }}
          </a-form-item>
        </div>
        <!-- 动态信息, 倒序展示 -->
        <div class="info-card console">
          <a-timeline>
            <a-timeline-item v-for="item in debugInfo"
                             :key="item.msg"
                             :color="item.color">
              {{ item.msg }}
            </a-timeline-item>
            <!-- <a-timeline-item>[system]: Program start!</a-timeline-item>
            <a-timeline-item>[system]: Program stop!</a-timeline-item>
            <a-timeline-item color="red">
              [system]: Error happen!
            </a-timeline-item> -->
          </a-timeline>
        </div>
        <div class="info-card">
          <div class="info-header">
            变量信息
          </div>
          <p v-for="(item,key) in varInfo"
             :key="key"
             class="var-info">
            <span class="var-label">{{ key }}</span>
            <span class="var-value">{{ (item || '--') }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- <BlocklyDoc v-model:visible="visible" />
    <GameDoc v-model:visible="gameVisible" /> -->
    <BlocklyModal />
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
import { connectJoyo, bleState } from '@/api/joyo-ble/web-ble-server'

import * as Blockly from 'blockly/core'
import { WorkspaceSvg } from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { CrossTabCopyPaste } from '@blockly/plugin-cross-tab-copy-paste'
import { registerCustomToolboxCategory } from '@/lib/blockly/plugins/CustomTypeVariable'
import basicCategories from '@/lib/blockly/category-toolbox/toolbox'
import { pureCanvas, runSample } from '@/lib/blockly/blocks/preBlock'
import '@/lib/blockly/blocks/index'
import { locale, LocaleEnum } from '@/locale/index'

import HeaderNav from '@/components/HeaderNav.vue'
import BlocklyModal from '@/components/blockly-modal/index.vue'

import VariableDrawer from '@/components/VariableDrawer.vue'

import '@/style/blockly-category.scss'
import '@/style/blockly.scss'

import { playPreviewMusic } from '@/lib/blockly/blocks/audio'

// import { setLocale } from '@/lib/blockly/i18n'
import { initBlocklyStore } from '@/lib/blockly/blockly-use-vuex/index'
import { useStore } from 'vuex'

// 引入解释器
// import '@/lib/acorn.js' // todo ts
// import '@/lib/interpreter.js' // todo ts
// import '@/lib/acorn_interpreter' // todo ts

const Interpreter = window.Interpreter

declare global {
    interface Window {
      oidChange: any;
      When_JOYO_Read: any;
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
    BlocklyModal,
  },

  setup () {
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    let myInterpreter: any = markRaw({})
    const preserveVar = ['window', 'self', 'print', 'getDateNow', 'sleepFn', 'blePlayMusic', 'bleSetLight', 'clearAllLight', 'bleSetLightAnimation', 'value', 'When_JOYO_Read', 'setUp']
    const state = reactive({
      lang: locale.getLocale(),
      workspace: null,
      connectStatus: false,
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
    })
    let timer = null as any
    let workspace = null as any

    const route = useRoute()
    const attrs = useAttrs()
    const store = useStore()
    initBlocklyStore(store)

    console.log('attrs,', attrs)

    watch(() => bleState.connectStatus, (val) => {
      state.connectStatus = val
      if (!val) {
        debugLog('断开连接！', 'system')
      } else {
        debugLog('Joyo已连接', 'system')
      }
    })

    const navigatorBack = () => {
      router.push({ name: 'Home' })
    }

    const connect = () => {
      heartBeat()
      connectJoyo()
    }

    const clearCanvas = () => {
      workspace.clear()
      Blockly.serialization.workspaces.load(JSON.parse(pureCanvas), workspace)
    }
    const toggleVariableDrawerVisible = () => {
      state.variableDrawerVisible = !state.variableDrawerVisible
    }
    const saveCode = () => {
      // 保存代码
      const json = Blockly.serialization.workspaces.save(workspace)
      console.log(json, 'json')
      const uuid = (route.query?.uuid as string) || 'temp'
      // 更新
      store.dispatch('updateProject', { uuid, content: JSON.stringify(json) })

      alert('save success')
    }

    function debugLog (str: string, type = 'info') {
      state.debugInfo.push({
        color: type === 'info' ? 'green' : (type === 'error' ? 'red' : 'blue'),
        msg: `[${type}]: ${str}`,
      })
    }

    const loadCode = () => {
      // 保存代码
      const json = localStorage.getItem('temp') || '{}'
      workspace.clear()
      Blockly.serialization.workspaces.load(JSON.parse(json), workspace)
    }

    const generateCode = () => {
      // runCode
      const code = javascriptGenerator.workspaceToCode(workspace)
      console.log(code)
    }

    const handleOIDVal = (num: number) => { // 预先处理下OID码, 将8010 ···值映射到 1···
      console.log('origin', num)
      if (num >= 301 && num <= 314) {
        return num - 300
      }
      // return Math.round(num / 10) - 800
      return num
    }

    // 暂停运行代码
    const stopRun = () => {
      // runCode
      state.sandBoxStepCount = 0
      state.sandBoxMaxSetupBegin = 0
      clearAnimation()
      clearAllLight()
      // clearInterval(timer)
      myInterpreter = null
      state.runStatus = false
    }

    // 初始化沙盒的全局对象
    function initFunc (interpreter: any, globalObject: any) {
      const sleepFn = (delay: number) => {
        var start = new Date().getTime()
        while (new Date().getTime() < start + delay * 1000);
      }
      const bleSetLightFn = (str: string) => {
        return bleSetLight(JSON.parse(str))
      }

      // 执行内置灯光动画
      const bleSetLightAnimationFn = (type: string, time: number, color: number) => {
        // console.log(str)
        bleSetLightAnimation(type, time, color)
        // return
      }

      // 清除所有灯光事件
      const clearAllLightFn = () => {
        clearAnimation()
        return clearAllLight()
      }

      // var wrapper = function alert (text: string) {
      //   return window.alert(arguments.length ? text : '')
      // }
      var wrapper = function print () {
        debugLog(arguments[0], 'log')
        return console.log(...arguments)
      }
      var wrapperDate = function getDateNow () {
        return Date.now()
      }
      interpreter.setProperty(globalObject, 'print',
        interpreter.createNativeFunction(wrapper))

      interpreter.setProperty(globalObject, 'getDateNow',
        interpreter.createNativeFunction(wrapperDate))

      interpreter.setProperty(globalObject, 'sleepFn',
        interpreter.createNativeFunction(sleepFn))

      interpreter.setProperty(globalObject, 'blePlayMusic',
        interpreter.createNativeFunction(blePlayMusic))

      interpreter.setProperty(globalObject, 'bleSetLight',
        interpreter.createNativeFunction(bleSetLightFn))

      interpreter.setProperty(globalObject, 'clearAllLight',
        interpreter.createNativeFunction(clearAllLightFn))

      interpreter.setProperty(globalObject, 'bleSetLightAnimation',
        interpreter.createNativeFunction(bleSetLightAnimationFn))
    }

    function runButton () {
      if (myInterpreter?.run()) {
        setTimeout(runButton, 100)
      }
    }

    function getVariables (allkeys: string[], obj: any) { // 获取沙盒中的变量
      return allkeys.filter((item: string) => {
        return preserveVar.indexOf(item) === -1 && (typeof obj[item] !== 'object' || (obj[item] && obj[item].class === 'Array'))
      })
    }

    // function pushOIDStatus (val: number) { // 第二种识别方式，记录每一个OID的操作序列，恢复时候依次执行
    //   state.OIDstatus.push(val)
    //   localStorage.setItem('OIDstatus', JSON.stringify(state.OIDstatus))
    // }
    function generateVarInfo () {
      const obj = myInterpreter.globalObject.properties
      const vars = getVariables(Object.keys(obj), obj)
      for (let i = 0; i < vars.length; i++) {
        const e = vars[i]
        // state.varInfoOrigin = obj[e]
        if (typeof obj[e] === 'object') {
          state.varInfo[e] = (obj[e]?.properties)
        } else {
          state.varInfo[e] = obj[e]
        }
      }
    }

    function handleInterpreterOIDEvt (val: number) {
      console.log('识别到', val)
      // state.lastOID = val
      state.sandBoxStepCount = 0
      if (myInterpreter && myInterpreter?.appendCode) {
        myInterpreter.appendCode(`When_JOYO_Read(${val})`)
        // nextStep()
        myInterpreter.run()
        // 获取参数状态
        generateVarInfo()
      }
    }

    function nextStep () {
      try {
        if (myInterpreter?.step()) {
          state.sandBoxStepCount++
          if (state.sandBoxStepCount < state.sandBoxMaxStep) {
            window.setTimeout(nextStep, 0)
          } else {
            stopRun()
            debugLog('未终结的循环，超过最大可执行数', 'error')
          }
        } else { // 执行完毕
          generateVarInfo()
        }
      } catch (err: any) {
        debugLog(err.toString())
        console.log(err)
      }
    }

    function heartBeat () {
      clearInterval(timer)
      timer = setInterval(() => { // 定时防止休眠
        console.log('beat')
        bleSetSingleLight(11, 0x000000)
      }, 20000)
    }

    function clearHeartBeat () {
      clearInterval(timer)
    }

    const runCode = async () => {
      if (state.runStatus) {
        stopRun()
        return
      }

      state.varInfo = {}
      // state.OIDstatus = []
      state.debugInfo = []

      if (!bleState.connectStatus) {
        debugLog('JOYO未连接', 'system')
      }
      if (workspace) {
        let code = javascriptGenerator.workspaceToCode(workspace) as string

        // 移除外部的block
        const codeArr = code.split('\n\n')
        const newCodeArr = codeArr.filter((i) => {
          const item = i.replace(/\n/g, '')
          return item.indexOf('function') === 0 ||
          item.indexOf('// ') === 0 ||
          item.indexOf('var ') === 0
        })
        code = newCodeArr.join('\n')

        try {
          // 新建一个解释器
          myInterpreter = new Interpreter(code, initFunc)
          nextStep()
          //  myInterpreter.run()
          state.runStatus = true
        } catch (err: any) {
          debugLog(err.toString(), 'error')
          console.log(err)
        }
      }
    }

    function handleShowColor (val: number) {
      const colors = [0xffff00, 0xb60909, 0xcccccc, 0xff9800, 0x00ff00, 0x0000ff, 0xff0000, 0x9c27b0]
      const index = (val - 25) % 8
      bleSetLight({ colors: Array(12).fill(colors[index]), bright: 1 })
      // todo: 是否需要消失
    }

    function handlePlayAudio (val: number) {
      const music = ['01do', '02re', '03me', '04fa', '05so', '06la']
      if (val >= 1 && val <= 6) {
        blePlayMusic(music[val - 1])
      }
      if (val === 19) {
        blePlayMusic('fnon')
      }
    }

    function getContentByUUID (uuid = '') {
      const content = localStorage.getItem(`block-${uuid}`) || runSample
      try {
        // 加载json
        Blockly.serialization.workspaces.load(JSON.parse(content), workspace)
      } catch (error) {
        console.log(error)
      }
    }

    // 重新绘制当前页面，切换多语言时候使用
    function reRenderCanvas () {
      // 重新渲染 workspace
      const json = Blockly.serialization.workspaces.save(workspace)
      Blockly.serialization.workspaces.load(json, workspace)
      // 更新文本
      state.lang = locale.getLocale()
    }

    function initBlocklyPlugins () {
      // TODO: 解决重复注册的问题
      try {
        // init copyPaste
        const CrossTabCopyPastePlugin = new CrossTabCopyPaste()
        CrossTabCopyPastePlugin.init({
          contextMenu: true,
          shortcut: true,
        })

        // optional: Remove the duplication command from Blockly's context menu.
        Blockly.ContextMenuRegistry.registry.unregister('blockDuplicate')
      } catch (error) {
        console.log(error)
      }
    }

    // 路由守卫
    onBeforeRouteLeave((to, from) => {
      const uuid = route.query?.uuid as string
      const json = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
      if (uuid) {
        const content = localStorage.getItem(`block-${uuid}`)
        if (content !== json) {
          if (window.confirm('当前程序未保存，确认离开？')) {
            return true
          }
          return false
        }
      }
      return true
    })

    onUnmounted(() => {
      //
    })

    onMounted(() => {
      Blockly.zelos.ConstantProvider.prototype.FIELD_COLOUR_FULL_BLOCK = false

      workspace = Blockly.inject('blocklyDiv', {
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        maxInstances: {
          setUp: 1,
        },
        toolbox: basicCategories,
        renderer: 'zelos',

      } as any)

      // customToolBoxCategory
      registerCustomToolboxCategory(workspace)

      initBlocklyPlugins()

      // function handleWorkspaceChange (event: any) {
      //   if (event.type === Blockly.Events.BLOCK_CHANGE) {
      //     const block = workspace.getBlockById(event.blockId)
      //     if (block.type === 'play_audio') {
      //       playPreviewMusic(event)
      //     }
      //   }
      // }
      // workspace.addChangeListener(handleWorkspaceChange)

      // playPreviewMusic

      javascriptGenerator.addReservedWords('code') // 获取js代码

      // 切换多语言
      locale.$on('change', reRenderCanvas)

      window.blockly = Blockly
      window.workspace = workspace
      window.javascriptGenerator = javascriptGenerator

      // 获取当前ID的程序
      // 获取当前游戏内容
      getContentByUUID(route.query?.uuid as string)
      store.dispatch('getProject') // 获取所有文件

      // 获取js代码
      // javascriptGenerator.workspaceToCode(workspace);

      ;(window as any).handleNotifyEvent = (msg: number[]) => {
        if (msg.length === 11 && msg[2] === 0x05 && msg[3] === 0xB1 && msg[4] === 0x04) {
          const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
          state.lastOID = val
          if (myInterpreter && myInterpreter.appendCode) {
            // const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
            handleInterpreterOIDEvt(val)

            // 限定 1 到 54
            // if (val > 0 && val < 55 && val !== window.lastOID) { // todo: 通用码
            //   window.lastOID = val
            //   handleInterpreterOIDEvt(val)
            // }
          } else {
            // 没有连接时候
            if (!state.runStatus) {
              // const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
              // window.oidChange(val)
            }
          }
        }
      }
    })

    return {
      // testColorCode,
      ...toRefs(state),
      runCode,
      generateCode,
      saveCode,
      clearCanvas,
      connect,
      loadCode,
      navigatorBack,
      toggleVariableDrawerVisible,
      LocaleEnum,
      setLocale: locale.setLocale,
    }
  },
})
</script>

<style lang="scss" scoped>
.blockly-editor::v-deep {
  width: 100%;
  height: 100vh;
  overflow: hidden;

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
    border-left: 1px solid #ccc;

    // 连接点
    .info-card::v-deep {
      .info-header {
        color: #000000d9;
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 12px;
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
        width: 100px;
        padding: 10px;
        box-sizing: border-box;
        border-right: 1px solid #ccc;
        // background-color: #6c6c6c;
      }
      .var-value {
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
}
</style>
