import { createVuetify } from 'vuetify'
import { VApp, VMain, VBtn, VContainer } from 'vuetify/components'
import { Ripple } from 'vuetify/directives'

import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VApp,
      VMain,
      VBtn,
      VContainer,
      // importe manualmente os componentes que você usar!
    },
    directives: {
      Ripple,
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
