
<template>
  <div class="blockly">
    <div class="header">
      <div>
        <span class="back"
              @click="navigatorBack()">
          Back
        </span>
        <span class="title"
              style="margin-left: 20px;font-size: 14px"
              @click="preSaveCode">
          预览
        </span>
        <span class="title"
              style="font-size: 14px"
              @click="generateCode">
          生成
        </span>
        <!-- <span class="title"
              :class="{'active': currentState === 'spy'}"
              style="font-size: 14px;margin-left: 16px;"
              @click="switchCode('spy')">
          spy game
        </span> -->
        <span class="title"
              :class="{'active': currentState === 'puzzle'}"
              style="font-size: 14px"
              @click="switchCode('puzzle')">
          puzzle boy
        </span>
        <span class="title"
              :class="{'active': currentState === 'local'}"
              style="font-size: 14px"
              @click="switchCode('local')">
          workspace
        </span>
      </div>
      <div>
        <!-- <span class="title header-btn"
              @click="spy">
          运行spy
        </span> -->

        <span class="title header-btn"
              @click="connect">
          {{ connectStatus ? 'Connected' : 'connect' }}
        </span>
        <!-- <span class="title header-btn"
              @click="openDocs">
          帮助文档
        </span>
        <span class="title header-btn"
              @click="openGameDocs">
          游戏指南
        </span> -->

        <span class="title header-btn delete"
              @click="clearCanvas">
          clear
        </span>
        <span class="title header-btn"
              @click="saveCode">
          Save
        </span>
        <span class="title header-btn"
              @click="loadCode">
          Load
        </span>
        <span class="title header-btn run"
              @click="runCode">
          {{ !runStatus ? 'Run' : 'Stop' }}
        </span>
        <a-dropdown overlay-class-name="dropdown">
          <a class="title header-btn"
             @click.prevent>
            更多

          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;"
                   class="menu-item"
                   @click="openDocs">帮助文档</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;"
                   class="menu-item"
                   @click="openGameDocs">游戏指南</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;"
                   class="menu-item"
                   style="color: red;"
                   @click="recoverStatus">Recover</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="block-box">
      <div id="blocklyDiv" />
      <div class="blockly-info">
        <p>调试信息台：</p>
        <p v-for="(item,key) in varInfo"
           :key="key"
           class="var-info">
          {{ key }}:{{ JSON.stringify(item || '') || '--' }}
        </p>
        <br />
        <span style="color: #888">{{ debugInfo }}</span>
      </div>
    </div>

    <BlocklyDoc v-model:visible="visible" />
    <GameDoc v-model:visible="gameVisible" />
  </div>
</template>

<script lang="ts">
import {
  ClientResponse,
  ClientResponseWithData,
  BleList,
} from '@/api/common-type'
import router from '@/router'
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
} from 'vue'
import { blePlayMusic, bleSetLight, bleSetSingleLight, clearAllLight } from '@/api/joyo-ble/index'
import { bleSetLightAnimation, clearAnimation } from '@/api/joyo-ble/light-animation'
import Blockly from 'blockly' // todo: 拆解
import basicCategories from '@/lib/blockly/toolbox'
// import spy from '@/lib/spy'
import preDefine, { pureCanvas, runSample } from '@/lib/blocks/preBlock'
// import preDefinePuzzle from '@/lib/blocks/preBlockPuzzle'
// import testCode from '@/lib/blocks/testCode'
import '@/lib/blocks/index'
import { connectJoyo, bleState } from '@/api/joyo-ble/web-ble-server'
import BlocklyDoc from '@/components/tech/BlocklyDoc.vue' // @ is an alias to /src
import GameDoc from '@/components/tech/GameDoc.vue' // @ is an alias to /src

import emailjs from '@emailjs/browser'

import * as Zh from 'blockly/msg/zh-hans'

const CustomZh = {
  PROCEDURES_DEFNORETURN_TITLE: '跳转到',
  PROCEDURES_DEFRETURN_TITLE: '跳转到',
}

// import * as Blockly from 'blockly/core'
// import 'blockly/blocks'

// 引入解释器
// import '@/lib/acorn.js' // todo ts
// import '@/lib/interpreter.js' // todo ts
// import '@/lib/acorn_interpreter' // todo ts

const Interpreter = window.Interpreter

declare global {
    interface Window {
      oidChange: any;
      When_JOYO_Read: any;
      lastOID: any;
      workspace: any;
      blePlayMusic: any;
      bleSetLight: any;
      sleepFn: any;
      setUp: any;
      Interpreter: any;
    }
}

