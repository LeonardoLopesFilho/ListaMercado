import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon'],
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
  },
})
