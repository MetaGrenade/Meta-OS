<template>
  <div class="tictactoe-app">
    <!-- Mode Switch -->
    <div class="mode-switch">
      <label>
        <input type="radio" value="two-player" v-model="mode" /> Two-Player
      </label>
      <label>
        <input type="radio" value="vs-ai" v-model="mode" /> vs. AI
      </label>
    </div>

    <!-- Status & Reset -->
    <div class="status-bar">
      <div class="status">{{ statusMessage }}</div>
      <button @click="resetGame">Restart</button>
    </div>

    <!-- Board Grid -->
    <div class="board">
      <div
        v-for="(row, r) in board"
        :key="r"
        class="board-row"
      >
        <div
          v-for="(_, c) in row"
          :key="c"
          class="cell"
          @click="makeMove(r, c)"
        >
          {{ board[r][c] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, nextTick } from 'vue'

// --- State ---
const mode          = ref('two-player')  // 'two-player' or 'vs-ai'
const board         = reactive(Array.from({ length: 3 }, () => Array(3).fill(null)))
const currentPlayer = ref('X')
const winner        = ref(null)          // 'X', 'O', or 'Tie'
const moves         = ref(0)

// --- Computed Status ---
const statusMessage = computed(() => {
  if (winner.value === 'Tie') return `It's a tie!`
  if (winner.value)            return `${winner.value} wins!`
  return `Turn: ${currentPlayer.value}`
})

// --- Helpers ---
function checkWinner(r, c) {
  const p = board[r][c]
  // row
  if (board[r].every(cell => cell === p)) return p
  // col
  if (board.every(row => row[c] === p)) return p
  // diag
  if (r === c && [0,1,2].every(i => board[i][i] === p)) return p
  if (r + c === 2 && [0,1,2].every(i => board[i][2-i] === p)) return p
  // tie
  if (moves.value >= 9) return 'Tie'
  return null
}

// --- Make a move ---
async function makeMove(r, c) {
  if (board[r][c] || winner.value) return  // occupied or game over
  // if vs-ai, only X (human) can move directly
  if (mode.value === 'vs-ai' && currentPlayer.value === 'O') return

  board[r][c] = currentPlayer.value
  moves.value++
  const result = checkWinner(r, c)
  if (result) {
    winner.value = result
    return
  }
  // switch turn
  currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'

  // if vs-ai and it's now O’s turn, let AI move
  if (mode.value === 'vs-ai' && currentPlayer.value === 'O') {
    await nextTick()    // wait for UI to update
    aiMove()
  }
}

// --- Simple AI: pick a random empty cell ---
function aiMove() {
  const empties = []
  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (!cell) empties.push([r, c])
    })
  )
  if (!empties.length || winner.value) return
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  board[r][c] = 'O'
  moves.value++
  const result = checkWinner(r, c)
  if (result) {
    winner.value = result
    return
  }
  currentPlayer.value = 'X'
}

// --- Reset Game ---
function resetGame() {
  moves.value = 0
  winner.value = null
  currentPlayer.value = 'X'
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      board[r][c] = null
}

// If mode switches mid-game, restart
watch(mode, resetGame)
</script>

<style scoped>
.tictactoe-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
  background: #fefefe;
  color: #222;
}

/* Mode selector */
.mode-switch {
  padding: 8px;
  background: #eee;
  display: flex;
  gap: 1rem;
}
.mode-switch input {
  margin-right: 4px;
}

/* Status & restart */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #ddd;
}
.status-bar button {
  padding: 4px 8px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

/* Board */
.board {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.board-row {
  display: flex;
}
.cell {
  width: 80px;
  height: 80px;
  border: 2px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.cell:hover {
  background: rgba(0,0,0,0.05);
}
</style>
