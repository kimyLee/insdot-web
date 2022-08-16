import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "art" */ '@/views/Blockly.vue'),
  },
  // {
  //   path: '/test',
  //   name: 'Home',
  //   component: () => import(/* webpackChunkName: "art" */ '@/views/Home.vue'),
  // },
  {
    path: '/no-permit',
    name: 'NoPermit',
    component: () => import(/* webpackChunkName: "art" */ '@/views/NoPermit.vue'),
  },
  {
    path: '/blockly',
    name: 'Blockly',
    component: () => import(/* webpackChunkName: "art" */ '@/views/Blockly.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

function foo () {
  return 'by' + 111
}

router.beforeEach(async (to, from) => {
  if (localStorage.getItem('pwd') === btoa('cu' + foo())) {
    return true
  } else {
    if (to.name !== 'NoPermit') {
      return { name: 'NoPermit' }
    }
  }
})

export default router
