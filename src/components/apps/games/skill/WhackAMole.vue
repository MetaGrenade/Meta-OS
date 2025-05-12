<template>
  <div class="whack-app">
    <!-- Header -->
    <header class="wh-header">
      <h1>Whack-a-Mole</h1>
      <div class="info">
        <div>Time: {{ timeLeft }}s</div>
        <div>Score: {{ score }}</div>
      </div>
    </header>

    <!-- Grid of holes -->
    <div class="grid">
      <div
        v-for="(hole, idx) in 9"
        :key="idx"
        class="hole"
        @click="whack(idx)"
      >
        <span v-if="activeHole === idx" class="mole">🐹</span>
      </div>
    </div>

    <!-- Game Over Overlay -->
    <div v-if="gameOver" class="overlay">
      <div class="message">
        <p>Time's up!</p>
        <p>Your final score: <strong>{{ score }}</strong></p>
        <button @click="startGame">Play Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const score      = ref(0)
const timeLeft   = ref(30)
const activeHole = ref(null)
const gameOver   = ref(false)

let popInterval = null
let timerInterval = null

function popUp() {
  // choose a random hole 0–8
  activeHole.value = Math.floor(Math.random() * 9)
}

function whack(idx) {
  if (gameOver.value) return
  if (idx === activeHole.value) {
    score.value++
    activeHole.value = null
  }
}

function tick() {
  timeLeft.value--
  if (timeLeft.value <= 0) {
    endGame()
  }
}

function startGame() {
  // reset state
  score.value = 0
  timeLeft.value = 30
  gameOver.value = false
  activeHole.value = null

  // clear any existing intervals
  clearInterval(popInterval)
  clearInterval(timerInterval)

  // start pop-ups every 800ms
  popUp()
  popInterval = setInterval(popUp, 800)

  // start countdown
  timerInterval = setInterval(tick, 1000)
}

function endGame() {
  gameOver.value = true
  clearInterval(popInterval)
  clearInterval(timerInterval)
  activeHole.value = null
}

onMounted(startGame)
onUnmounted(() => {
  clearInterval(popInterval)
  clearInterval(timerInterval)
})
</script>

<style scoped>
.whack-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0e6d6;
  font-family: sans-serif;
  user-select: none;
}

/* Header */
.wh-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #a0522d;
  color: #fff;
  padding: 12px 16px;
}
.wh-header h1 {
  margin: 0;
  font-size: 1.5rem;
}
.info {
  display: flex;
  gap: 16px;
}

/* Grid */
.grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;
}
.hole {
  background: #c49e73;
  border-radius: 50%;
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.hole:active {
  transform: scale(0.95);
}
.mole {
  font-size: 2rem;
  line-height: 1;
  user-select: none;
}

/* Overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.message {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
}
.message p {
  margin: 8px 0;
  font-size: 1.2rem;
}
.message button {
  margin-top: 12px;
  padding: 8px 16px;
  background: #a0522d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
