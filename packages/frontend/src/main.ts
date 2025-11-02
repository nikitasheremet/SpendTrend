import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from './store/store'

async function initializeApp() {
  await createStore()

  app.use(router)
  app.mount('#app')
}

const app = createApp(App)

initializeApp()
