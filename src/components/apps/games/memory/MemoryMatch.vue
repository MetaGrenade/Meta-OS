<template>
  <div class="memory-app">
    <!-- Stats & Restart -->
    <div class="controls">
      <div class="stats">
        Moves: {{ moves }} | Matches: {{ matchedCount }}/8
      </div>
      <button class="restart" @click="initDeck">Restart</button>
    </div>

    <!-- Card Grid -->
    <div class="grid">
      <div
        v-for="card in cards"
        :key="card.id"
        class="card"
        :class="{ flipped: card.flipped || card.matched }"
        @click="flipCard(card)"
      >
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">{{ card.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

// The 8 values (pairs)
const baseValues = ['🐶','🐱','🦊','🐻','🐼','🐨','🐯','🦁']

// Reactive state
const cards = reactive([])
const moves = ref(0)
const matchedCount = ref(0)
const flipped = ref([])  // currently flipped (max 2)

// Utility: Fisher–Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Initialize or reset the deck
function initDeck() {
  moves.value = 0
  matchedCount.value = 0
  flipped.value = []

  // Create pair entries
  const pairList = baseValues
    .flatMap(v => [{ value: v }, { value: v }])
    .map((obj, idx) => ({
      ...obj,
      id: idx,        // unique id
      flipped: false, // showing front?
      matched: false  // already matched?
    }))

  // Shuffle into reactive array
  const shuffled = shuffle(pairList)
  cards.splice(0, cards.length, ...shuffled)
}

// Handle click on a card
function flipCard(card) {
  // ignore clicks on matched or already flipped
  if (card.matched || card.flipped || flipped.value.length === 2) return

  card.flipped = true
  flipped.value.push(card)

  if (flipped.value.length === 2) {
    moves.value++
    const [a, b] = flipped.value

    if (a.value === b.value) {
      // match!
      a.matched = b.matched = true
      matchedCount.value++
      flipped.value = []
    } else {
      // no match: flip back after a short delay
      setTimeout(() => {
        a.flipped = b.flipped = false
        flipped.value = []
      }, 800)
    }
  }
}

// Start on mount
onMounted(initDeck)
</script>

<style scoped>
.memory-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
  background: #f0f0f0;
  padding: 16px;
  box-sizing: border-box;
}

/* Controls */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.stats {
  font-size: 1rem;
  font-weight: bold;
}
.restart {
  padding: 6px 12px;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.restart:hover {
  background: #219150;
}

/* Grid */
.grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

/* Card */
.card {
  perspective: 600px;
  cursor: pointer;
}
.card-inner {
  position: relative;
  width: 100%;
  padding-top: 100%; /* square */
  transform-style: preserve-3d;
  transition: transform 0.5s;
}
.card.flipped .card-inner {
  transform: rotateY(180deg);
}

/* Faces */
.card-front,
.card-back {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border-radius: 8px;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.card-front {
  background: #2980b9;
}
.card-back {
  background: #ecf0f1;
  transform: rotateY(180deg);
}

/* Matched cards stay flipped and fade slightly */
.card.matched .card-inner {
  cursor: default;
}
.card.matched .card-back {
  opacity: 0.6;
}
</style>
