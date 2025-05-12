<template>
  <div class="crypto-miner-app">
    <!-- Header -->
    <header class="cm-header">
      <h1>Crypto Miner</h1>
    </header>

    <!-- Rig Configuration -->
    <section class="cm-rig">
      <h2>Your Rig</h2>

      <!-- Add GPU -->
      <div class="add-gpu">
        <select v-model="newGpuId">
          <option disabled value="">Select GPU to add</option>
          <option v-for="g in gpuCatalog" :key="g.id" :value="g.id">
            {{ g.name }} ({{ g.hashRate }} MH/s)
          </option>
        </select>
        <button @click="addGPU" :disabled="!newGpuId">Add GPU</button>
      </div>

      <!-- GPU List -->
      <ul class="gpu-list">
        <li v-for="gpu in rigGPUs" :key="gpu.instanceId">
          {{ gpu.name }} — {{ gpu.hashRate }} MH/s, {{ gpu.power }} W, {{ gpu.temp }} °C
          <button @click="removeGPU(gpu.instanceId)">Remove</button>
        </li>
      </ul>

      <!-- Overclock Slider -->
      <div v-if="rigGPUs.length" class="overclock">
        <label>
          Overclock: {{ globalOverclock }} %
          <input
            type="range"
            v-model.number="globalOverclock"
            min="0"
            max="20"
          />
        </label>
      </div>

      <!-- Rig Totals -->
      <div v-if="rigGPUs.length" class="rig-stats">
        <div>Total Hash Rate: {{ totalHashRate.toFixed(2) }} MH/s</div>
        <div>Effective Hash Rate: {{ effectiveHashRate.toFixed(2) }} MH/s</div>
        <div>Total Power: {{ totalPower }} W</div>
        <div>Effective Power: {{ effectivePower.toFixed(0) }} W</div>
        <div>Avg. Temp: {{ avgTemp.toFixed(1) }} °C</div>
      </div>

      <!-- Animated Fan -->
      <div v-if="rigGPUs.length" class="fan-container">
        <img
          src="/img/icons/apps/fan.png"
          alt="Rig Fan"
          class="fan"
          :style="{ animationDuration: rotationDuration }"
        />
      </div>
    </section>

    <!-- Coin & Pool Selection -->
    <section class="cm-selection">
      <h2>Mining Market</h2>
      <label>
        Coin:
        <select v-model="selectedCoin">
          <option v-for="c in coins" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </label>
      <label>
        Pool:
        <select v-model="selectedPool">
          <option v-for="p in pools" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </label>
      <div>Network Hash Rate: {{ currentPool.networkHash }} MH/s</div>
      <div>Your Share: {{ poolShare.toFixed(3) }} %</div>
    </section>

    <!-- Balances & Stats -->
    <section class="cm-stats">
      <div class="stat">
        <span class="label">Mined (rig):</span>
        <span class="value">{{ cryptoBalance.toFixed(4) }} COIN</span>
      </div>
      <div class="stat">
        <span class="label">Session Time:</span>
        <span class="value">{{ sessionTime }}</span>
      </div>
      <hr/>
      <div class="stat">
        <span class="label">Wallet:</span>
        <span class="value">{{ walletBalance.toFixed(4) }} COIN</span>
      </div>
      <div class="stat">
        <span class="label">Rate:</span>
        <span class="value">{{ (miningRate * 3600).toFixed(4) }} COIN/hr</span>
      </div>
      <div class="stat">
        <span class="label">Time / 1 COIN:</span>
        <span class="value">{{ estimatedTime }}</span>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: (coinProgress * 100) + '%' }"></div>
      </div>

      <button @click="transfer" :disabled="cryptoBalance <= 0">
        Transfer to Wallet
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// GPU Catalog
const gpuCatalog = [
  { id: 1, name: 'NERDIA XTR 39000', hashRate: 120, power: 350, temp: 65 },
  { id: 2, name: 'GTX Ultra 690',      hashRate: 80,  power: 250, temp: 60 },
  { id: 3, name: 'AMD Fury Pro',       hashRate: 100, power: 300, temp: 70 }
]

// Pool Options
const pools = [
  { id: 'poolA', name: 'OceanPool',  networkHash: 10000 },
  { id: 'poolB', name: 'DesertPool', networkHash: 5000  }
]

// Coin Options
const coins = [
  { id: 'coinA', name: 'Coin Alpha', ratePerMH: (1/86400)/120 },
  { id: 'coinB', name: 'Coin Beta',  ratePerMH: (1/43200)/120 }
]

// Rig state
const rigGPUs          = reactive([])
let nextInstanceId    = 1
const newGpuId        = ref('')
const globalOverclock = ref(0)

// Market state
const selectedCoin = ref(coins.length ? coins[0].id : '')
const selectedPool = ref(pools.length ? pools[0].id : '')

// Balances & session timer
const cryptoBalance  = ref(0)
const walletBalance  = ref(0)
const sessionSeconds = ref(0)

let mineInterval, sessionInterval
onMounted(() => {
  mineInterval = setInterval(() => {
    cryptoBalance.value += miningRate.value
  }, 1000)
  sessionInterval = setInterval(() => {
    sessionSeconds.value++
  }, 1000)
})
onUnmounted(() => {
  clearInterval(mineInterval)
  clearInterval(sessionInterval)
})

