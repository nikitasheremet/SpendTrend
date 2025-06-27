import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { openDB } from './localDb/db'

async function initializeApp() {
  const app = createApp(App)
  await openDB()
  app.use(router)
  app.mount('#app')
}

const app = createApp(App)

app.use(router)

initializeApp()
