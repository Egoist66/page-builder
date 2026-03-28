// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia/nuxt',
    '@prisma/nuxt',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@artmizu/nuxt-prometheus'
  ]
})