// Rig computations
const totalHashRate = computed(() =>
  rigGPUs.reduce((sum, g) => sum + g.hashRate, 0)
)
const totalPower = computed(() =>
  rigGPUs.reduce((sum, g) => sum + g.power, 0)
)
const avgTemp = computed(() => {
  if (!rigGPUs.length) return 0
  const raw = rigGPUs.reduce((sum, g) => sum + g.temp, 0) / rigGPUs.length
  return raw + globalOverclock.value
})
const effectiveHashRate = computed(() =>
  totalHashRate.value * (1 + globalOverclock.value/100)
)
const effectivePower = computed(() =>
  totalPower.value * (1 + globalOverclock.value/100)
)

// Market computations
const currentCoin = computed(() =>
  coins.find(c => c.id === selectedCoin.value) || { ratePerMH: 0 }
)
const currentPool = computed(() =>
  pools.find(p => p.id === selectedPool.value) || { networkHash: 1 }
)
const miningRate = computed(() =>
  effectiveHashRate.value * currentCoin.value.ratePerMH
)
const poolShare = computed(() =>
  effectiveHashRate.value / currentPool.value.networkHash * 100
)

// Coin progress
const coinProgress = computed(() => cryptoBalance.value % 1)

// Time formatting
const pad = n => String(n).padStart(2, '0')
const estimatedTime = computed(() => {
  if (miningRate.value <= 0) return '∞'
  const secs = 1 / miningRate.value
  const h = Math.floor(secs/3600)
  const m = Math.floor((secs%3600)/60)
  const s = Math.floor(secs%60)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})
const sessionTime = computed(() => {
  const h = Math.floor(sessionSeconds.value/3600)
  const m = Math.floor((sessionSeconds.value%3600)/60)
  const s = sessionSeconds.value%60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})

// Fan rotation speed: 0°C→5s, 100°C→0.5s
const rotationDuration = computed(() => {
  const t = avgTemp.value
  const dur = 5 - (t/100)*4.5
  return `${dur.toFixed(2)}s`
})

// Actions
function addGPU() {
  const def = gpuCatalog.find(g => g.id === newGpuId.value)
  if (!def) return
  rigGPUs.push({ ...def, instanceId: nextInstanceId++ })
  newGpuId.value = ''
}
function removeGPU(instanceId) {
  const i = rigGPUs.findIndex(g => g.instanceId === instanceId)
  if (i !== -1) rigGPUs.splice(i,1)
}
function transfer() {
  walletBalance.value += cryptoBalance.value
  cryptoBalance.value = 0
}
</script>

<style scoped>
.crypto-miner-app {
  display: flex; 
  flex-direction: column; 
  height:100%;
  background:#1f1f1f; 
  color:#eee; 
  font-family:sans-serif;
}
.cm-header {
  background:#2a2a2a; 
  padding:12px; 
  text-align:center;
  border-bottom:2px solid #444;
}
.cm-header h1 { margin:0; color:#f5a623; }

/* Rig Section */
.cm-rig {
  padding:16px; 
  background:#292929; 
  border-bottom:1px solid #444;
}
.cm-rig h2 { margin:0 0 8px; color:#f5a623; }
.add-gpu { display:flex; gap:8px; margin-bottom:8px; }
.add-gpu select, .add-gpu button {
  padding:6px; border-radius:4px; border:none;
}
.add-gpu select { flex:1; }
.add-gpu button {
  background:#f5a623; 
  color:#1f1f1f; 
  cursor:pointer;
}
.gpu-list { 
  list-style:none; 
  padding:0; 
  margin:0 0 12px; 
}
.gpu-list li {
  display:flex; 
  justify-content:space-between; 
  margin-bottom:4px;
}
.gpu-list button {
  background:#cf1414; 
  color:#fff; 
  border:none; 
  border-radius:4px;
  cursor:pointer;
}
.overclock { margin-bottom:12px; }
.overclock input { width:100%; }
.rig-stats div { margin-bottom:4px; }

/* Fan */
.fan-container {
  display:flex; justify-content:center; margin-top:8px;
}
.fan {
  width:64px; height:64px; animation:spin infinite linear;
}
@keyframes spin { to { transform:rotate(360deg); } }

/* Market Section */
.cm-selection {
  padding:16px; 
  background:#1f1f1f; 
  border-bottom:1px solid #444;
  display:flex; 
  gap:16px; 
  flex-wrap:wrap;
}
.cm-selection label {
  display:flex; 
  flex-direction:column; 
  font-size:0.9rem;
}
.cm-selection select {
  margin-top:4px; 
  padding:6px; 
  border:none; 
  border-radius:4px;
}
.cm-selection div { margin-top:8px; }

/* Stats & Balance */
.cm-stats {
  flex:1; 
  padding:16px; 
  display:flex; 
  flex-direction:column;
  gap:12px;
}
.stat { display:flex; justify-content:space-between; }
.label { font-weight:bold; color:#ccc; }
.value { font-family:monospace; }
.progress-bar {
  width:100%; 
  height:8px; 
  background:#444;
  border-radius:4px; 
  overflow:hidden; 
  margin:8px 0;
}
.progress {
  height:100%; 
  background:#f5a623;
  width:0%; 
  transition:width 1s linear;
}
.cm-stats button {
  align-self:center; 
  margin-top:auto;
  padding:8px 16px; 
  background:#f5a623; 
  border:none;
  color:#1f1f1f; 
  font-weight:bold; 
  border-radius:4px;
  cursor:pointer;
}
.cm-stats button:disabled {
  background:#555; 
  cursor:default;
}
</style>
