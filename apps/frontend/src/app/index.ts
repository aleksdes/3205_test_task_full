import { createApp } from 'vue'
import App from './App.vue'
import { useFontAwesomeSetup } from './fontawesome-setup'
import { usePiniaSetup } from './pinia-setup'
import { usePrimeVueSetup } from './primevue-setup'
import { useRouterSetup } from './router-setup'
import '@/shared/lib/dayjs'
import '@/shared/ui/theme/styles/tailwind.css'
import '@/shared/ui/theme/styles/index.scss'

export const application = createApp(App)

useRouterSetup(application)
usePrimeVueSetup(application)
usePiniaSetup(application)
useFontAwesomeSetup(application)
