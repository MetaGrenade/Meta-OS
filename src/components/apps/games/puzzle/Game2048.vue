<template>
  <div
    class="game-2048"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Score & Controls -->
    <div class="score-panel">
      <div class="score">Score: {{ score }}</div>
      <button @click="resetGame">New Game</button>
    </div>

    <!-- Grid -->
    <div class="grid">
      <div
        v-for="(row, r) in board"
        :key="r"
        class="row"
      >
        <div
          v-for="(cell, c) in row"
          :key="c"
          class="cell"
          :class="'cell-' + cell"
        >
          <span v-if="cell">{{ cell }}</span>
        </div>
      </div>
    </div>

    <!-- Overlays -->
    <div v-if="won" class="overlay">
      <div class="message">🎉 You reached 2048! 🎉</div>
      <button @click="resetGame">Play Again</button>
    </div>
    <div v-else-if="gameOver" class="overlay">
      <div class="message">Game Over</div>
      <button @click="resetGame">Try Again</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

const SIZE = 4

// Reactive board and state
const board    = reactive(Array.from({ length: SIZE }, () => Array(SIZE).fill(0)))
const score    = ref(0)
const gameOver = ref(false)
const won      = ref(false)

// Spawn a 2 or 4 in a random empty cell
function spawnTile() {
  const empties = []
  board.forEach((row, r) =>
    row.forEach((v, c) => { if (!v) empties.push([r, c]) })
  )
  if (!empties.length) return
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  board[r][c] = Math.random() < 0.9 ? 2 : 4
}

// Initialize or reset board
function resetGame() {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      board[r][c] = 0

  score.value = 0
  gameOver.value = false
  won.value = false

  // Start with two tiles
  spawnTile()
  spawnTile()
}

// Slide & merge a single array of length SIZE
function slideAndMerge(row) {
  const arr = row.filter(v => v)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2
      score.value += arr[i]
      if (arr[i] === 2048) won.value = true
      arr.splice(i + 1, 1)
    }
  }
  while (arr.length < SIZE) arr.push(0)
  return arr
}

// Perform a move; returns true if anything changed
function move(direction) {
  if (gameOver.value || won.value) return

  let moved = false

  const copyBefore = board.map(r => [...r])

  // Helpers for transposing and reversing
  function transpose() {
    for (let r = 0; r < SIZE; r++)
      for (let c = r + 1; c < SIZE; c++)
        [board[r][c], board[c][r]] = [board[c][r], board[r][c]]
  }
  function reverseRows() {
    board.forEach(r => r.reverse())
  }

  if (direction === 'up') {
    transpose()
    for (let r = 0; r < SIZE; r++) {
      const merged = slideAndMerge(board[r])
      board[r].splice(0, SIZE, ...merged)
    }
    transpose()
  }
  else if (direction === 'down') {
    transpose()
    reverseRows()
    for (let r = 0; r < SIZE; r++) {
      const merged = slideAndMerge(board[r])
      board[r].splice(0, SIZE, ...merged)
    }
    reverseRows()
    transpose()
  }
  else if (direction === 'left') {
    for (let r = 0; r < SIZE; r++) {
      const merged = slideAndMerge(board[r])
      board[r].splice(0, SIZE, ...merged)
    }
  }
  else if (direction === 'right') {
    reverseRows()
    for (let r = 0; r < SIZE; r++) {
      const merged = slideAndMerge(board[r])
      board[r].splice(0, SIZE, ...merged)
    }
    reverseRows()
  }

  // detect any change
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== copyBefore[r][c]) {
        moved = true
        break
      }
    }
    if (moved) break
  }

  if (moved) {
    spawnTile()
    if (checkGameOver()) gameOver.value = true
  }
}

// Check for no moves left
function checkGameOver() {
  // any empty cell?
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!board[r][c]) return false

  // any possible merge?
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return false
      if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return false
    }

  return true
}

// Keyboard controls
function handleKey(e) {
  switch (e.key) {
    case 'ArrowUp':    move('up');    break
    case 'ArrowDown':  move('down');  break
    case 'ArrowLeft':  move('left');  break
    case 'ArrowRight': move('right'); break
  }
}

// Touch (swipe) controls
let startX = 0, startY = 0
function onTouchStart(e) {
  const t = e.touches[0]
  startX = t.clientX
  startY = t.clientY
}
function onTouchEnd(e) {
  const t = e.changedTouches[0]
  const dx = t.clientX - startX
  const dy = t.clientY - startY
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move('right')
    else if (dx < -30) move('left')
  } else {
    if (dy > 30) move('down')
    else if (dy < -30) move('up')
  }
}

// Initialize
onMounted(() => {
  resetGame()
  window.addEventListener('keydown', handleKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<style scoped>
.game-2048 {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #faf8ef;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  user-select: none;
}
.score-panel {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 16px;
}
.score-panel .score {
  font-size: 1.2rem;
  font-weight: bold;
}
.score-panel button {
  padding: 6px 12px;
  background: #8f7a66;
  color: #f9f6f2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 80px);
  grid-gap: 8px;
}
.cell {
  width: 80px;
  height: 80px;
  background: #cdc1b4;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #776e65;
}
.cell-0 {
  background: #cdc1b4;
}
.cell-2 {
  background: #eee4da; color: #776e65;
}
.cell-4 {
  background: #ede0c8; color: #776e65;
}
.cell-8 {
  background: #f2b179; color: #f9f6f2;
}
.cell-16 {
  background: #f59563; color: #f9f6f2;
}
.cell-32 {
  background: #f67c5f; color: #f9f6f2;
}
.cell-64 {
  background: #f65e3b; color: #f9f6f2;
}
.cell-128 {
  background: #edcf72; color: #f9f6f2; font-size:1.2rem;
}
.cell-256 {
  background: #edcc61; color: #f9f6f2; font-size:1.2rem;
}
.cell-512 {
  background: #edc850; color: #f9f6f2; font-size:1.2rem;
}
.cell-1024 {
  background: #edc53f; color: #f9f6f2; font-size:1rem;
}
.cell-2048 {
  background: #edc22e; color: #f9f6f2; font-size:1rem;
}

/* Game over / win overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(238,228,218,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.overlay .message {
  font-size: 2rem;
  margin-bottom: 12px;
}
.overlay button {
  padding: 8px 16px;
  background: #8f7a66;
  color: #f9f6f2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
