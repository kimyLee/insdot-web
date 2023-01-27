
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
            <div style="font-size: 70px;">
              {{ cardNum }}
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
// import Blockly from 'blockly' // todo: 拆解
// import '@/lib/blocks/index'
import { connectJoyo, bleState } from '@/api/joyo-ble/web-ble-server'

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
      lastOID: 0, // -100532225
      cardMap: [
        'NR-R-061',
        'NR-R-062',
        'NR-R-063',
        'NR-R-064',
        'NR-R-065',
        'NR-R-066',
        'NR-R-067',
        'NR-R-068',
        'NR-R-069',
        'NR-R-070',
        'NR-R-071',
        'NR-R-072',
        'NR-R-073',
        'NR-R-074',
        'NR-R-075',
        'NR-R-076',
        'NR-R-077',
        'NR-R-078',
        'NR-R-079',
        'NR-R-080',
        'NR-R-081',
        'NR-R-082',
        'NR-R-083',
        'NR-R-084',
        'NR-R-085',
        'NR-R-086',
        'NR-R-087',
        'NR-R-088',
        'NR-R-089',
        'NR-R-090',
        'NR-R-091',
        'NR-R-092',
        'NR-R-093',
        'NR-R-094',
        'NR-R-095',
        'NR-R-096',
        'NR-R-097',
        'NR-R-098',
        'NR-R-099',
        'NR-R-100',
        'NR-R-101',
        'NR-R-102',
        'NR-R-103',
        'NR-R-104',
        'NR-R-105',
        'NR-R-106',
        'NR-R-107',
        'NR-R-108',
        'NR-R-109',
        'NR-R-110',
        'NR-SR-001',
        'NR-SR-002',
        'NR-SR-003',
        'NR-SR-004',
        'NR-SR-006',
        'NR-SR-059',
        'NR-SR-060',
        'NR-SR-061',
        'NR-SR-062',
        'NR-SR-063',
        'NR-SR-073',
        'NR-SR-074',
        'NR-SR-075',
        'NR-SR-076',
        'NR-SR-077',
        'NR-SR-078',
        'NR-SR-084',
        'NR-SR-085',
        'NR-SR-086',
        'NR-SR-087',
        'NR-SR-088',
        'NR-SR-094',
        'NR-SR-095',
        'NR-SR-096',
        'NR-SR-097',
        'NR-SR-098',
        'NR-SR-099',
        'NR-SR-100',
        'NR-SR-101',
        'NR-SR-102',
        'NR-SR-103',
        'NR-SR-104',
        'NR-SR-105',
        'NR-SR-106',
        'NR-SR-107',
        'NR-SR-108',
        'NR-SSR-085',
        'NR-SSR-086',
        'NR-SSR-087',
        'NR-SSR-088',
        'NR-SSR-089',
        'NR-SSR-090',
        'NR-SSR-091',
        'NR-SSR-092',
        'NR-SSR-093',
        'NR-SSR-094',
        'NR-SSR-095',
        'NR-SSR-096',
        'NR-SSR-097',
        'NR-SSR-098',
        'NR-SSR-099',
        'NR-SSR-100',
        'NR-SSR-101',
        'NR-SSR-102',
        'NR-SSR-103',
        'NR-SSR-104',
        'NR-SSR-105',
        'NR-SSR-106',
        'NR-SSR-107',
        'NR-SSR-108',
        'NR-SSR-109',
        'NR-SSR-110',
        'NR-SSR-111',
        'NR-SSR-112',
        'NR-SSR-113',
        'NR-SSR-114',
        'NR-SSR-115',
        'NR-SSR-116',
        'NR-SSR-117',
        'NR-SSR-118',
        'NR-SSR-119',
        'NR-SSR-120',
        'NR-UR-085',
        'NR-UR-086',
        'NR-UR-087',
        'NR-UR-088',
        'NR-UR-089',
        'NR-UR-090',
        'NR-UR-091',
        'NR-UR-092',
        'NR-UR-093',
        'NR-UR-094',
        'NR-UR-095',
        'NR-UR-096',
        'NR-UR-097',
        'NR-UR-098',
        'NR-UR-099',
        'NR-UR-100',
        'NR-UR-101',
        'NR-UR-102',
        'NR-UR-103',
        'NR-UR-104',
        'NR-AR-049',
        'NR-AR-050',
        'NR-AR-051',
        'NR-AR-052',
        'NR-AR-053',
        'NR-AR-054',
        'NR-AR-055',
        'NR-AR-056',
        'NR-AR-057',
        'NR-AR-058',
        'NR-AR-059',
        'NR-AR-060',
        'NR-SP-061',
        'NR-SP-063',
        'NR-SP-064',
        'NR-SP-065',
        'NR-MR-055',
        'NR-MR-056',
        'NR-MR-057',
        'NR-MR-058',
        'NR-OR-087',
        'NR-OR-088',
        'NR-OR-089',
        'NR-OR-090',
        'NR-OR-091',
        'NR-OR-092',
        'NR-OR-093',
        'NR-OR-094',
        'NR-OR-095',
        'NR-OR-096',
        'NR-OR-097',
        'NR-OR-098',
        'NR-BP-023',
        'NR-BP-024',
        'NR-BP-025',
        'NR-BP-026',
        'NR-BP-027',
        'NR-SLR-04',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-05',
        'NR-SLR-06',
        'NR-SE-007',
        'NR-SE-008',
        'NR-SE-009',
        'NR-SE-010',
        'NR-SE-011',
        'NR-SE-012',
        'NR-HR-161',
        'NR-HR-162',
        'NR-HR-163',
        'NR-HR-164',
        'NR-HR-165',
        'NR-HR-166',
        'NR-HR-167',
        'NR-HR-168',
        'NR-HR-169',
        'NR-HR-170',
        'NR-HR-171',
        'NR-HR-172',
        'NR-HR-173',
        'NR-HR-174',
        'NR-HR-175',
        'NR-HR-176',
        'NR-HR-177',
        'NR-HR-178',
        'NR-HR-179',
        'NR-HR-180',
        'NR-HR-181',
        'NR-HR-182',
        'NR-HR-183',
        'NR-HR-184',
        'NR-HR-185',
        'NR-HR-186',
        'NR-HR-187',
        'NR-HR-188',
        'NR-HR-189',
        'NR-HR-190',
        'NR-HR-191',
        'NR-HR-192',
        'NR-HR-193',
        'NR-HR-194',
        'NR-HR-195',
        'NR-HR-196',
        'NR-HR-197',
        'NR-HR-198',
        'NR-HR-199',
        'NR-HR-200',
        'NR-SP-062',
      ],
      newYearCardMap: [
        'NRSS-UR-006',
        'NRSS-UR-007',
        'NRSS-UR-008',
        'NRSS-UR-009',
        'NRSS-AR-001',
        'NRSS-AR-002',
        'NRSS-AR-003',
        'NRSS-AR-004',
        'NRSS-SP-004',
        'NRSS-SP-005',
        'NRSS-SP-006',
        'NRSS-SP-007',
        'NR-20TH-001',
        'NRSS-SV-G05',
        'NRSS-SV-G06',
        'NRSS-SV-G07',
        'NRSS-SV-G08',
        'NRSS-SV-G09',
        'NRSS-SV-G10',
        'NRSS-SV-S05',
        'NRSS-SV-S06',
        'NRSS-SV-S07',
        'NRSS-SV-S08',
        'NRSS-SV-S09',
        'NRSS-SV-S10',
        'NRSS-SE-001',
        'NRSS-SE-002', // 100532552
        'NRSS-HR-011', // 100532553 - 100532525 = 27
        'NRSS-HR-012',
        'NRSS-HR-013',
        'NRSS-HR-014',
        'NRSS-HR-015',
        'NRSS-HR-016',
        'NRSS-HR-017',
        'NRSS-HR-018',
        'NRSS-HR-019',
        'NRSS-HR-020',

        // 魔道祖师的卡

      ],
      MDCard: [
        'MD-CJ-026',
        'MD-CJ-027',
        'MD-CJ-028',
        'MD-CJ-029',
        'MD-CJ-030',
        'MD-CJ-031',
        'MD-CJ-032',
        'MD-CJ-033',
        'MD-CJ-034',
        'MD-CJ-035',
        'MD-CJ-036',
        'MD-CJ-037',
        'MD-CJ-038',
        'MD-CJ-039',
        'MD-CJ-040',
        'MD-CJ-041',
        'MD-CJ-042',
        'MD-CJ-043',
        'MD-CJ-044',
        'MD-CJ-045',
        'MD-CJ-046',
        'MD-CJ-047',
        'MD-CJ-048',
        'MD-CJ-049',
        'MD-CJ-050',
        'MD-JQ-001',
        'MD-JQ-002',
        'MD-JQ-003',
        'MD-JQ-004',
        'MD-JQ-005',
        'MD-JQ-006',
        'MD-JQ-007',
        'MD-JQ-008',
        'MD-JQ-009',
        'MD-JQ-010',
        'MD-JQ-011',
        'MD-JQ-012',
        'MD-JQ-013',
        'MD-JQ-014',
        'MD-JQ-015',
        'MD-JQ-016',
        'MD-JQ-017',
        'MD-JQ-018',
        'MD-JQ-019',
        'MD-JQ-020',
        'MD-JQ-021',
        'MD-JQ-022',
        'MD-JQ-023',
        'MD-JQ-024',
        'MD-JQ-025',
        'MD-JQ-026',
        'MD-JQ-027',
        'MD-JQ-028',
        'MD-JQ-029',
        'MD-JQ-030',
        'MD-JQ-031',
        'MD-JQ-032',
        'MD-JQ-033',
        'MD-JQ-034',
        'MD-JQ-035',
        'MD-JQ-036',
        'MD-JQ-037',
        'MD-JQ-038',
        'MD-JQ-039',
        'MD-JQ-040',
        'MD-YX-014',
        'MD-YX-015',
        'MD-YX-016',
        'MD-YX-017',
        'MD-YX-018',
        'MD-YX-019',
        'MD-YX-020',
        'MD-YX-021',
        'MD-YX-022',
        'MD-YX-023',
        'MD-YX-024',
        'MD-YX-025',
        'MD-YX-026',
        'MD-Q-001',
        'MD-Q-002',
        'MD-Q-003',
        'MD-Q-004',
        'MD-Q-005',
        'MD-Q-006',
        'MD-Q-007',
        'MD-Q-008',
        'MD-Q-009',
        'MD-Q-010',
        'MD-Q-011',
        'MD-Q-012',
        'MD-Q-013',
        'MD-Q-014',
        'MD-Q-015',
        'MD-Q-016',
        'MD-Q-017',
        'MD-Q-018',
        'MD-Q-019',
        'MD-Q-020',
        'MD-Q-021',
        'MD-Q-022',
        'MD-Q-023',
        'MD-Q-024',
        'MD-FM-014',
        'MD-FM-015',
        'MD-FM-016',
        'MD-FM-017',
        'MD-FM-018',
        'MD-FM-019',
        'MD-FM-020',
        'MD-FM-021',
        'MD-FM-022',
        'MD-FM-023',
        'MD-FM-024',
        'MD-FM-025',
        'MD-CH-013',
        'MD-CH-014',
        'MD-CH-015',
        'MD-CH-016',
        'MD-CH-017',
        'MD-CH-018',
        'MD-CH-019',
        'MD-CH-020',
        'MD-CH-021',
        'MD-CH-022',
        'MD-CH-023',
        'MD-CH-024',
        'MD-PT-005',
        'MD-PT-006',
        'MD-PT-007',
        'MD-PT-008',
        'MD-PT-009',
        'MD-PT-010',
        'MD-PT-011',
        'MD-PT-012',
        'MD-CP-005',
        'MD-CP-006',
        'MD-CP-007',
        'MD-CP-008',
        'MD-MC-001',
        'MD-MC-002',
        'MD-MC-003',
        'MD-MC-004',
        'MD-MC-005',
        'MD-QM-005',
        'MD-QM-006',
        'MD-QM-007',
        'MD-QM-008',
        'MD-PR-005',
        'MD-PR-006',
        'MD-PR-007',
        'MD-PR-008',
        'MD-PR-009',
        'MD-PR-010',
        'MD-PR-011',
        'MD-PR-012',
      ],
    })

    let timer = null as any

    const route = useRoute()
    const attrs = useAttrs()

    const cardNum = computed(() => {
      if (state.lastOID >= 100532225 && state.lastOID <= 100532462) {
        return state.cardMap[state.lastOID - 100532225]
      } else if (state.lastOID >= 100532525 && state.lastOID <= 100532562) {
        return state.newYearCardMap[state.lastOID - 100532525]
      } else if (state.lastOID >= 100532825 && state.lastOID <= 100532979) {
        return state.MDCard[state.lastOID - 100532825]
      } else {
        return 'xx-xx-xx'
      }
    })

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
      // if (num >= 301 && num <= 314) {
      //   return num - 300
      // }
      // return Math.round(num / 10) - 800
      return num
    }

    onUnmounted(() => {
      //
    })

    onMounted(() => {
      // state.lastOID = 100532225
      // setInterval(() => {
      //   state.lastOID = state.lastOID + 1
      // }, 2000);
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
      cardNum,
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
        width: 500px;
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
