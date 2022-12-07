import { createStore } from 'vuex'

import { reNameRepeatFile } from '@/lib/project/common'

import { runSample } from '@/lib/blocks/preBlock'

interface ProjectListItem {
  uuid: number,
  name: string,
  createAt: number,
  updateAt: number,
}

export default createStore({
  state: {
    projectList: [] as ProjectListItem[], // 程序列表
    currentProject: {} as ProjectListItem, // 当前打开的程序
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
      // let maxUuid = 0
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

    updateCurrentProject ({ commit, state }, uuid) { // 更新当前的查看项目
      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].uuid === uuid) {
          state.currentProject = state.projectList[i]
        }
      }
    },
  },
  modules: {
  },
})
