
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
        <span class="title"
              :class="{'active': currentState === 'spy'}"
              style="font-size: 14px;margin-left: 16px;"
              @click="switchCode('spy')">
          spy game
        </span>
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
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="block-box">
      <div id="blocklyDiv" />
      <div class="blockly-info">
        <p>调试信息台：</p>
        <p v-for="(item,index) in varInfo"
           :key="index"
           class="var-info">
          {{ item }}
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
import preDefine, { pureCanvas, runSample } from '@/lib/blocks/preBlock'
import preDefinePuzzle from '@/lib/blocks/preBlockPuzzle'
import testCode from '@/lib/blocks/testCode'
import '@/lib/blocks/index'
import { connectJoyo, bleState } from '@/api/web-ble/web-ble-server'
import BlocklyDoc from '@/components/BlocklyDoc.vue' // @ is an alias to /src
import GameDoc from '@/components/GameDoc.vue' // @ is an alias to /src

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
      OID_change: any;
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
    const preserveVar = ['window', 'self', 'print', 'getDateNow', 'sleepFn', 'blePlayMusic', 'bleSetLight', 'clearAllLight', 'bleSetLightAnimation', 'value', 'OID_change', 'setUp']
    const state = reactive({
      workspace: null,
      connectStatus: false,
      runStatus: false,
      currentState: 'local',
      visible: false,
      gameVisible: false,
      varInfo: [] as string[],
      debugInfo: '',
      sandBoxStepCount: 0,
      sandBoxMaxStep: 2000,
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
            Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(preDefinePuzzle) as any)
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
      return Math.round(num / 10) - 800
    }

    // 暂停运行代码
    const stopRun = () => {
      // runCode
      state.sandBoxStepCount = 0
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

    function nextStep () {
      try {
        if (myInterpreter?.step()) {
          state.sandBoxStepCount++
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
      if (state.runStatus) {
        stopRun()
        return
      }
      state.varInfo = []
      state.debugInfo = ''
      // clearInterval(timer)
      // timer = setInterval(() => { // 定时防止休眠
      //   bleSetSingleLight(11, 0x000000)
      // }, 20000)
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
        // code = code + '\n print(a.b.c)' // test error
        console.log(code)
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

    onUnmounted(() => {
      //
    })

    onMounted(() => {
      (Blockly as any).setLocale(Zh);
      (Blockly as any).setLocale(CustomZh)
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
        // theme: {
        //   FIELD_COLOUR_FULL_BLOCK: false,
        //   startHats: true,
        //   colourPrimary: '#4a148c',
        //   colourSecondary: '#AD7BE9',
        //   colourTertiary: '#CDB6E9',
        // },
      } as any)

      Blockly.JavaScript.addReservedWords('code') // 获取js代码

      Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(runSample) as any)

      // <xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="3M(I7I.CjqF~v%Y)w|kA">curOIDVal</variable><variable id="sXCY/+MxMdH?07[tOd^V">answer</variable><variable id="]|IsB:02;4hvk!fc{NYT">word</variable><variable id="60wvtq~HkfMT}_qDr|L5">val</variable><variable id="U|G,nKyM-XG.,u;Xa1UB">wordArr</variable><variable id="@+E[;UI]+F0KR]y$BO{l">wordSet</variable></variables><block type="variables_set" id="h7p:/;,c+qzH-a87**L-" x="77" y="47"><field name="VAR" id="3M(I7I.CjqF~v%Y)w|kA">curOIDVal</field><value name="VALUE"><block type="math_number" id="7`Tkl)|2]+vfnngi*rg@"><field name="NUM">0</field></block></value><next><block type="variables_set" id="jr$Iea!V)1!)U*L+fm1$"><field name="VAR" id="sXCY/+MxMdH?07[tOd^V">answer</field><value name="VALUE"><block type="text" id="=@jug))(48x7c62J/,Y,"><field name="TEXT"></field></block></value><next><block type="variables_set" id="h#}%s/P8!!k_g2J:yGLf"><field name="VAR" id="]|IsB:02;4hvk!fc{NYT">word</field><value name="VALUE"><block type="text" id="avf^rDFLKjk5EN0o31+N"><field name="TEXT"></field></block></value><next><block type="variables_set" id="U1UqV!oA{Aq_DjF%HL78"><field name="VAR" id="U|G,nKyM-XG.,u;Xa1UB">wordArr</field><value name="VALUE"><block type="text" id="%|,*[x-!776L5b^288Fn"><field name="TEXT">abcdefghijklmnopqrstuvwxyz</field></block></value><next><block type="variables_set" id="sjtV#%0~/io*bSrA,Y)W"><field name="VAR" id="@+E[;UI]+F0KR]y$BO{l">wordSet</field><value name="VALUE"><block type="lists_create_with" id=",Lc1u8-(iQRCD#|xkgI#"><mutation items="3"></mutation><value name="ADD0"><block type="text" id="$SOPip}QB]gj~t@~$AdR"><field name="TEXT">about</field></block></value><value name="ADD1"><block type="text" id="+Yuss|+5KDiIQ.h4E_=+"><field name="TEXT">coast</field></block></value><value name="ADD2"><block type="text" id="}7cV?PHb(80CcnVuYZ;I"><field name="TEXT">group</field></block></value></block></value></block></next></block></next></block></next></block></next></block><block type="procedures_defnoreturn" id="R:Xk[Q}P_1nS]UyxUefO" x="73" y="422"><field name="NAME">initGame</field><comment pinned="false" h="80" w="160">Describe this function...</comment><statement name="STACK"><block type="ble_set_audio" id="y.XIAg{s58wsR8.[udtk"><value name="TEXT"><block type="text" id="ND;_dk+1_$AH#[`nDd2:"><field name="TEXT">gbeg</field></block></value><next><block type="variables_set" id="{q1U[l4.p5FH[!I+@Dhh"><field name="VAR" id="sXCY/+MxMdH?07[tOd^V">answer</field><value name="VALUE"><block type="lists_getIndex" id="-OD2TN3*|db#[ubQ1/Ud"><mutation statement="false" at="false"></mutation><field name="MODE">GET</field><field name="WHERE">RANDOM</field><value name="VALUE"><block type="variables_get" id="h@k`j(a;r7n`l#~g;1mu"><field name="VAR" id="@+E[;UI]+F0KR]y$BO{l">wordSet</field></block></value></block></value><next><block type="ble_set_light" id=";R;M;3Y-[.M*}!2h_kA0"><value name="list"><block type="lists_repeat" id="6/g1g.AT_?Y:Iv9DRvK:"><value name="ITEM"><block type="math_number" id="+q((P,#6OJ+M(]`9y}]H"><field name="NUM">0</field></block></value><value name="NUM"><block type="math_number" id="dvnxDqoLM[f1Su5`7A@P"><field name="NUM">12</field></block></value></block></value></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="[Z;ax:MWA}Qnx:Y7tsQo" x="74" y="670"><field name="NAME">oidChange</field><comment pinned="false" h="80" w="160">Describe this function...</comment><statement name="STACK"><block type="controls_if" id="x(0]YN/w[~oxfi/@)1,?"><value name="IF0"><block type="logic_compare" id="-5.$ylT]l{+:v(bl!8oU"><field name="OP">EQ</field><value name="A"><block type="variables_get" id="~.1G6ZPh1!44-2dh@rCx"><field name="VAR" id="60wvtq~HkfMT}_qDr|L5">val</field></block></value><value name="B"><block type="math_number" id="I#lmxjtT*;lyMZ#)PT~#"><field name="NUM">126</field></block></value></block></value><statement name="DO0"><block type="procedures_callnoreturn" id="TF*sER]puiCA:_YSVGSv"><mutation name="initGame"></mutation></block></statement><next><block type="lists_setIndex" id="2l+7(-?*|yYxS|R8kTue"><mutation at="true"></mutation><field name="MODE">SET</field><field name="WHERE">FROM_START</field><value name="LIST"><block type="variables_get" id=":G2c/e(*1]#y4!qj$ZiV"><field name="VAR" id="]|IsB:02;4hvk!fc{NYT">word</field></block></value><value name="AT"><block type="variables_get" id="UXw@U37WVXU?ETL+eZ+L"><field name="VAR" id="60wvtq~HkfMT}_qDr|L5">val</field></block></value><value name="TO"><block type="lists_getIndex" id="7N*uUjbC)U,$86LqY!=7"><mutation statement="false" at="true"></mutation><field name="MODE">GET</field><field name="WHERE">FROM_START</field><value name="VALUE"><block type="variables_get" id="+o.F|6=F1!wK{$sy^A0X"><field name="VAR" id="U|G,nKyM-XG.,u;Xa1UB">wordArr</field></block></value><value name="AT"><block type="variables_get" id="e9)X(r^;vp3][93.X2r2"><field name="VAR" id="60wvtq~HkfMT}_qDr|L5">val</field></block></value></block></value></block></next></block></statement></block><block type="procedures_defnoreturn" id="5p}1/mBBAz`VZW=I42?I" x="593" y="660"><field name="NAME">checkAnswer</field><comment pinned="false" h="80" w="160">Describe this function...</comment></block></xml>

      // 获取js代码
      // Blockly.JavaScript.workspaceToCode(workspace);

      // get xml
      // Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))

      // load xml
      // Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(xml));

      window.Blockly = Blockly
      window.workspace = workspace;

      (window as any).handleNotifyEvent = (msg: number[]) => {
        if (msg.length === 11 && msg[2] === 0x05 && msg[3] === 0xB1 && msg[4] === 0x04) {
          if (myInterpreter && myInterpreter.appendCode) {
            const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
            console.log('appendCode', val)
            // 限定 1 到 54
            if (val > 0 && val < 55) {
              myInterpreter.appendCode(`OID_change(${val})`)
              myInterpreter.run()
              // 获取状态更新
              const obj = myInterpreter.globalObject.properties
              const vars = getVariables(Object.keys(obj), obj)
              state.varInfo = vars.map(e => {
                if (typeof obj[e] === 'object') {
                  return e + ':' + JSON.stringify(obj[e]?.properties)
                } else {
                  return e + ':' + obj[e] ?? '--'
                }
              })
            }
          }

          // window.OID_change && window.OID_change(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
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
