import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "art" */ '@/views/ProjectList.vue'),
  },
  {
    path: '/mobile',
    name: 'Mobile',
    component: () => import(/* webpackChunkName: "art" */ '@/views/Phone.vue'),
  },
  // {
  //   path: '/no-permit',
  //   name: 'NoPermit',
  //   component: () => import(/* webpackChunkName: "art" */ '@/views/NoPermit.vue'),
  // },
  // {
  //   path: '/project-list',
  //   name: 'ProjectList',
  //   component: () => import(/* webpackChunkName: "art" */ '@/views/ProjectList.vue'),
  // },
  {
    path: '/blockly',
    name: 'Blockly',
    component: () => import(/* webpackChunkName: "art" */ '@/views/Blockly.vue'),
  },
  // {
  //   path: '/blockly',
  //   name: 'Blockly',
  //   component: () => import(/* webpackChunkName: "art" */ '@/views/Blockly.vue'),
  // },
  // todo: 后续删除，临时用途
  // {
  //   path: '/check',
  //   name: 'Check',
  //   component: () => import(/* webpackChunkName: "art" */ '@/views/check.vue'),
  // },
  // {
  //   path: '/js-editor',
  //   name: 'JsEditor',
  //   component: () => import(/* webpackChunkName: "art" */ '@/views/Monaco.vue'),
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

function foo () {
  return 'by' + 111
}

function isPC () {
  if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
    return false // 移动端
  } else {
    return true // PC端
  }
}

router.beforeEach(async (to, from) => {
  if (isPC()) {
    return true
  } else {
    if (to.name !== 'Mobile') {
      return { name: 'Mobile' }
    }
  }
})
// router.beforeEach(async (to, from) => {
//   if (localStorage.getItem('pwd') === btoa('cu' + foo())) {
//     return true
//   } else {
//     if (to.name !== 'NoPermit') {
//       return { name: 'NoPermit' }
//     }
//   }
// })

export default router
