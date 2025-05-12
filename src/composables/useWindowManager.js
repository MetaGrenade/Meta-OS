import { reactive, markRaw } from 'vue'

export function useWindowManager() {
  const state = reactive({ windows: [] })
  let zCounter = 1
  // Open an app window (or focus if already open)
  function openApp(app) {
    const exists = state.windows.find(w => w.id === app.id)
    if (exists) {
      return focusWindow(app.id)
    }
    state.windows.push({
      id: app.id,
      title: app.name,
      icon: app.icon,
      component: markRaw(app.component),
      zIndex: ++zCounter,
      minimized: false,
      x: 50,
      y: 50,
      width: app.defaultWidth ?? 1024,
      height: app.defaultHeight ?? 768
    })
  }

  // Close a window
  function closeWindow(id) {
    const idx = state.windows.findIndex(w => w.id === id)
    if (idx !== -1) state.windows.splice(idx, 1)
  }

  // Bring a window to front and restore if minimized
  function focusWindow(id) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return
    win.zIndex = ++zCounter
    win.minimized = false
  }

  // Minimize a window
  function minimizeWindow(id) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return
    win.minimized = true
  }

  // Update window properties (position, size, minimized state, etc.)
  function updateWindow(id, props) {
    const win = state.windows.find(w => w.id === id)
    if (!win) return
    Object.assign(win, props)
  }

  return {
    state,
    openApp,
    closeWindow,
    focusWindow,
    minimizeWindow,
    updateWindow
  }
}
