import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// expose an API so we can open from the window listener
// (we’ll implement openDesktop in App.vue)
// app.config.globalProperties.$openDesktop = () => {
//   app._component.proxy.openDesktop()
// }

app.mount('#app')

// helper to show/hide the entire NUI page
function setUIVisible(on) {
  const disp = on ? 'flex' : 'none'
  document.documentElement.style.display = disp
  document.body.style.display = disp
  //   app.config.globalProperties.$openDesktop()
}

// NUI messages from Lua
window.addEventListener('message', e => {
    const { action } = e.data
    if (action === 'desktop:open') {
      setUIVisible(true)
    } else if (action === 'desktop:close') {
      setUIVisible(false)
    }
})