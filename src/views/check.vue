
<template>
  <div class="check-page page">
    <HeaderNav title="码点测试工具"
               sub-title="获取码点值"
               @back="navigatorBack">
      <a-button type="primary"
                @click="connect">
        {{ connectStatus ? '已连接' : '连接' }}
      </a-button>
    </HeaderNav>
    <div class="block-box container">
      <!-- <div id="blocklyDiv" /> -->
      <div class="blockly-info">
        <p>识别到码点</p>
        <!-- 基础信息 -->
        <div class="info-card">
          <div class="info-box">
            <div v-show="connectStatus">
              <span class="connected" />已连接
            </div>
            <div v-show="!connectStatus">
              <span class="connected offline" />未连接
            </div>
            <div style="font-size: 70px;">
              {{ lastOID }}
            </div>
            <!-- <a-form-item label="连接状态">
              <div v-show="connectStatus">
                <span class="connected" />已连接
              </div>
              <div v-show="!connectStatus">
                <span class="connected offline" />未连接
              </div>
            </a-form-item> -->
            <!-- <a-form-item label="识别码值">
              {{ lastOID }}
            </a-form-item> -->
          </div>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { bleSetSingleLight } from '@/api/joyo-ble/index'

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
  useAttrs,
} from 'vue'
import Blockly from 'blockly' // todo: 拆解
import '@/lib/blocks/index'
import { connectJoyo, bleState } from '@/api/web-ble/web-ble-server'

import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'

import '@/style/blockly-category.scss'

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
  },

  setup () {
    // @ts-ignore
    const { proxy } = getCurrentInstance()
    const state = reactive({
      connectStatus: false,
      lastOID: 0,
    })

    let timer = null as any

    const route = useRoute()
    const attrs = useAttrs()

    watch(() => bleState.connectStatus, (val) => {
      state.connectStatus = val
      // if (!val) {
      //   debugLog('断开连接！', 'system')
      // } else {
      //   debugLog('Joyo已连接', 'system')
      // }
    })

    const navigatorBack = () => {
      router.push({ name: 'Home' })
    }

    const connect = () => {
      heartBeat()
      connectJoyo()
    }

    function heartBeat () {
      clearInterval(timer)
      timer = setInterval(() => { // 定时防止休眠
        console.log('beat')
        bleSetSingleLight(11, 0x000000)
      }, 20000)
    }

    const handleOIDVal = (num: number) => { // 预先处理下OID码, 将8010 ···值映射到 1···
      console.log('origin', num)
      if (num >= 301 && num <= 314) {
        return num - 300
      }
      // return Math.round(num / 10) - 800
      return num
    }

    onUnmounted(() => {
      //
    })

    onMounted(() => {
      // 获取当前游戏内容
      (window as any).handleNotifyEvent = (msg: number[]) => {
        if (msg.length === 11 && msg[2] === 0x05 && msg[3] === 0xB1 && msg[4] === 0x04) {
          const val = handleOIDVal(msg[10] * 256 * 256 * 256 + msg[9] * 256 * 256 + msg[8] * 256 + msg[7])
          state.lastOID = val
        }
      }
    })

    return {
      // testColorCode,
      ...toRefs(state),
      connect,
      navigatorBack,
    }
  },
})
</script>

<style lang="scss" scoped>
.check-page::v-deep {
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
    text-align: center;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
    height: calc(100vh - 80px);
    font-size: 34px;

    width: 100%;
    color: #444;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    border-left: 1px solid #ccc;

    // 连接点
    .info-card::v-deep {
      display: flex;
      justify-content: center;

      .info-box {
        width: 300px;
      }
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
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: inline-block;
      background: #02ebae;
      margin-right: 20px;
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
