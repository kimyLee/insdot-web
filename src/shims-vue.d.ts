/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'blockly/msg/zh-hans'
declare module 'blockly/msg/en'

declare module '*.xml' {
  const content: string;
  export default content;
}