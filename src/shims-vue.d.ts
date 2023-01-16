/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.xml' {
  const content: string;
  export default content;
}

declare module '*.jo' {
  const content: string;
  export default content;
}