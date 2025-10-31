import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createExtension } from '@own3d/sdk/vue'
import App from './App.vue'

const extension = createExtension()
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(extension)
app.mount('#app')
