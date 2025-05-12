<template>
  <div class="wifi-breach-app">
    <!-- Header & Timer -->
    <header class="wb-header">
      <h1>Wi-Fi Network Breach</h1>
      <div class="wb-info">
        <div>Time Left: {{ timeLeft }}s</div>
      </div>
    </header>

    <!-- Grid of Nodes -->
    <div class="wb-grid">
      <div
        v-for="(row, r) in board"
        :key="r"
        class="wb-row"
      >
        <div
          v-for="(node, c) in row"
          :key="c"
          class="wb-node"
          :class="{
            start:    r===0&&c===0,
            target:   r===SIZE-1 && c===SIZE-1,
            firewall: node.type==='firewall',
            locked:   !node.unlocked,
            unlocked: node.unlocked,
            current:  r===current.r && c===current.c,
            breached: won
          }"
          @click="handleClick(r,c)"
        >
          <span v-if="node.type==='firewall'">🛡️</span>
          <span v-else-if="r===SIZE-1&&c===SIZE-1">💻</span>
          <span v-else-if="r===0&&c===0">📡</span>
        </div>
      </div>
    </div>

    <!-- Overlays -->
    <div v-if="gameOver && !won" class="wb-overlay">
      <div class="wb-message">
        <h2>💥 Breach Failed</h2>
        <p>You hit a firewall or ran out of time.</p>
        <button @click="resetGame">Try Again</button>
      </div>
    </div>
    <div v-if="won" class="wb-overlay">
      <div class="wb-message">
        <h2>✅ Breach Successful!</h2>
        <p>You hacked the target server.</p>
        <button @click="resetGame">Play Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

const SIZE = 5           // 5×5 grid
const board = reactive([])

// Game state
const current = reactive({ r: 0, c: 0 })
const timeLeft = ref(60)
const gameOver = ref(false)
const won      = ref(false)

let timerId = null

// Initialize or reset the board
function resetGame() {
  // Clear state
  board.length = 0
  timeLeft.value = 60
  gameOver.value = false
  won.value      = false
  current.r = 0
  current.c = 0

  // Build grid
  for (let r = 0; r < SIZE; r++) {
    const row = []
    for (let c = 0; c < SIZE; c++) {
      // Start and target are always normal
      let type = 'normal'
      if (r === SIZE-1 && c === SIZE-1) type = 'target'
      // Random firewalls everywhere else except start
      else if (!(r===0&&c===0) && Math.random() < 0.15) type = 'firewall'
      row.push({ type, unlocked: r===0&&c===0 })
    }
    board.push(row)
  }

  // Start countdown
  clearInterval(timerId)
  timerId = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      gameOver.value = true
      clearInterval(timerId)
    }
  }, 1000)
}

// Handle clicks on nodes
function handleClick(r, c) {
  if (gameOver.value || won.value) return

  // Must click an adjacent node
  const dr = Math.abs(r - current.r)
  const dc = Math.abs(c - current.c)
  if (dr + dc !== 1) return

  const node = board[r][c]

  // Hitting a firewall = game over
  if (node.type === 'firewall') {
    gameOver.value = true
    clearInterval(timerId)
    return
  }

  // If locked, exploit (unlock) first
  if (!node.unlocked) {
    node.unlocked = true
    return
  }

  // If unlocked, move into it
  current.r = r
  current.c = c

  // Check for target
  if (node.type === 'target') {
    won.value = true
    clearInterval(timerId)
  }
}

// Lifecycle
onMounted(resetGame)
onUnmounted(() => clearInterval(timerId))
</script>

<style scoped>
.wifi-breach-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1f1f24;
  color: #e0e0e0;
  font-family: sans-serif;
  user-select: none;
}
.wb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #282c34;
  padding: 12px 16px;
}
.wb-header h1 { margin: 0; font-size: 1.2rem; }
.wb-info { font-weight: bold; }

/* Grid */
.wb-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
}
.wb-row {
  display: flex;
  flex: 1;
}
.wb-node {
  flex: 1;
  margin: 4px;
  border-radius: 4px;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  transition: background 0.2s, transform 0.1s;
}
/* States */
.wb-node.locked { background: #333; }
.wb-node.unlocked { background: #666; }
.wb-node.firewall { background: #a62c2c; }
.wb-node.start { box-shadow: 0 0 0 2px #5dade2 inset; }
.wb-node.current { transform: scale(1.1); box-shadow: 0 0 8px #5dade2; }
.wb-node.target.breached { background: #27ae60; }

/* Overlay */
.wb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
.wb-message {
  background: #222;
  padding: 24px;
  border-radius: 6px;
  text-align: center;
}
.wb-message h2 {
  margin: 0 0 8px;
  color: #f39c12;
}
.wb-message p {
  margin: 4px 0;
}
.wb-message button {
  margin-top: 12px;
  padding: 8px 16px;
  background: #f39c12;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #222;
  font-weight: bold;
}
</style>
<!--
  This is a simple Wi-Fi breach game where the player navigates a grid of nodes.
  The goal is to reach the target node while avoiding firewalls and unlocking nodes.
  The game ends when the player either reaches the target or runs out of time.
  -->