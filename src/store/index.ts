import { InjectionKey } from 'vue'

import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type State from '@/store/interface'

import { runSample } from '@/lib/blockly/blocks/preBlock'

import ble from './ble'
import type { BleStateType } from './ble'

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
    getProject ({ commit, state }) {
      state.projectList = JSON.parse(localStorage.getItem('projectList') || '[]')
    },
    // getProjectByUuid ({ commit, state }) {
    //   state.projectList = JSON.parse(localStorage.getItem('projectList') || '[]')
    // },
    // todo: 结合TS优化store
    createProject ({ commit, state }, { name, content }) {
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
      localStorage.setItem(`block-${project.uuid}`, content || runSample)
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
  },
})

interface AllStateType extends State {
  ble: BleStateType,
}

export function useStore () {
  return baseUseStore<AllStateType>(key)
}
