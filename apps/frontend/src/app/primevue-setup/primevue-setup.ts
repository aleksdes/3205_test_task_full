import type { App } from 'vue'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { ConfirmationService, DialogService, ToastService } from 'primevue'
import PrimeVue from 'primevue/config'
import KeyFilter from 'primevue/keyfilter'
import Tooltip from 'primevue/tooltip'
import { ru } from './locales/ru'
import 'primeicons/primeicons.css'

export function usePrimeVueSetup(app: App) {
  app.use(DialogService)
  app.use(ToastService)
  app.use(ConfirmationService)
  app.use(PrimeVue, {
    locale: ru,
    theme: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      preset: definePreset(Aura, {
        semantic: {
          primary: {
            50: '{yellow.50}',
            100: '{yellow.100}',
            200: '{yellow.200}',
            300: '{yellow.300}',
            400: '{yellow.400}',
            500: '{yellow.500}',
            600: '{yellow.600}',
            700: '{yellow.700}',
            800: '{yellow.800}',
            900: '{yellow.900}',
            950: '{yellow.950}',
          },
        },
      }),
      options: {
        darkModeSelector: '.app-dark',
      },
    },
  })
  app.directive('tooltip', Tooltip)
  app.directive('keyfilter', KeyFilter)
}
