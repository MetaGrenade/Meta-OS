<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue'
import Icon from './Icon.vue'
import { apps } from '../apps.js'

const emit = defineEmits(['launch'])
const selectedIcon = ref(null)

// Select an icon on single click
function onIconClick(id) {
  selectedIcon.value = id
}

// Launch app on double-click
function onIconDblclick(id) {
  emit('launch', id)
}

// Clear selection if click target isn’t an .icon (or child of one)
function handleClickOutside(event) {
  const path = event.composedPath()
  if (!path.some(el => el.classList && el.classList.contains('icon'))) {
    selectedIcon.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="grid">
    <Icon
      v-for="app in apps"
      :key="app.id"
      :icon="app.icon"
      :label="app.name"
      :selected="selectedIcon === app.id"
      @click="onIconClick(app.id)"
      @dblclick="onIconDblclick(app.id)"
    />
  </div>
</template>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 80px);
  gap: 12px;
  padding: 16px;
}
</style>
