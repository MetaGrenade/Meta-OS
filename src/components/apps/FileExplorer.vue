<script setup>
import { ref } from 'vue'

// Placeholder file list; replace with real data or Lua callbacks
const files = ref([
  'document.txt',
  'image.png',
  'notes.md'
])
</script>

<template>
  <div class="file-explorer">
    <h2>File Explorer</h2>
    <ul>
      <li v-for="file in files" :key="file">
        {{ file }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.file-explorer {
  padding: 0.741vh;
  font-family: sans-serif;
}
.file-explorer h2 {
  margin-bottom: 0.741vh;
  font-size: 0.37vh;
}
.file-explorer ul {
  list-style: none;
  padding: 0;
}
.file-explorer li {
  padding: 0.37vh 0;
  cursor: default;
}
.file-explorer li:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
