<template>
  <div class="project-list page">
    <HeaderNav title="Design tool"
               sub-title="for JOYO Design">
      <a-button key="2"
                @click.stop="createProjectPop">
        新建程序
        <template #icon>
          <PlusOutlined />
        </template>
      </a-button>
      <a-button>
        导入程序
      </a-button>
      <a-popconfirm title="确定导出所有程序文件到zip吗，此过程较耗时"
                    ok-text="确定"
                    placement="bottomRight"
                    cancel-text="取消"
                    @confirm="exportAllProgram">
        <a-button>
          一键导出
        </a-button>
      </a-popconfirm>
    </HeaderNav>
    <div class="container">
      <div class="warning-tip">
        <a-alert message="请及时导出程序文件保存到本地，当前数据使用浏览器缓存，避免因不稳定因素而丢失程序"
                 show-icon
                 type="warning" />
      </div>

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
            <!-- 更多选择 -->
            <div class="bottom-line"
                 @click.stop>
              <!-- 下载 -->
              <vertical-align-bottom-outlined class="bottom-icon download-icon"
                                              title="下载程序" />
              <!-- 删除 -->
              <a-popconfirm title="确定要删除该程序吗?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleDelete(v.uuid)">
                <span class="bottom-icon del-icon">
                  <delete-outlined title="删除程序" />
                </span>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- 输入新建程序名弹窗 -->
    <a-modal v-model:visible="visibleOfCreateProject"
             :width="360"
             ok-text="确定"
             cancel-text="取消"
             title="创建新程序"
             @ok="handleOk">
      <a-input ref="refCreatePopBox"
               v-model:value="programName"
               placeholder="程序名" />
    </a-modal>
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
  ref,
  nextTick,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

// import { useStore } from '@/store'
import HeaderNav from '@/components/HeaderNav.vue'
import { PlusOutlined, DeleteOutlined, EllipsisOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Home',
  components: {
    // DownloadOutlined,
    // EllipsisOutlined,
    VerticalAlignBottomOutlined,
    PlusOutlined,
    DeleteOutlined,
    HeaderNav,
  },

  setup () {
    // @ts-ignore
    // const { proxy } = getCurrentInstance()
    // const store = useStore()

    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const refCreatePopBox = ref()

    const state: any = reactive({
      programName: '',
      visibleOfCreateProject: false,
      visibleOfExportProject: false,
    })

    const projectList = computed(() => store.state.projectList)

    const fetchProjectList = async () => {
      store.dispatch('getProject')
    }

    // 创建程序
    const createProjectPop = () => {
      state.visibleOfCreateProject = true
      nextTick(() => {
        refCreatePopBox.value.focus()
      })
    }
    const createProject = (name: string) => {
      store.dispatch('createProject', { name })
    }
    const handleOk = () => {
      if (state.programName) {
        const list = projectList.value
        // 检查名字是否重复
        for (let i = list.length; i--;) {
          if (list[i].name === state.programName) {
            message.warning('程序名已存在')
            return
          }
        }
        createProject(state.programName)
        state.programName = ''
        state.visibleOfCreateProject = false
      } else {
        message.warning('程序名不能为空')
      }
    }
    const onProjectClick = (v: { uuid: string }) => {
      router.push(`/blockly?uuid=${v.uuid}`)
    }

    // 导出程序
    function exportAllProgram () {
      console.log('export')
      // state.visibleOfCreateProject = true
    }

    function handleItemClass (v: any) {
      const classList = []
      classList.push('item-color' + ((v.createAt || 0) % 5))
      return classList
    }

    function handleDelete (uuid: number) {
      store.dispatch('deleteProject', uuid)
    }

    onBeforeMount(async () => {
      // await fetchProjectList(state.tabType)
    })

    onUnmounted(() => {
      //
    })

    onMounted(async () => {
      fetchProjectList()
      //
    })

    return {
      router,
      refCreatePopBox,
      ...toRefs(state),
      projectList,

      createProjectPop,
      createProject,
      handleOk,

      handleDelete,

      onProjectClick,

      exportAllProgram,

      handleItemClass,
    }
  },
})
</script>

<style lang="scss">
.pop-menu-item {
  .anticon {
    font-size: 16px !important;
  }
}
</style>
<style lang="scss" scoped>
.project-list {
  .container {
    position: relative;
    // padding: 20px;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    overflow-y: overlay;
    -webkit-overflow-scrolling: touch;

    .list-view {
      position: relative;
      margin: 0 20px;
      display: flex;
      flex-wrap: wrap;

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
        margin: 20px 20px;
        cursor: pointer;
        &:active {
          background-size: 110% 110%;
        }

        .content {
          .title {
            display: block;
            font-weight: 700;
            font-size: 24px;
            text-align: left;
            color: #666;
          }
          .bottom-line {
            position: absolute;
            color: #888;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: right;
            font-size: 24px;
            // padding: 5px 20px;
            box-sizing: border-box;
            .bottom-icon {
              padding-right: 15px;
              padding-bottom: 10px;
            }
            .download-icon {
              &:hover {
                color: #1890ff;
              }
            }
            .del-icon {
              &:hover {
                color: red;
              }
            }
          }
        }
      }
    }

    .warning-tip {
      // position: absolute;
      // top: 0;
      // left: 0;
      text-align: left;
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
