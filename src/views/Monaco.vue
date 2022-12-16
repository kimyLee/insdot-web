
<template>
  <div class="code-view">
    <div class="header">
      <div>
        <span class="back"
              @click="navigatorBack()">
          Back
        </span>
        <!-- 上传文件 -->
        <label class="title"
               style="font-size: 20px;margin-left: 16px;"
               for="fileInput">
          Import
          <input id="fileInput"
                 type="file"
                 accept=".js"
                 hidden="" />
        </label>

        <span class="title"
              style="font-size: 20px"
              @click="exportCode">
          export
        </span>
      </div>
      <div>
        <span class="title header-btn"
              @click="connect">
          {{ connectStatus ? 'Connected' : 'connect' }}
        </span>
        <!-- <span class="title header-btn delete"
              @click="clearCanvas">
          clear
        </span> -->
        <span class="title header-btn"
              @click="saveCode">
          Save
        </span>
        <span class="title header-btn"
              @click="loadCode()">
          Load
        </span>
        <span class="title header-btn run"
              @click="runCode">
          {{ !runStatus ? 'Run' : 'Stop' }}
        </span>
        <!-- <a-dropdown overlay-class-name="dropdown">
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
        </a-dropdown> -->
      </div>
    </div>
    <div class="code-box">
      <div id="container" />
    </div>
    <!-- 文本上传区 -->
  </div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor'

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
import '@/lib/blocks/index'
import { connectJoyo, bleState } from '@/api/joyo-ble/web-ble-server'

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
  },
  setup () {
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    let myInterpreter: any = markRaw({})
    const preserveVar = ['window', 'self', 'print', 'getDateNow', 'sleepFn', 'blePlayMusic', 'bleSetLight', 'clearAllLight', 'bleSetLightAnimation', 'value', 'When_JOYO_Read', 'setUp']
    let codeEditor = null as unknown as (monaco.editor.IStandaloneCodeEditor)
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
    const workspace = null as any

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
    }
    const clearCanvas = () => {
      //
    }
    const getCode = () => {
      return codeEditor?.getValue()
    }

    const saveCode = () => {
      // 保存代码
      const code = getCode()
      localStorage.setItem('js-code', code)
      alert('save success')
    }

    const loadCode = (str?: string) => {
      const code = str || localStorage.getItem('js-code') || ''
      if (codeEditor) {
        codeEditor.setValue(code)
      }
    }

    const importCode = () => {
      // const code = str || localStorage.getItem('js-code') || ''
      if (codeEditor) {
        // codeEditor.setValue(code)
      }
    }
    const exportCode = () => {
      const code = getCode()
      download('game.js', code)
    }

    function download (filename: string, text: string) {
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }

    function debugLog (str: string, type = 'info') {
      state.debugInfo = `[${type}]: ` + state.debugInfo + '\n' + str
    }

    // function switchCode (str: string) {
    //   if (str === 'local') {
    //     loadCode()
    //   } else {
    //     // 先保存本地代码
    //     if (state.currentState === 'local') {
    //       const code = getCode()
    //       localStorage.setItem('js-code', code)
    //     }

    //     setTimeout(() => {
    //       loadCode(spyCode)
    //     }, 100)
    //   }
    //   state.currentState = str
    // }

    const handleOIDVal = (num: number) => { // 预先处理下OID码, 将8010 ···值映射到 1···
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
    }

    function handleInterpreterOIDEvt (val: number) {
      state.sandBoxStepCount = 0
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
      try {
        if (myInterpreter?.step()) {
          state.sandBoxStepCount++
          if (state.sandBoxStepCount < state.sandBoxMaxStep) {
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
      // state.varInfoOrigin = {}
      window.lastOID = -1
      state.OIDstatus = []
      state.debugInfo = ''

      if (!bleState.connectStatus) {
        debugLog('JOYO未连接', 'system')
      }
      if (codeEditor) {
        const code = getCode()
        try {
          // 新建一个解释器
          myInterpreter = new Interpreter(code, initFunc)
          // nextStep()
          myInterpreter.run()
          state.runStatus = true
        } catch (err: any) {
          debugLog(err.toString())
          console.log(err)
        }
      }
    }

    function initFileEvt () {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      if (fileInput) {
        fileInput.addEventListener('change', function selectedFileChanged () {
          if (this?.files?.length === 0) {
            console.log('请选择文件！')
            return
          }

          const reader = new FileReader()
          reader.onload = function fileReadCompleted () {
          // 当读取完成时，内容只在`reader.result`中
            // console.log(reader.result)
            try {
              loadCode(reader.result as string)
            } catch (err) {
              console.log(err)
            }
          }
          this?.files && reader.readAsText(this?.files[0])
        })
      }
    }

    onUnmounted(() => {
      //
    })

    onMounted(() => {
      const box = document.getElementById('container')
      if (box) {
        codeEditor = markRaw(monaco.editor.create(document.getElementById('container') as HTMLElement, {
          value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
          language: 'javascript',
          fontSize: 20,
          theme: 'vs-dark',
        }))
      }

      initFileEvt()

      state.OIDstatus = JSON.parse(localStorage.getItem('OIDstatus') || '[]')
      window.workspace = workspace
      window.lastOID = -1;

      (window as any).handleNotifyEvent = (msg: number[]) => {
        if (msg.length === 11 && msg[2] === 0x05 && msg[3] === 0xB1 && msg[4] === 0x04) {
          if (myInterpreter && myInterpreter.appendCode) {
            const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
            // 限定 1 到 54
            // if (val > 0 && val < 55 && val !== window.lastOID) { // todo: 通用码
            if (val !== window.lastOID) { // todo: 通用码
              window.lastOID = val
              handleInterpreterOIDEvt(val)
            }
          }
        }
      }
    })

    return {
      // testColorCode,
      ...toRefs(state),
      runCode,
      saveCode,
      clearCanvas,
      connect,
      loadCode,
      navigatorBack,
      importCode,
      exportCode,
      // switchCode,
      recoverStatus,

    }
  },
})
</script>

<style lang="scss" scoped>
.code-view::v-deep {
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
.code-box {
  width: 100%;
  height: 100%;
  text-align: left;
  font-size: 24px;
  // flex: 1;
  // display: flex;
}
#container {
  width: 100%;
  height: 100%;
  // flex: 1;
}
</style>
