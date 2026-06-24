import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas, far)

export function useFontAwesomeSetup(app: App) {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
}
