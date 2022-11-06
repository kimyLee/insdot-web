<template>
  <div class="project-list page">
    <HeaderNav title="Design tool"
               sub-title="for JOYO Design">
      <a-button key="2">
        创建程序
        <template #icon>
          <PlusOutlined />
        </template>
      </a-button>
      <a-button>
        导入程序
      </a-button>
    </HeaderNav>
    <div class="container">
      <transition-group name="fade"
                        class="list-view"
                        tag="div">
        <!-- todo: 可改名 -->
        <div v-for="v in projectList"
             :key="v.uuid"
             :class="handleItemClass(v)"
             class="item"
             @click.stop="onProjectClick(v)">
          <div class="content">
            <span class="title">
              {{ v.name }}
            </span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  watchEffect,
  watch,
  defineComponent,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  toRefs,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

// import { useStore } from '@/store'
import HeaderNav from '@/components/HeaderNav.vue'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Home',
  components: {
    // DownloadOutlined,
    PlusOutlined,
    HeaderNav,
  },

  setup () {
    // @ts-ignore
    // const { proxy } = getCurrentInstance()
    // const store = useStore()

    const route = useRoute()
    const router = useRouter()

    const state: any = reactive({
      projectList: [
        { uuid: 1, name: '24点', createAt: 1665914070600 },
        { uuid: 2, name: '倒计时', createAt: 1665914071601 },
      ],
    })

    const fetchProjectList = async () => {
      //
    }

    const onProjectClick = (v: { uuid: string }) => {
      router.push(`/blockly?uuid=${v.uuid}`)
    }

    function handleItemClass (v: any) {
      const classList = []
      classList.push('item-color' + ((v.createAt || 0) % 5))
      return classList
    }

    onBeforeMount(async () => {
      // await fetchProjectList(state.tabType)
    })

    onUnmounted(() => {
      //
    })

    onMounted(async () => {
      //
    })

    return {
      router,
      ...toRefs(state),
      fetchProjectList,
      onProjectClick,
      handleItemClass,
    }
  },
})
</script>

<style lang="scss" scoped>
.project-list {
  .container {
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    overflow-y: overlay;
    -webkit-overflow-scrolling: touch;

    .list-view {
      position: relative;
      margin: 0 auto;
      display: flex;

      .item {
        padding: 20px;
        box-sizing: border-box;
        width: 300px;
        height: 200px;
        border-radius: 20px;
        background-color: rgba(125, 125, 125, 0.16);
        box-shadow: 9px 13px 22px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        color: transparent;
        position: relative;
        transition: transform 0.3s ease;
        margin: 0 20px;
        cursor: pointer;
        &:active {
          background-size: 110% 110%;
        }
        // &.item-color0 {
        //   background-color: #e96954;
        // }
        // &.item-color1 {
        //   background-color: #61e1a4;
        // }
        // &.item-color2 {
        //   background-color: #61a4e1;
        // }
        // &.item-color3 {
        //   background-color: #e19e61;
        // }
        // &.item-color4 {
        //   background-color: #c36498;
        // }
        .content {
          .title {
            display: block;
            font-weight: 700;
            font-size: 24px;
            text-align: left;
            color: #666;
          }
        }
      }
    }
    // 删掉了fade-leave-to
    .fade-enter {
      opacity: 0;
    }
    .fade-move {
      transition: all 0.3s ease;
    }
    .fade-enter-active {
      animation: bounce-in 0.3s;
    }
    .fade-leave-active {
      animation: bounce-out 0.3s;
    }

    @keyframes bounce-in {
      0% {
        opacity: 0;
        transform: scale(0.6);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes bounce-out {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.2;
        transform: scale(0.7);
      }
      100% {
        opacity: 0.1;
        transform: scale(0.4);
      }
    }
  }
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  // transition: opacity 0.3s;
}
.icon-fade-enter-active {
  opacity: 0;
  transform: scale(0.4);
}
.icon-fade-enter,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.4);
}
</style>
