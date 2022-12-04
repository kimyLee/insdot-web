import { createStore } from 'vuex'
interface ProjectListItem {
  uuid: number,
  name: string,
  createAt: number,
  updateAt: number,
}

function repeatFileRename () { // 重复文件
  //
}

export default createStore({
  state: {
    projectList: [] as ProjectListItem[], // 程序列表
    currentProject: {} as ProjectListItem, // 当前打开的程序
  },
  mutations: {
  },
  actions: {
    // todo: 结合TS
    createProject ({ commit, state }, project) {
      // 确保名称唯一
      // let maxUuid = 0
      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].name === project.name) {
          const version = project.name
          project.name = ''
        }
      }
      project.uuid = Date.now()
      project.createAt = Date.now()
      state.projectList.splice(0, 0, project)
      localStorage.setItem('projectList', JSON.stringify(state.projectList))
    },

    deleteProject ({ commit, state }, uuid) {
      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].uuid === uuid) {
          state.projectList.splice(i, 1)
          localStorage.setItem('projectList', JSON.stringify(state.projectList))
          return
        }
      }
    },
    getProject ({ commit, state }) {
      state.projectList = JSON.parse(localStorage.getItem('projectList') || '[]')
    },

    updateProject ({ commit, state }, project) { // 更新当前项目所有内容
      for (let i = state.projectList.length; i--;) {
        if (state.projectList[i].uuid === project.uuid) {
          project.updateAt = Date.now()
          state.projectList[i] = project
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
