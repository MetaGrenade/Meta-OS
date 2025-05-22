<script setup>
import { ref, onMounted } from 'vue'
import DesktopGrid from '@/components/DesktopGrid.vue'
import Window from '@/components/Window.vue'
import Taskbar from '@/components/Taskbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { apps } from '@/apps.js'
import { useWindowManager } from '@/composables/useWindowManager'

/** -- DESKTOP VISIBILITY & NUI WIRING -- */
const visible = ref(true)

function openDesktop() {
  visible.value = true
}

function closeDesktop() {
  // Hide immediately on the UI side
  visible.value = false
  window.postMessage({ action: 'desktop:close' }, '*')
  // Tell Lua we're closing (matches your RegisterNUICallback)
  fetch(`https://${GetParentResourceName()}/desktop:close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
}

onMounted(() => {
  window.addEventListener('message', e => {
    if (e.data?.action === 'desktop:open') {
      openDesktop()
    }
  })
})

/** -- WINDOW MANAGER & APP LAUNCHING -- */
const { state: { windows }, openApp, closeWindow, focusWindow, minimizeWindow, updateWindow } = useWindowManager()
const appMap = new Map(apps.map(a => [a.id, a])) // map app ID to app for faster lookup

function handleLaunch(id) {
  const app = appMap.get(id)
  if (app) openApp(app)
}

function handleTaskToggle(id) {
  const win = windows.find(w => w.id === id)
  if (!win) return
  if (win.minimized) {
    updateWindow(id, { minimized: false })
    focusWindow(id)
  } else {
    minimizeWindow(id)
  }
}
</script>

<template>
  <!-- Only render your desktop when visible -->
  <div class="desktop" v-show="visible">
    <!-- Grid of icons -->
    <DesktopGrid @launch="handleLaunch" />

    <!-- All open windows -->
    <Window
      v-for="win in windows"
      :key="win.id"
      :title="win.title"
      :icon="win.icon"
      :z="win.zIndex"
      :minimized="win.minimized"
      :x="win.x"
      :y="win.y"
      :width="win.width"
      :height="win.height"
      @close="closeWindow(win.id)"
      @focus="focusWindow(win.id)"
      @minimize="minimizeWindow(win.id)"
      @update:position="pos => updateWindow(win.id, { x: pos.x, y: pos.y })"
      @update:size="sz => updateWindow(win.id, { x: sz.x, y: sz.y, width: sz.width, height: sz.height })"
      class="window-wrapper"
    >
      <Suspense>
        <template #default>
          <component :is="win.component" />
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>
    </Window>

    <!-- Taskbar -->
    <Taskbar :windows="windows" @taskToggle="handleTaskToggle" />

    <!-- A little “Close Desktop” button in the corner -->
    <button
      v-if="visible"
      @click="closeDesktop"
      class="desktop-close-btn"
      aria-label="Close Desktop"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.desktop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: url('/img/backgrounds/MetaOS-Grunge.png') no-repeat center center fixed;
  background-size: cover;
  background-color: transparent;
  z-index: 0;
}

/* Optional: style for your “close desktop” control */
.desktop-close-btn {
  position: absolute;
  top: 0.741vh;
  right: 0.741vh;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  font-size: 1.759vh;
  padding: 0.37vh 0.741vh;
  border-radius: 0.37vh;
  cursor: pointer;
  z-index: 2000;
}
</style>
