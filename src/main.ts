import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/style/common.scss'

import NoSleep from 'nosleep.js'

const noSleep = new NoSleep()
document.addEventListener('click', function enableNoSleep () {
  document.removeEventListener('click', enableNoSleep, false)
  noSleep.enable()
}, false)

createApp(App).use(store).use(router).use(Antd).mount('#app')
