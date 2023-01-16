import { InjectionKey } from 'vue'

import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type State from '@/store/interface'

import preSet from '@/lib/blockly/blocks/preBlock'

import ble from './ble'
import blockly from './blockly'
import type { BleStateType } from './ble'
import type { BlocklyStateType } from './blockly'

import guessNum from '@/lib/preset-game/guess-num.jo'
import piano from '@/lib/preset-game/piano.jo'
import randomLight from '@/lib/preset-game/random.jo'

export const key: InjectionKey<Store<State>> = Symbol('key')

interface ProjectListItem {
  uuid: number,
  name: string,
  createAt: number,
  updateAt: number,
}

export default createStore({
  state: {
    projectList: [] as ProjectListItem[], // 程序列表
    // currentProject: {} as ProjectListItem, // 当前打开的程序
  },
  getters: {
    projectListByFilter (state) {
      return state.projectList.sort((a, b) => {
        return (b.updateAt || 0) - (a.updateAt || 0)
      })
    },
  },
  mutations: {
  },
  actions: {
    async createPresetGame ({ commit, state, dispatch }) { // 创建预设程序
      const ver = localStorage.getItem('version')
      if (!ver) { // todo: 发布版本号
        // 获取预制程序
        await dispatch('createProject', { name: '猜数字', content: guessNum })
        await dispatch('createProject', { name: '弹钢琴', content: piano })
        await dispatch('createProject', { name: '随机数', content: randomLight })
        localStorage.setItem('version', '1')
        return Promise.resolve()
      } else {
        return Promise.resolve()
      }
    },
    getProject ({ commit, state }) {
      state.projectList = JSON.parse(localStorage.getItem('projectList') || '[]')
    },
    async createProject ({ commit, state }, { name, content }) {
      // 确保名称唯一
      const project = {} as any
      project.name = name
      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].name === name) {
          project.name = 'new-' + name
        }
      }
      project.uuid = Date.now()
      project.createAt = Date.now()
      project.updateAt = Date.now()
      state.projectList.splice(0, 0, project)
      localStorage.setItem('projectList', JSON.stringify(state.projectList))

      // 生成初始代码
      localStorage.setItem(`block-${project.uuid}`, content || preSet.runSample)
      setTimeout(() => {
        return Promise.resolve()
      })
    },
    renameProject ({ commit, state }, { name, id }) {
      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].uuid === id) {
          state.projectList[i].name = name
        }
      }
      localStorage.setItem('projectList', JSON.stringify(state.projectList))
    },

    // 保存程序
    updateProject ({ commit, state }, { uuid, content }) {
      localStorage.setItem(`block-${uuid}`, content)
      // 更新对应的update时间
      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].uuid === uuid - 0) {
          state.projectList[i].updateAt = Date.now()
          localStorage.setItem('projectList', JSON.stringify(state.projectList))
          break
        }
      }
    },

    // 游戏玩法说明相关

    deleteProject ({ commit, state }, uuid) {
      localStorage.removeItem(`block-${uuid}`)

      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].uuid === uuid) {
          state.projectList.splice(i, 1)
          localStorage.setItem('projectList', JSON.stringify(state.projectList))
          return
        }
      }
    },
  },
  modules: {
    ble,
    blockly,
  },
})

interface AllStateType extends State {
  ble: BleStateType,
  blockly: BlocklyStateType,
}

export function useStore () {
  return baseUseStore<AllStateType>(key)
}
