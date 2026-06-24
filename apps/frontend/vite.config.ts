import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import version from 'vite-plugin-package-version'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Rolldown (Vite 8): `rollupOptions.output.manualChunks` игнорируется при дефолтном `codeSplitting`.
 * @see https://rolldown.rs/in-depth/manual-code-splitting
 */
const vendorCodeSplittingGroups = [
  { name: 'highcharts', test: /node_modules[\\/]highcharts/, priority: 50, maxSize: 450_000 },
  { name: 'vueuse', test: /node_modules[\\/]@vueuse/, priority: 40 },
  { name: 'vue-runtime', test: /node_modules[\\/](vue[\\/]|vue-router[\\/]|pinia[\\/])/, priority: 42 },
  { name: 'axios', test: /node_modules[\\/](axios-retry|axios)[\\/]/, priority: 30 },
  { name: 'lodash', test: /node_modules[\\/]lodash-es/, priority: 30 },
  { name: 'dayjs', test: /node_modules[\\/]dayjs/, priority: 30 },
  { name: 'zod', test: /node_modules[\\/]zod/, priority: 30 },
  { name: 'vee-validate', test: /node_modules[\\/](vee-validate|@vee-validate)/, priority: 30 },
  { name: 'i18n', test: /node_modules[\\/](i18next|zod-i18n-map)/, priority: 30 },
  { name: 'lucide', test: /node_modules[\\/]@lucide[\\/]vue/, priority: 30 },
  { name: 'vendor', test: /node_modules/, priority: 1 },
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = loadEnv(mode, process.cwd())

  return {

    resolve: {
      alias: {
        '@/': '/src/',
        '~/': '/src/',
      },
    },

    base: '/',
    assetsInclude: ['**/*.otf'],

    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [fileURLToPath(new URL('./src', import.meta.url))],
          additionalData: `@use "shared/ui/theme/styles/abstracts" as *;\n`,
        },
        sass: {
          loadPaths: [fileURLToPath(new URL('./src', import.meta.url))],
          additionalData: `@use "shared/ui/theme/styles/abstracts" as *\n`,
        },
      },
    },

    plugins: [
      // Docs https://github.com/smnhgn/vite-plugin-package-version
      version(),

      vue(),

      tailwindcss(),

      // Docs https://github.com/SpiriitLabs/vite-plugin-svg-spritemap
      VitePluginSvgSpritemap(
        './src/**/*.svg',
      ),

      VitePWA({
        manifest: {
          name: 'Test Task',
          short_name: 'BK WFM',
          description: 'vite-project',
          theme_color: '#5F5980',
        },
        devOptions: {
          enabled: process.env.VITE_DEBUG_SW_FEATURE === 'true',
        },

        // Добавьте стратегию регистрации SW
        // 'autoUpdate' (по умолчанию) - SW автоматически проверяет обновления и применяет их
        // 'prompt' - показывает диалог пользователю с предложением обновиться
        // undefined - полностью ручное управление обновлениями
        registerType: 'prompt',

        // Отключаем injectManifest для предотвращения конфликтов
        injectManifest: {
          injectionPoint: undefined,
        },

        // Используйте правильную стратегию обновлений
        strategies: 'generateSW', // 'injectManifest' или 'generateSW' в зависимости от ваших нужд

        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,otf}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 ** 2,

          // Ключевые настройки для предотвращения конфликтов
          // включаем skipWaiting, но контролируем через код
          skipWaiting: false, // Позволяет новому SW активироваться
          clientsClaim: false, // Позволяет новому SW сразу контролировать клиентов

          // Очистка старого кэша
          cleanupOutdatedCaches: true,

          // Настройки для предотвращения конфликтов
          navigateFallback: null,
          navigationPreload: false,
          // Предотвращаем кэширование самого SW
          // Предотвращаем кэширование динамического контента

          // Добавляем более агрессивные настройки для предотвращения конфликтов
          dontCacheBustURLsMatching: /^\/assets\/.*/,

          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 дней
                },
              },
            },
            // Добавляем кэширование для основного приложения
            {
              urlPattern: /\.html$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                networkTimeoutSeconds: 10,
              },
            },
          ],
        },
        // Добавляем метаданные для лучшего контроля версий
        // manifestFilename: 'manifest.webmanifest',
        includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],

        // Улучшаем регистрацию SW
        injectRegister: 'auto',

        // Добавляем scope для предотвращения конфликтов
        scope: '/',
        useCredentials: true,
      }),
    ],

    // Добавьте эту секцию для оптимизации сборки
    build: {
      cssCodeSplit: true,
      sourcemap: mode === 'development',
      /** Дефолт Vite 8 — oxc; terser даёт лишнее время в PLUGIN_TIMINGS без явной выгоды здесь */
      minify: 'oxc',
      rolldownOptions: {
        checks: {
          /** Vue/CSS-плагины закономерно доминируют по CPU; предупреждение не actionable */
          pluginTimings: false,
        },
        output: {
          codeSplitting: {
            groups: vendorCodeSplittingGroups,
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo?.name || ''
            if (name.endsWith('.css')) {
              return 'css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
    },
  }
})
