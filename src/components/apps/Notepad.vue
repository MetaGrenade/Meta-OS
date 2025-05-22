<script setup>
import { ref } from 'vue'

// Simple notepad content binding
const content = ref('')
</script>

<template>
  <div class="notepad">
    <textarea v-model="content" placeholder="Type your notes here..."></textarea>
  </div>
</template>

<style scoped>
.notepad {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: monospace;
}
.notepad textarea {
  flex: 1;
  resize: none;
  padding: 0.741vh;
  border-radius: 0.37vh;
  font-family: monospace;
  font-size: 1.481vh;
}
</style>
