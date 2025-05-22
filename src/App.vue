<script setup>
import { ref, onMounted } from 'vue'
import DesktopGrid from '@/components/DesktopGrid.vue'
import Window from '@/components/Window.vue'
import Taskbar from '@/components/Taskbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { apps } from '@/apps.js'
import { useWindowManager } from '@/composables/useWindowManager'

/** -- DESKTOP VISIBILITY & NUI WIRING -- */
const visible = ref(false)

function openDesktop() {
  visible.value = true
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
</style>
