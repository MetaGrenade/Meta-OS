import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// NUI messages from Lua
window.addEventListener('message', e => {
    const { action } = e.data
    if (action === 'desktop:open') {
      // e.g. show desktop overlay
    }
})