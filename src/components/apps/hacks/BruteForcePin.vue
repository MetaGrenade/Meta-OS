<template>
  <div class="pin-cracker-app">
    <!-- Header & Heat Gauge -->
    <header class="pc-header">
      <h1>PIN Cracker</h1>
      <div class="heat-gauge">
        <div class="gauge-fill" :style="{ width: heat + '%' }"></div>
      </div>
      <div class="info">
        Attempts: {{ guesses.length }} / {{ maxGuesses }}
      </div>
    </header>

    <!-- Guess Input -->
    <div v-if="status === 'playing'" class="input-area">
      <input 
        v-model="currentInput" 
        type="text" 
        maxlength="4" 
        placeholder="Enter 4-digit PIN" 
        @keydown.enter.prevent="submitGuess"
      />
      <button 
        @click="submitGuess" 
        :disabled="!validInput"
      >Guess</button>
    </div>

    <!-- History of Guesses -->
    <div class="history">
      <div 
        v-for="(g, i) in guesses" 
        :key="i" 
        class="guess-row"
      >
        <span 
          v-for="(digit, idx) in g.code.split('')" 
          :key="idx" 
          class="digit" 
          :class="g.feedback[idx]"
        >
          {{ digit }}
        </span>
      </div>
    </div>

    <!-- Endgame Overlay -->
    <div v-if="status !== 'playing'" class="overlay">
      <div class="message">
        <h2 v-if="status==='won'">✅ PIN Cracked!</h2>
        <h2 v-else>🔥 Alarm Triggered!</h2>
        <p v-if="status==='won'">You guessed <strong>{{ secretCode }}</strong> in {{ guesses.length }} tries.</p>
        <p v-else>The code was <strong>{{ secretCode }}</strong>.</p>
        <button @click="resetGame">Play Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const maxGuesses = 6
const secretCode = ref('')
const currentInput = ref('')
const guesses = reactive([])  // each: { code: '1234', feedback: ['correct','present','absent',…] }
const status = ref('playing') // 'playing' | 'won' | 'lost'

// generate random 4-digit secret (0000–9999)
function genSecret() {
  secretCode.value = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10)
  ).join('')
}

// compute feedback like Wordle
function computeFeedback(code) {
  const feedback = Array(4).fill('absent')
  const secretArr = secretCode.value.split('')
  const used = [false, false, false, false]

  // first pass: correct
  for (let i = 0; i < 4; i++) {
    if (code[i] === secretArr[i]) {
      feedback[i] = 'correct'
      used[i] = true
    }
  }
  // second pass: present
  for (let i = 0; i < 4; i++) {
    if (feedback[i] === 'correct') continue
    const idx = secretArr.findIndex((d, j) => !used[j] && d === code[i])
    if (idx !== -1) {
      feedback[i] = 'present'
      used[idx] = true
    }
  }
  return feedback
}

const validInput = computed(() => /^[0-9]{4}$/.test(currentInput.value))

function submitGuess() {
  if (status.value !== 'playing' || !validInput.value) return
  const code = currentInput.value
  const fb = computeFeedback(code)
  guesses.push({ code, feedback: fb })
  currentInput.value = ''

  if (fb.every(f => f === 'correct')) {
    status.value = 'won'
  } else if (guesses.length >= maxGuesses) {
    status.value = 'lost'
  }
}

// heat gauge (%)
const heat = computed(() =>
  Math.min(100, (guesses.length / maxGuesses) * 100)
)

// reset everything
function resetGame() {
  guesses.splice(0, guesses.length)
  status.value = 'playing'
  currentInput.value = ''
  genSecret()
}

onMounted(resetGame)
</script>

<style scoped>
.pin-cracker-app {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #111;
  color: #eee;
  font-family: sans-serif;
  user-select: none;
}
.pc-header {
  padding: 12px;
  background: #222;
  display: flex;
  align-items: center;
  gap: 16px;
}
.heat-gauge {
  flex: 1;
  height: 16px;
  background: #444;
  border-radius: 8px;
  overflow: hidden;
}
.gauge-fill {
  height: 100%;
  background: #e74c3c;
  transition: width 0.3s ease;
}
.info {
  min-width: 120px;
  text-align: right;
  font-weight: bold;
}
.input-area {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: #1a1a1a;
}
.input-area input {
  flex: 1;
  padding: 8px;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  text-align: center;
  background: #333;
  color: #fff;
}
.input-area button {
  padding: 8px 16px;
  background: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}
.input-area button:disabled {
  background: #555;
  cursor: default;
}
.history {
  flex: 1;
  padding: 16px;
  background: #181818;
  overflow-y: auto;
}
.guess-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.digit {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
  border-radius: 4px;
  background: #333;
  color: #fff;
}
.digit.correct {
  background: #27ae60;
}
.digit.present {
  background: #f1c40f;
}
.digit.absent {
  background: #7f8c8d;
}

/* Overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.message {
  background: #222;
  padding: 24px;
  border-radius: 6px;
  text-align: center;
  color: #fff;
}
.message h2 {
  margin-bottom: 16px;
  color: #e74c3c;
}
.message button {
  padding: 8px 16px;
  background: #e74c3c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}
</style>
