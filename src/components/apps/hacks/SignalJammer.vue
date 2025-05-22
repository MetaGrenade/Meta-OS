<template>
  <div class="signal-jammer-app">
    <!-- Header -->
    <header class="sj-header">
      <h1>Signal Jammer</h1>
    </header>

    <!-- Canvas -->
    <div class="canvas-container">
      <canvas ref="canvas" width="400" height="200"></canvas>
    </div>

    <!-- Controls -->
    <section class="controls">
      <label>
        Jam Frequency: {{ jamFreq.toFixed(2) }} Hz
        <input
          type="range"
          v-model.number="jamFreq"
          :min="fMin"
          :max="fMax"
          step="0.01"
        />
      </label>
      <div class="status">
        <div>Noise Level: {{ noiseLevel.toFixed(2) }}</div>
        <div>
          Nullified: {{ nullTime.toFixed(1) }} / {{ nullThreshold }} s
        </div>
      </div>
    </section>

    <!-- Success Overlay -->
    <div v-if="won" class="overlay">
      <div class="message">
        🎉 Signal Silenced! 🎉
        <button @click="resetGame">Jam Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'

const canvas = ref(null)
const ctx = ref(null)

const fMin = 1     // minimum signal frequency (Hz)
const fMax = 5     // maximum signal frequency
const numSignals = 3

// Reactive state
const signals = reactive([])
const jamFreq = ref((fMin + fMax) / 2)
const time = ref(0)
const noiseLevel = ref(1)
const nullThreshold = 5  // seconds to hold below threshold
const nullThresholdLevel = 0.25  // noiseLevel must be <= this
let nullTime = ref(0)
const won = ref(false)

let rafId = null

function resetGame() {
  // generate random signals
  signals.splice(0, signals.length)
  for (let i = 0; i < numSignals; i++) {
    signals.push({
      freq: Math.random() * (fMax - fMin) + fMin,
      phase: Math.random() * Math.PI * 2
    })
  }
  jamFreq.value = (fMin + fMax) / 2
  time.value = 0
  noiseLevel.value = 1
  nullTime.value = 0
  won.value = false
}

// draw and compute noise
function drawFrame() {
  const c = canvas.value
  if (!c || won.value) return
  const context = ctx.value
  const W = c.width
  const H = c.height
  context.clearRect(0, 0, W, H)

  const samples = 200
  let sumSq = 0

  context.beginPath()
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * W
    const norm = i / samples
    // time factor
    const t = time.value * 0.5
    // sum of signals
    let amp = 0
    for (const s of signals) {
      amp += Math.sin(2 * Math.PI * s.freq * (norm + t) + s.phase)
    }
    // user jamming wave
    amp -= Math.sin(2 * Math.PI * jamFreq.value * (norm + t))
    // normalize by number of signals
    amp /= numSignals

    // accumulate for RMS
    sumSq += amp * amp

    const y = H/2 - amp * (H/3)
    if (i === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.strokeStyle = '#00ff00'
  context.lineWidth = 2
  context.stroke()

  // update noise level
  const rms = Math.sqrt(sumSq / (samples + 1))
  noiseLevel.value = rms

  // update nullification timer
  if (rms <= nullThresholdLevel) {
    nullTime.value += 1/60
    if (nullTime.value >= nullThreshold) {
      won.value = true
    }
  } else {
    nullTime.value = 0
  }

  time.value += 1/60
  rafId = requestAnimationFrame(drawFrame)
}

onMounted(() => {
  const c = canvas.value
  ctx.value = c.getContext('2d')
  resetGame()
  drawFrame()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.signal-jammer-app {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #111;
  color: #eee;
  font-family: sans-serif;
  height: 100%;
  padding: 1.481vh;
  box-sizing: border-box;
}
.sj-header {
  margin-bottom: 0.741vh;
}
.canvas-container {
  background: #222;
  padding: 0.741vh;
  border-radius: 0.37vh;
}
.controls {
  margin-top: 1.111vh;
  width: 100%;
  max-width: 37.037vh;
}
.controls label {
  display: block;
  font-size: 1.296vh;
}
.controls input[type="range"] {
  width: 100%;
  margin-top: 0.37vh;
}
.status {
  margin-top: 0.741vh;
  font-size: 1.296vh;
}
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
  padding: 2.222vh;
  text-align: center;
  border: 0.185vh solid #00ff00;
  border-radius: 0.741vh;
}
.message button {
  margin-top: 1.111vh;
  padding: 0.741vh 1.481vh;
  background: #00ff00;
  color: #111;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
}
</style>
