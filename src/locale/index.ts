
// @ts-ignore
import EventEmitter from 'events'

import { setLocale as blocklySetLocale } from 'blockly/core'
import BlocklyZh from '@/lib/blockly/i18n/zh'
import BlocklyEn from '@/lib/blockly/i18n/en'

import { createI18n } from 'vue-i18n'
// import vueEn from '@/i18n/en'
// import vueZh from '@/i18n/zh'
import { zh as vueZh, en as vueEn } from '@/i18n/index'

export enum LocaleEnum {
  'ZH' = 'ZH',
  'EN' = 'EN'
}

export const defaultLang = localStorage.getItem('lang')?.toUpperCase() || LocaleEnum.EN

export const blocklyMsgs = {
  [LocaleEnum.EN]: BlocklyEn,
  [LocaleEnum.ZH]: BlocklyZh,
}

export const vueMsgs = {
  [LocaleEnum.EN]: vueEn,
  [LocaleEnum.ZH]: vueZh,
}

export const vueI18n = createI18n({
  // locale: 'en', // set locale
  legacy: false,
  fallbackLocale: LocaleEnum.EN, // set fallback locale
  messages: vueMsgs, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})

export const locale = (function () {
  const _public: any = {}
  const _private: any = {
    locale: LocaleEnum.EN,
    event: new EventEmitter(),
  }

  _public.setLocale = function (locale: LocaleEnum) {
    _private.locale = locale

    // 更新 blockly Msg
    blocklySetLocale(blocklyMsgs[locale])

    // 更新 vue i18n
    vueI18n.global.locale.value = locale

    // 写进 localStorage
    localStorage.setItem('lang', locale)

    try {
      const html = document.getElementsByTagName('html')[0]
      html.setAttribute('lang', locale)
      localStorage.setItem('lang', locale)
    } catch (error) {
    }

    _private.event.emit('change')
  }

  _public.getLocale = function () {
    return _private.locale
  }

  _public.$on = function (name: string, func: () => void) {
    _private.event.on(name, func)
    return _public
  }

  _public.$off = function (name: string, func: () => void) {
    if (func) {
      _private.event.removeListener(name, func)
    } else {
      _private.event.removeAllListeners(name)
    }
    return _public
  }

  _public.init = function (locale = defaultLang) {
    _public.setLocale(locale)
  }

  return _public
})()

// @ts-ignore
window.locale = locale
