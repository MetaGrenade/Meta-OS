<template>
  <div class="slot-app">
    <!-- Header -->
    <header class="sm-header">
      <h1>🎰 Slot Machine</h1>
    </header>

    <!-- Balances & Chip Management -->
    <section class="sm-balance">
      <div class="wallet">Bank: ${{ walletBalance.toFixed(2) }}</div>
      <div class="chips">Chips: {{ chipBalance }}</div>
      <div class="purchase">
        <input
          type="number"
          v-model.number="purchaseAmount"
          min="1"
          :max="Math.floor(walletBalance)"
          placeholder="Chips to buy"
        />
        <button
          @click="purchaseChips"
          :disabled="purchaseAmount < 1 || purchaseAmount > walletBalance"
        >
          Buy Chips
        </button>
      </div>
      <button 
        class="cashout"
        @click="cashOut"
        :disabled="chipBalance === 0 || spinning"
      >
        Cash Out All
      </button>
    </section>

    <!-- Slot Machine -->
    <section class="sm-machine">
      <div class="reels">
        <div 
          v-for="(r, i) in reels" 
          :key="i" 
          class="reel" 
          :class="{ spinning: spinning }"
        >
          {{ r }}
        </div>
      </div>
      <button
        class="spin-btn"
        @click="spin"
        :disabled="chipBalance < spinCost || spinning"
      >
        Spin ({{ spinCost }} chip)
      </button>
      <p v-if="lastWin !== null" class="result">
        <span v-if="lastWin > 0">You won {{ lastWin }} chips! 🎉</span>
        <span v-else>You lost this spin. 😢</span>
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'

// --- Balances ---
const walletBalance = ref(100)
const chipBalance   = ref(0)
const purchaseAmount = ref(1)

// --- Slot Machine Setup ---
const spinCost = 1
const symbols = ['🍒','🍋','🔔','💎','7️⃣','🍉']
const reels = reactive(['❓','❓','❓'])
const lastWin = ref(null)
const spinning = ref(false)

// to hold our per-reel intervals & timeouts
const spinIntervals = []
const stopTimeouts = []

// Purchase & Cashout
function purchaseChips() {
  const amt = Math.floor(purchaseAmount.value)
  if (amt < 1 || amt > walletBalance.value) return
  walletBalance.value -= amt
  chipBalance.value   += amt
  purchaseAmount.value = 1
}
function cashOut() {
  walletBalance.value += chipBalance.value
  chipBalance.value   = 0
}

// Spin with animation
function spin() {
  if (chipBalance.value < spinCost || spinning.value) return

  // Deduct cost and reset
  chipBalance.value -= spinCost
  lastWin.value = null
  spinning.value = true

  // Pre-pick final symbols
  const final = Array.from({ length: 3 }, () =>
    symbols[Math.floor(Math.random() * symbols.length)]
  )

  // Start cycling each reel every 100ms
  for (let i = 0; i < 3; i++) {
    spinIntervals[i] = setInterval(() => {
      reels[i] = symbols[Math.floor(Math.random() * symbols.length)]
    }, 100)

    // Stop this reel after a staggered delay
    stopTimeouts[i] = setTimeout(() => {
      clearInterval(spinIntervals[i])
      reels[i] = final[i]

      // Once the last reel stops, evaluate payout
      if (i === 2) {
        evaluatePayout(final)
        spinning.value = false
      }
    }, 600 + i * 300) // first reel stops at 600ms, next at 900ms, last at 1200ms
  }
}

// Determine win based on final symbols
function evaluatePayout(final) {
  const [a,b,c] = final
  let payout = 0
  if (a === b && b === c) {
    payout = 10
  } else if (a === b || b === c || a === c) {
    payout = 3
  }
  chipBalance.value += payout
  lastWin.value = payout
}

// clean up in case component unmounts during spin
onUnmounted(() => {
  spinIntervals.forEach(id => clearInterval(id))
  stopTimeouts.forEach(id => clearTimeout(id))
})
</script>

<style scoped>
.slot-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e2e;
  color: #eee;
  font-family: sans-serif;
}

/* Header */
.sm-header {
  text-align: center;
  background: #2a2a3a;
  padding: 12px;
  border-bottom: 2px solid #444;
}
.sm-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

/* Balances */
.sm-balance {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: #29293a;
}
.wallet, .chips {
  font-weight: bold;
}
.purchase {
  display: flex;
  gap: 4px;
}
.purchase input {
  width: 80px;
  padding: 4px;
  border-radius: 4px;
  border: none;
}
.purchase button {
  padding: 4px 8px;
  background: #f5a623;
  color: #1e1e2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.purchase button:disabled {
  background: #666;
  cursor: default;
}
.cashout {
  padding: 4px 8px;
  background: #cf1414;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cashout:disabled {
  background: #666;
  cursor: default;
}

/* Machine */
.sm-machine {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.reels {
  display: flex;
  gap: 12px;
}
.reel {
  width: 64px;
  height: 64px;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.5);
  transition: transform 0.2s;
}
.reel.spinning {
  transform: translateY(-10px);
}
.spin-btn {
  padding: 8px 16px;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.spin-btn:disabled {
  background: #666;
  cursor: default;
}
.result {
  font-size: 1rem;
  font-weight: bold;
}
</style>
