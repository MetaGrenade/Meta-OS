<template>
  <div class="donut-dash-app">
    <!-- Start Screen -->
    <div v-if="gameState === 'start'" class="start-screen">
      <img src="/img/logos/apps/games/donutdash.png" alt="Donut Dash" />
      <p>Click as many 🍩 as you can in 60 seconds!</p>
      <button @click="startGame">Start</button>
    </div>

    <!-- Playing Screen -->
    <div v-else-if="gameState === 'playing'" class="game-screen">
      <div class="hud">
        <div class="hud-item">Time: {{ timer }}</div>
        <div class="hud-item">Score: {{ score }}</div>
      </div>
      <button class="donut-btn" @click="clickDonut">🍩</button>
    </div>

    <!-- End Screen / Leaderboard -->
    <div v-else class="end-screen">
      <h2>🍩 Time’s up!</h2>
      <p>Your score: <strong>{{ score }}</strong></p>

      <div class="enter-name">
        <input v-model="playerName" placeholder="Enter your handle" />
        <button @click="saveScore">Save Score</button>
      </div>

      <h3>🏆 Top Donut Dashers</h3>
      <ol class="leaderboard">
        <li v-for="(e, idx) in leaderboard" :key="idx">
          {{ e.name }} — {{ e.score }}
        </li>
        <li v-if="!leaderboard.length">No scores yet!</li>
      </ol>

      <button @click="resetGame">Play Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const gameState   = ref('start')   // 'start' | 'playing' | 'ended'
const timer       = ref(60)
const score       = ref(0)
const playerName  = ref('')
const leaderboard = ref([])

let intervalId = null

// load existing leaderboard from localStorage TODO: use a proper API
onMounted(() => {
  const data = localStorage.getItem('donutDashLeaderboard')
  if (data) leaderboard.value = JSON.parse(data)
})

// start the 60s game
function startGame() {
  score.value = 0
  timer.value = 60
  gameState.value = 'playing'
  intervalId = setInterval(() => {
    timer.value--
    if (timer.value <= 0) endGame()
  }, 1000)
}

// record a click
function clickDonut() {
  if (gameState.value === 'playing') {
    score.value++
  }
}

// finish the game
function endGame() {
  clearInterval(intervalId)
  intervalId = null
  gameState.value = 'ended'
}

// save score to leaderboard
function saveScore() {
  const name = playerName.value.trim() || 'Anonymous'
  leaderboard.value.push({ name, score: score.value })
  leaderboard.value.sort((a, b) => b.score - a.score)
  leaderboard.value.splice(10) // keep top 10
  localStorage.setItem('donutDashLeaderboard', JSON.stringify(leaderboard.value))
}

// reset to start
function resetGame() {
  playerName.value = ''
  gameState.value = 'start'
}
</script>

<style scoped>
.donut-dash-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffe5e5;
  font-family: sans-serif;
  color: #333;
  text-align: center;
}

/* Start */
.start-screen {
  margin: auto;
}
.start-screen h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
.start-screen button {
  padding: 0.5em 1em; font-size: 1.2rem;
  background: #ff6b81; color: #fff; border: none; border-radius: 4px;
  cursor: pointer;
}
.start-screen button:hover { filter: brightness(1.1); }

/* Playing */
.game-screen {
  margin: auto;
}
.hud {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.donut-btn {
  font-size: 10rem;
  background: transparent;
  border: none;
  cursor: pointer;
  animation: bounce 0.5s infinite alternate;
}
@keyframes bounce {
  to { transform: translateY(-10px); }
}

/* End / Leaderboard */
.end-screen {
  margin: auto;
  width: 80%;
  max-width: 400px;
}
.enter-name {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}
.enter-name input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}
.enter-name button {
  padding: 0.5rem;
  background: #ff6b81; color: #fff; border: none; border-radius: 4px;
  cursor: pointer;
}
.leaderboard {
  text-align: left;
  padding-left: 1rem;
  margin-bottom: 1rem;
}
.leaderboard li {
  margin: 0.25rem 0;
}
.end-screen button {
  padding: 0.5em 1em;
  background: #333; color: #fff; border: none; border-radius: 4px;
  cursor: pointer;
}
.end-screen button:hover { filter: brightness(1.1); }
</style>
