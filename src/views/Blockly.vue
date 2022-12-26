
<template>
  <div class="blockly-editor page">
    <HeaderNav title="Design tool"
               sub-title="for JOYO Design"
               @back="navigatorBack">
      <a-button @click="handleLangClick">
        {{ lang === 'zh' ? '中/En': 'En/中' }}
      </a-button>

      <a-button @click="toggleVariableDrawerVisible">
        变量
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
import Blockly from 'blockly' // todo: 拆解
import basicCategories from '@/lib/blockly/toolbox'
import preDefine, { pureCanvas, runSample } from '@/lib/blocks/preBlock'
import '@/lib/blocks/index'
import { connectJoyo, bleState } from '@/api/web-ble/web-ble-server'

import HeaderNav from '@/components/HeaderNav.vue'

import VariableDrawer from '@/components/VariableDrawer.vue'

import * as Zh from 'blockly/msg/zh-hans'
import * as En from 'blockly/msg/en'

import '@/style/blockly-category.scss'

import { setLocale } from '@/lib/i18n'
import { useStore } from 'vuex'

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
      // lastOID: any;
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
    HeaderNav,
    VariableDrawer,
  },

  setup () {
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    let myInterpreter: any = markRaw({})
    const preserveVar = ['window', 'self', 'print', 'getDateNow', 'sleepFn', 'blePlayMusic', 'bleSetLight', 'clearAllLight', 'bleSetLightAnimation', 'value', 'When_JOYO_Read', 'setUp']
    const state = reactive({
      lang: 'en',
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
      Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(pureCanvas || '') as any)
    }
    const toggleVariableDrawerVisible = () => {
      state.variableDrawerVisible = !state.variableDrawerVisible
    }
    const saveCode = () => {
      // 保存代码
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
      const uuid = (route.query?.uuid as string) || 'temp'
      // localStorage.setItem(`block-${uuid}`, xml)
      // 更新
      store.dispatch('updateProject', { uuid, content: xml })

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
        let code = Blockly.JavaScript.workspaceToCode(workspace) as string

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
      Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(content) as any)
    }

    // 重新绘制当前页面，切换多语言时候使用
    function reRenderCanvas () {
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
      workspace.clear()
      Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(xml || '') as any)
    }

    // 更改blockly语言
    function toggleLang (lang: string) {
      if (lang === 'zh') {
        setLocale(lang);
        (Blockly as any).setLocale(Zh);
        (Blockly as any).setLocale(CustomZh)
      } else {
        setLocale(lang);
        (Blockly as any).setLocale(En)
      }
      state.lang = lang
      localStorage.setItem('lang', lang)
    }

    // 切换语言事件
    function handleLangClick () {
      toggleLang(state.lang === 'zh' ? 'en' : 'zh')
      reRenderCanvas()
    }

    // 路由守卫
    onBeforeRouteLeave((to, from) => {
      const uuid = route.query?.uuid as string
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
      if (uuid) {
        const content = localStorage.getItem(`block-${uuid}`)
        if (content !== xml) {
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
      // 切换语言
      toggleLang(localStorage.getItem('lang') || 'en')

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

      // 获取当前ID的程序
      // 获取当前游戏内容
      getContentByUUID(route.query?.uuid as string)
      store.dispatch('getProject') // 获取所有文件

      // <xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="3M(I7I.CjqF~v%Y)w|kA">curOIDVal</variable><variable id="sXCY/+MxMdH?07[tOd^V">answer</variable><variable id="]|IsB:02;4hvk!fc{NYT">word</variable><variable id="60wvtq~HkfMT}_qDr|L5">val</variable><variable id="U|G,nKyM-XG.,u;Xa1UB">wordArr</variable><variable id="@+E[;UI]+F0KR]y$BO{l">wordSet</variable></variables><block type="variables_set" id="h7p:/;,c+qzH-a87**L-" x="77" y="47"><field name="VAR" id="3M(I7I.CjqF~v%Y)w|kA">curOIDVal</field><value name="VALUE"><block type="math_number" id="7`Tkl)|2]+vfnngi*rg@"><field name="NUM">0</field></block></value><next><block type="variables_set" id="jr$Iea!V)1!)U*L+fm1$"><field name="VAR" id="sXCY/+MxMdH?07[tOd^V">answer</field><value name="VALUE"><block type="text" id="=@jug))(48x7c62J/,Y,"><field name="TEXT"></field></block></value><next><block type="variables_set" id="h#}%s/P8!!k_g2J:yGLf"><field name="VAR" id="]|IsB:02;4hvk!fc{NYT">word</field><value name="VALUE"><block type="text" id="avf^rDFLKjk5EN0o31+N"><field name="TEXT"></field></block></value><next><block type="variables_set" id="U1UqV!oA{Aq_DjF%HL78"><field name="VAR" id="U|G,nKyM-XG.,u;Xa1UB">wordArr</field><value name="VALUE"><block type="text" id="%|,*[x-!776L5b^288Fn"><field name="TEXT">abcdefghijklmnopqrstuvwxyz</field></block></value><next><block type="variables_set" id="sjtV#%0~/io*bSrA,Y)W"><field name="VAR" id="@+E[;UI]+F0KR]y$BO{l">wordSet</field><value name="VALUE"><block type="lists_create_with" id=",Lc1u8-(iQRCD#|xkgI#"><mutation items="3"></mutation><value name="ADD0"><block type="text" id="$SOPip}QB]gj~t@~$AdR"><field name="TEXT">about</field></block></value><value name="ADD1"><block type="text" id="+Yuss|+5KDiIQ.h4E_=+"><field name="TEXT">coast</field></block></value><value name="ADD2"><block type="text" id="}7cV?PHb(80CcnVuYZ;I"><field name="TEXT">group</field></block></value></block></value></block></next></block></next></block></next></block></next></block><block type="procedures_defnoreturn" id="R:Xk[Q}P_1nS]UyxUefO" x="73" y="422"><field name="NAME">initGame</field><comment pinned="false" h="80" w="160">Describe this function...</comment><statement name="STACK"><block type="ble_set_audio" id="y.XIAg{s58wsR8.[udtk"><value name="TEXT"><block type="text" id="ND;_dk+1_$AH#[`nDd2:"><field name="TEXT">gbeg</field></block></value><next><block type="variables_set" id="{q1U[l4.p5FH[!I+@Dhh"><field name="VAR" id="sXCY/+MxMdH?07[tOd^V">answer</field><value name="VALUE"><block type="lists_getIndex" id="-OD2TN3*|db#[ubQ1/Ud"><mutation statement="false" at="false"></mutation><field name="MODE">GET</field><field name="WHERE">RANDOM</field><value name="VALUE"><block type="variables_get" id="h@k`j(a;r7n`l#~g;1mu"><field name="VAR" id="@+E[;UI]+F0KR]y$BO{l">wordSet</field></block></value></block></value><next><block type="ble_set_light" id=";R;M;3Y-[.M*}!2h_kA0"><value name="list"><block type="lists_repeat" id="6/g1g.AT_?Y:Iv9DRvK:"><value name="ITEM"><block type="math_number" id="+q((P,#6OJ+M(]`9y}]H"><field name="NUM">0</field></block></value><value name="NUM"><block type="math_number" id="dvnxDqoLM[f1Su5`7A@P"><field name="NUM">12</field></block></value></block></value></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="[Z;ax:MWA}Qnx:Y7tsQo" x="74" y="670"><field name="NAME">oidChange</field><comment pinned="false" h="80" w="160">Describe this function...</comment><statement name="STACK"><block type="controls_if" id="x(0]YN/w[~oxfi/@)1,?"><value name="IF0"><block type="logic_compare" id="-5.$ylT]l{+:v(bl!8oU"><field name="OP">EQ</field><value name="A"><block type="variables_get" id="~.1G6ZPh1!44-2dh@rCx"><field name="VAR" id="60wvtq~HkfMT}_qDr|L5">val</field></block></value><value name="B"><block type="math_number" id="I#lmxjtT*;lyMZ#)PT~#"><field name="NUM">126</field></block></value></block></value><statement name="DO0"><block type="procedures_callnoreturn" id="TF*sER]puiCA:_YSVGSv"><mutation name="initGame"></mutation></block></statement><next><block type="lists_setIndex" id="2l+7(-?*|yYxS|R8kTue"><mutation at="true"></mutation><field name="MODE">SET</field><field name="WHERE">FROM_START</field><value name="LIST"><block type="variables_get" id=":G2c/e(*1]#y4!qj$ZiV"><field name="VAR" id="]|IsB:02;4hvk!fc{NYT">word</field></block></value><value name="AT"><block type="variables_get" id="UXw@U37WVXU?ETL+eZ+L"><field name="VAR" id="60wvtq~HkfMT}_qDr|L5">val</field></block></value><value name="TO"><block type="lists_getIndex" id="7N*uUjbC)U,$86LqY!=7"><mutation statement="false" at="true"></mutation><field name="MODE">GET</field><field name="WHERE">FROM_START</field><value name="VALUE"><block type="variables_get" id="+o.F|6=F1!wK{$sy^A0X"><field name="VAR" id="U|G,nKyM-XG.,u;Xa1UB">wordArr</field></block></value><value name="AT"><block type="variables_get" id="e9)X(r^;vp3][93.X2r2"><field name="VAR" id="60wvtq~HkfMT}_qDr|L5">val</field></block></value></block></value></block></next></block></statement></block><block type="procedures_defnoreturn" id="5p}1/mBBAz`VZW=I42?I" x="593" y="660"><field name="NAME">checkAnswer</field><comment pinned="false" h="80" w="160">Describe this function...</comment></block></xml>

      // 获取js代码
      // Blockly.JavaScript.workspaceToCode(workspace);

      // get xml
      // Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))

      // load xml
      // Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(xml));
      // state.OIDstatus = JSON.parse(localStorage.getItem('OIDstatus') || '[]')
      window.Blockly = Blockly
      window.workspace = workspace;

      (window as any).handleNotifyEvent = (msg: number[]) => {
        if (msg.length === 11 && msg[2] === 0x05 && msg[3] === 0xB1 && msg[4] === 0x04) {
          const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
          state.lastOID = val
          if (myInterpreter && myInterpreter.appendCode) {
            const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
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
      handleLangClick,
      runCode,
      generateCode,
      saveCode,
      clearCanvas,
      connect,
      loadCode,
      navigatorBack,
      toggleVariableDrawerVisible,
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
      // .info-content {
      //   color: #000000d9;
      //   font-weight: 400;
      //   font-size: 14px;
      // }
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