export default defineComponent({
  name: 'BleUsage',
  components: {
    BlocklyDoc,
    GameDoc,
  },
  setup () {
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    let myInterpreter: any = markRaw({})
    const preserveVar = ['window', 'self', 'print', 'getDateNow', 'sleepFn', 'blePlayMusic', 'bleSetLight', 'clearAllLight', 'bleSetLightAnimation', 'value', 'When_JOYO_Read', 'setUp']
    const state = reactive({
      workspace: null,
      connectStatus: false,
      recoverFlag: false,
      runStatus: false,
      currentState: 'local',
      visible: false,
      gameVisible: false,
      // varInfo: [] as string[],
      varInfo: {} as Record<string, any>,
      varInfoOrigin: {} as Record<string, any>,
      OIDstatus: [] as number[], // 识别的OID序列
      debugInfo: '',
      sandBoxStepCount: 0,
      sandBoxMaxStep: 8000,
      sandBoxMaxSetupTime: 5000,
      sandBoxMaxSetupBegin: 0,
    })
    let timer = null as any
    let workspace = null as any

    watch(() => bleState.connectStatus, (val) => {
      state.connectStatus = val
      if (!val) {
        debugLog('断开连接！', 'system')
      } else {
        debugLog('Joyo已连接', 'system')
      }
    })

    const navigatorBack = () => {
      router.back()
    }

    const connect = () => {
      heartBeat()
      connectJoyo()
      // setTimeout(() => {
      //   state.connectStatus = true
      // }, 2000)
    }

    const preSaveCode = () => {
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
      console.log(xml)
    }

    const openDocs = () => {
      state.visible = true
    }

    const openGameDocs = () => {
      state.gameVisible = true
    }

    const clearCanvas = () => {
      workspace.clear()
      Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(pureCanvas || '') as any)
    }

    const saveCode = () => {
      // 保存代码
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
      localStorage.setItem('temp', xml)
      alert('save success')
    }

    function debugLog (str: string, type = 'info') {
      state.debugInfo = `[${type}]: ` + state.debugInfo + '\n' + str
    }

    function switchCode (str: string) {
      if (str === 'local') {
        loadCode()
      } else {
        // 先保存本地代码
        if (state.currentState === 'local') {
          const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
          localStorage.setItem('temp', xml)
        }

        setTimeout(() => {
          if (str === 'puzzle') {
            workspace.clear()
            // Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(preDefinePuzzle) as any)
          } else {
            workspace.clear()
            Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(preDefine) as any)
          }
        }, 200)
      }
      state.currentState = str
    }

    const loadCode = () => {
      // 保存代码
      const xml = localStorage.getItem('temp')
      workspace.clear()
      Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(xml || '') as any)
    }

    const generateCode = () => {
      // runCode
      const code = Blockly.JavaScript.workspaceToCode(workspace)
      console.log(code)
    }

    const handleOIDVal = (num: number) => { // 预先处理下OID码, 将8010 ···值映射到 1···
      console.log(num)
      if (num >= 301 && num <= 309) {
        return num - 300
      }
      return Math.round(num / 10) - 800
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

    // function saveStatus () { // 保存当前数据快照，在识别OID前触发
    //   // localStorage.setItem('state', JSON.stringify(state.varInfoOrigin))
    //   // localStorage.setItem('lastOID', window.lastOID)
    // }

    function pushOIDStatus (val: number) { // 第二种识别方式，记录每一个OID的操作序列，恢复时候依次执行
      state.OIDstatus.push(val)
      localStorage.setItem('OIDstatus', JSON.stringify(state.OIDstatus))
    }

    function sleep (ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function recoverStatus () { // 根据oid status 重置当前快照
      if (!bleState.connectStatus) {
        alert('JOYO未连接')
        return
      }
      state.recoverFlag = true
      // const stacks = (localStorage.getItem('OIDstatus') || []) as number[]
      // stopRun()
      // await sleep(100)
      // runCode()
      // setTimeout(async () => {
      //   for (let i = 0; i < stacks.length; i++) {
      //     handleInterpreterOIDEvt(stacks[i])
      //     await sleep(50)
      //   }
      //   state.recoverFlag = false // 恢复结束
      // }, 300)
    }

    function handleInterpreterOIDEvt (val: number) {
      state.sandBoxStepCount = 0
      console.log('handleInterpreterOIDEvt', val, Date.now())
      if (myInterpreter && myInterpreter?.appendCode) {
        myInterpreter.appendCode(`When_JOYO_Read(${val})`)
        // nextStep()
        myInterpreter.run()
        // 获取参数状态
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
    }

    function triggerLastOID () { // 触发最后一次OID信号
      //
    }

    function nextStep () {
      // if (!state.sandBoxMaxSetupBegin) {
      //   state.sandBoxMaxSetupBegin = Date.now()
      // }
      try {
        if (myInterpreter?.step()) {
          state.sandBoxStepCount++
          // const lastTime = Date.now() - state.sandBoxMaxSetupBegin
          // if (state.sandBoxStepCount < state.sandBoxMaxStep && (lastTime < (state.sandBoxMaxSetupTime * 1000))) {
          if (state.sandBoxStepCount < state.sandBoxMaxStep) {
            // const obj = myInterpreter.globalObject.properties
            // const vars = getVariables(Object.keys(obj), obj)
            // state.varInfo = vars.map(e => `${e}: ${obj[e] ?? '--'}`)
            window.setTimeout(nextStep, 0)
          } else {
            stopRun()
            debugLog('未终结的循环，超过最大可执行数', 'error')
          }
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
      // emailjs.send('service_aqan9qa', 'template_fbj9xma', {
      //   from_name: 'JOYO',
      //   to_name: 'kimmy',
      // }, 'qOBExV5FFMkj2paLy')
      if (state.runStatus) {
        stopRun()
        return
      }
      state.varInfo = {}
      // state.varInfoOrigin = {}
      window.lastOID = -1
      state.OIDstatus = []
      state.debugInfo = ''

      if (!bleState.connectStatus) {
        debugLog('JOYO未连接', 'system')
      }
      if (workspace) {
        let code = Blockly.JavaScript.workspaceToCode(workspace) as string
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
          // runButton()
        } catch (err: any) {
          debugLog(err.toString())
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

    // function handlePlayAudio (val: number) {
    //   //
    // }

    onUnmounted(() => {
      //
    })

    onMounted(() => {
      // (Blockly as any).setLocale(Zh);
      // (Blockly as any).setLocale(CustomZh)
      Blockly.zelos.ConstantProvider.prototype.FIELD_COLOUR_FULL_BLOCK = false
      workspace = Blockly.inject('blocklyDiv', {
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        toolbox: basicCategories,
        renderer: 'zelos',

      } as any)

      Blockly.JavaScript.addReservedWords('code') // 获取js代码

      Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(runSample) as any)

      // 获取js代码
      // Blockly.JavaScript.workspaceToCode(workspace);

      // get xml
      // Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))

      // load xml
      // Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(xml));
      state.OIDstatus = JSON.parse(localStorage.getItem('OIDstatus') || '[]')
      window.Blockly = Blockly
      window.workspace = workspace
      window.lastOID = -1;

      (window as any).handleNotifyEvent = (msg: number[]) => {
        if (msg.length === 11 && msg[2] === 0x05 && msg[3] === 0xB1 && msg[4] === 0x04) {
          if (myInterpreter && myInterpreter.appendCode) {
            const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
            console.log('appendCode', val)
            // 限定 1 到 54
            if (val > 0 && val < 55 && val !== window.lastOID) { // todo: 通用码
              window.lastOID = val
              pushOIDStatus(val)
              // // 在oid识别和run code前执行状态保存，恢复保存时候手动触发最后一次oid事件
              // // 确保恢复时候 When_JOYO_Read 代码能够执行
              handleInterpreterOIDEvt(val)

              // myInterpreter.appendCode(`When_JOYO_Read(${val})`)
              // myInterpreter.run()
              // // 获取参数状态
              // const obj = myInterpreter.globalObject.properties
              // const vars = getVariables(Object.keys(obj), obj)
              // for (let i = 0; i < vars.length; i++) {
              //   const e = vars[i]
              //   // state.varInfoOrigin = obj[e]
              //   if (typeof obj[e] === 'object') {
              //     state.varInfo[e] = (obj[e]?.properties)
              //   } else {
              //     state.varInfo[e] = obj[e]
              //   }
              // }

              // -----------------------
              // state.varInfo = vars.map(e => {
              //   if (typeof obj[e] === 'object') {
              //     return e + ':' + JSON.stringify(obj[e]?.properties)
              //   } else {
              //     return e + ':' + obj[e] ?? '--'
              //   }
              // })
              // window.When_JOYO_Read && window.When_JOYO_Read(val)
            }
          } else {
            // 没有连接时候
            if (!state.runStatus) {
              const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
              console.log('not connect', val)
              // 1-18: 数字+符号
              // 19-24: 音效，do re mi + delete
              // 25-48: 颜色 羊了个羊
              if (val >= 25 && val <= 48) { // 识别颜色
                handleShowColor(val)
              }
              if (val === 19) {
                emailjs.send('service_aqan9qa', 'template_fbj9xma', {
                  from_name: 'JOYO',
                  to_name: 'kimmy',
                }, 'qOBExV5FFMkj2paLy')
                // location.href = 'sms:13764567708'
              }
              if ((val >= 1 && val <= 7) || val === 19) { // 识别音效
                handlePlayAudio(val)
              }
              if (val >= 25 && val <= 48) { //
                // handleShowColor(val)
              }
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
      preSaveCode,
      clearCanvas,
      openDocs,
      openGameDocs,
      connect,
      loadCode,
      navigatorBack,
      switchCode,
      // spy,
      recoverStatus,

    }
  },
})
</script>

<style lang="scss" scoped>
.blockly::v-deep {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .blocklyToolboxDiv {
    background-color: #888;
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
    font-size: 20px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    border-left: 1px solid #ccc;
    .var-info {
      width: 100%;
      overflow: auto;
      padding: 0;
      margin: 0;
      &:not(:last-child) {
        border-bottom: 1px solid #ccc;
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
