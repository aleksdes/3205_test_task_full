/// <reference types="@spiriit/vite-plugin-svg-spritemap/dist/client" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />

declare module '*.vue' {
  import type { defineComponent } from 'vue'

  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module '*.svg?use' {
  const src: string // Обычно ?use возвращает URL для вставки в спрайт
  export default src
}
declare module '*.svg?view' {
  const src: string
  export default src
}

interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
