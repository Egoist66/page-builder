// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@artmizu/nuxt-prometheus',
  ],

  ui: {
    colors: {
      primary: 'sky',
      neutral: 'slate',
    },
  },
  ssr: false,

  devtools: {
    enabled: true,
    timeline: { enabled: true },
  },

  app: {
    head: {
      title: 'Page Builder',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'ru' },
    },
    pageTransition: false,
    layoutTransition: false,
  },
  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      appName: 'Page Builder',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },

  devServer: {
    https: {
      key: './localhost+2-key.pem',
      cert: './localhost+2.pem',
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  features: {
    inlineStyles: true,
  },

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    typedPages: true,
    viewTransition: true,
  },
  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    minify: true,
    timing: true,
    storage: {
      cache: { driver: 'memory' },
    },
    routeRules: {
      '/api/**': { cors: true },
    },
  },

  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
    shim: false,
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  i18n: {
    restructureDir: false,
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'ru',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'ru',
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },
})
