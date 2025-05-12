<script setup>
import { ref } from 'vue'
import DesktopGrid from './components/DesktopGrid.vue'
import Window from './components/Window.vue'
import Taskbar from './components/Taskbar.vue'
import { apps } from './apps.js'
import { useWindowManager } from './composables/useWindowManager'

const visible = ref(true)
const { state: { windows }, openApp, closeWindow, focusWindow, minimizeWindow, updateWindow } = useWindowManager()
const appMap = new Map(apps.map(a => [a.id, a])) // map app ID to app for faster lookup

function handleLaunch(id) {
  const app = appMap.get(id)
  if (app) openApp(app)
}

// Clicking a taskbar item toggles minimize/focus
function handleTaskToggle(id) {
  const win = windows.find(w => w.id === id)
  if (!win) return
  if (win.minimized) {
    // restore & focus
    updateWindow(id, { minimized: false })
    focusWindow(id)
  } else {
    // minimize
    minimizeWindow(id)
  }
}
</script>

<template>
  <div class="desktop" v-show="visible">
    <video
      v-if="visible"
      class="desktop-video"
      preload="none"
      autoplay
      muted
      loop
      playsinline
    >
      <source src="/vid/bg_1k.webm" type="video/webm" />
    </video>

    <DesktopGrid v-if="visible" @launch="handleLaunch"/>
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
    >
      <component :is="win.component"/>
    </Window>
    <Taskbar
      :windows="windows"
      @taskToggle="handleTaskToggle"
    />
  </div>
</template>

<style>
/* .desktop {
  position: absolute;
  inset: 0;
  background: url('/img/wallpaper.webp') center/cover no-repeat;
} */

.desktop {
  position: absolute;
  inset: 0;
  overflow: hidden; /* ensure video doesn’t spill */
}
/* Video full-screen behind everything */
.desktop-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: -1;
}
</style>
