<script setup>
import { ref, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import { useTick } from '@/composables/useTick'

const props = defineProps({
  windows: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['taskToggle'])

const startMenuOpen = ref(false)
const clock = ref('')
const tick = useTick(1000) // grab a ticking ref at 1-second intervals

// emit toggle for windows
function handleClick(win) {
  emit('taskToggle', win.id)
}

// toggle start menu
function handleStartClick() {
  startMenuOpen.value = !startMenuOpen.value
}

// close start menu when clicking outside
function onClickOutside(e) {
  const path = e.composedPath()
  // if click was not on start-button or start-menu, close it
  if (
    !path.some(el => el.classList && el.classList.contains('start-button')) &&
    !path.some(el => el.classList && el.classList.contains('start-menu'))
  ) {
    startMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  watch(tick, () => {
    const now  = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
    clock.value = `${time}  ${date}`
  }, { immediate: true })
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="taskbar">
    <!-- Start button -->
    <div 
        class="start-button" 
        @click="handleStartClick"
        :class="{ 'start-button--active': startMenuOpen }"
    >
      <img src="/img/icons/start.png" alt="Start" />
    </div>

    <!-- Start menu popup -->
    <div v-if="startMenuOpen" class="start-menu">
      <ul>
        <li>Documents</li>
        <li>Photos</li>
        <li>Settings</li>
        <li>Power</li>
      </ul>
    </div>

    <!-- Running windows -->
    <div class="task-items">
      <div
        v-for="win in windows"
        :key="win.id"
        class="task-item"
        @click="handleClick(win)"
      >
        {{ win.title }}
      </div>
    </div>

    <!-- Clock on the right -->
    <div class="task-clock">
      {{ clock }}
    </div>
  </div>
</template>

<style scoped>
.taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(31, 16, 41, 0.9);
  display: flex;
  align-items: center;
  will-change: transform;
}

/* START BUTTON */
.start-button {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.start-button img {
  width: 30px;
  height: 30px;
}
.start-button:hover {
  background: #b014cf;
}
.start-button--active {
  background: #b014cf;
}

/* START MENU POPUP */
.start-menu {
  position: absolute;
  bottom: 50px;  /* sits right above the task bar */
  left: 0px;     /* aligns with the start button */
  background: rgba(31, 16, 41, 0.9);
  border: 1px solid #b014cf;
  overflow: hidden;
  z-index: 1000;
  height: 250px;
  width: 200px;
}
.start-menu ul {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  list-style: none;
  margin: 0;
  padding: 8px 0;
}
.start-menu li {
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
  text-align: left;
}
.start-menu li:hover {
  background: rgba(176, 20, 207,0.20);
}

/* TASK ITEMS */
.task-items {
  display: flex;
  align-items: center;
  margin-left: 16px; /* space after start button */
}
.task-item {
  margin-right: 8px;
  padding: 4px 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  font-size: 0.85rem;
}
.task-item:hover {
  background: rgba(255,255,255,0.2);
}

/* CLOCK */
.task-clock {
  margin-left: auto;
  padding: 0 12px;
  white-space: nowrap;
}
</style>
