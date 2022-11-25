import { createStore } from 'vuex'
interface ProjectListItem {
  uuid: string,
  name: string,
  createAt: number,
  updateAt: number,
}

export default createStore({
  state: {
    projectList: [] as ProjectListItem[], // 程序列表
    currentProject: '', // 当前打开的程序
  },
  mutations: {
  },
  actions: {
    // todo: 结合TS
    createProject ({ commit, state }, project) {
      const projectList = JSON.parse(localStorage.getItem('projectList') || '[]') // 获取项目列表
    },
  },
  modules: {
  },
})
