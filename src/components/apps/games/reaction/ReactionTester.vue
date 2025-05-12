<template>
  <div class="reaction-tester" @click="handleClick">
    <div 
      class="state-box" 
      :class="state" 
    >
      <template v-if="state === 'idle'">
        <p>Click to Start</p>
      </template>
      <template v-else-if="state === 'waiting'">
        <p>Get Ready…</p>
      </template>
      <template v-else-if="state === 'too-soon'">
        <p>Too Soon! Click to try again.</p>
      </template>
      <template v-else-if="state === 'ready'">
        <p>Click!</p>
      </template>
      <template v-else-if="state === 'done'">
        <p>Your time: <strong>{{ lastTime }} ms</strong></p>
        <p>Best time: <strong>{{ bestTime }} ms</strong></p>
        <p>Click to try again.</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const state = ref('idle')      // 'idle' | 'waiting' | 'ready' | 'too-soon' | 'done'
const lastTime = ref(0)
const bestTime = ref(null)

let timeoutId = null
let startTimestamp = 0

// Load best time from localStorage
onMounted(() => {
  const stored = parseInt(localStorage.getItem('reaction-best'), 10)
  if (!isNaN(stored)) bestTime.value = stored
})
onUnmounted(() => {
  clearTimeout(timeoutId)
})

function handleClick() {
  if (state.value === 'idle' || state.value === 'done' || state.value === 'too-soon') {
    // start new test
    state.value = 'waiting'
    lastTime.value = 0
    // random delay 2000–7000 ms
    const delay = Math.random() * 5000 + 2000
    timeoutId = setTimeout(() => {
      state.value = 'ready'
      startTimestamp = performance.now()
    }, delay)
  }
  else if (state.value === 'waiting') {
    // clicked too early
    clearTimeout(timeoutId)
    state.value = 'too-soon'
  }
  else if (state.value === 'ready') {
    // record reaction time
    const elapsed = Math.round(performance.now() - startTimestamp)
    lastTime.value = elapsed
    // update best
    if (bestTime.value === null || elapsed < bestTime.value) {
      bestTime.value = elapsed
      localStorage.setItem('reaction-best', elapsed)
    }
    state.value = 'done'
  }
  // else if state is other, do nothing special
}
</script>

<style scoped>
.reaction-tester {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  user-select: none;
}
.state-box {
  width: 80%;
  max-width: 400px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s;
  text-align: center;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
}
/* States */
.state-box.idle { background: #666; }
.state-box.waiting { background: #c0392b; }
.state-box.too-soon { background: #f39c12; }
.state-box.ready { background: #27ae60; }
.state-box.done { background: #2980b9; }
</style>
