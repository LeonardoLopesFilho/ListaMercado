import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-BR', 
      },
      meta: [
        { name: 'google', content: 'notranslate' }, 
      ],
    },
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@vite-pwa/nuxt'],
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Lista de Mercado',
      short_name: 'ListaMercado',
      description: 'Aplicação para auxiliar na gestão de compras',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/retail.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/retail.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      /* Configurações do service worker, se quiser */
    },
  },
})
