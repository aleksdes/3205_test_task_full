import i18next from 'i18next'
import { z } from 'zod'
import { makeZodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/ru/zod.json'
import { ru } from './custom-messages/ru'

/**
 * Настройка локализации сообщений об ошибках
 */
i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      zod: translation,
      custom: ru,
    },
  },
})
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }))

export { z }
