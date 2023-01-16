import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/style/common.scss'

import NoSleep from 'nosleep.js' // 连接蓝牙时候，电脑可能休眠导致断连
import { vueI18n, locale } from './locale'

let lang = navigator.language // 常规浏览器语言
lang = (lang.slice(0, 2) === 'zh') ? 'ZH' : 'EN'

locale.init(localStorage.getItem('lang')?.toUpperCase() || lang)

const noSleep = new NoSleep()
document.addEventListener('click', function enableNoSleep () {
  document.removeEventListener('click', enableNoSleep, false)
  noSleep.enable()
}, false)

const app = createApp(App).use(store).use(router).use(Antd)

app.use(vueI18n)

app.mount('#app')
