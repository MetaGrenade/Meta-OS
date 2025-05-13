<template>
  <div class="port-scanner-app">
    <!-- Header & Controls -->
    <header class="ps-header">
      <h1>Port Scanner</h1>
      <button @click="resetGame">Reset</button>
      <div class="ps-stats">
        <div>Found: {{ foundCount }} / {{ targets.length }}</div>
        <div v-if="hotService">
          ⚠️ HOT: Find <strong>{{ hotService }}</strong> in {{ timer }}s
        </div>
      </div>
    </header>

    <!-- Target List -->
    <section class="ps-targets">
      <h2>Services to Find:</h2>
      <ul>
        <li
          v-for="svc in targets"
          :key="svc"
          :class="{ found: foundSet.has(svc), hot: svc === hotService }"
        >
          {{ svc }}
        </li>
      </ul>
    </section>

    <!-- Grid of Ports -->
    <div class="ps-grid">
      <div
        v-for="entry in ports"
        :key="entry.port"
        class="ps-port"
        :class="{ found: entry.found }"
        @click="scan(entry)"
        v-bind="entry.tooltip ? { 'data-service': entry.tooltip } : {}"
      >
        {{ entry.port }}
      </div>
    </div>

    <!-- Win/Lose Overlay -->
    <div v-if="gameStatus !== 'playing'" class="overlay">
      <div class="message">
        <h2 v-if="gameStatus === 'won'">✅ You’ve found an attack vector!</h2>
        <h2 v-else>❌ Time’s Up! The firewall was triggered and closed the ports...</h2>
        <p v-if="gameStatus === 'won'">
          You found all {{ targets.length }} services.
        </p>
        <p v-else>
          You failed to find <strong>{{ hotService }}</strong> in time.
        </p>
        <button @click="resetGame">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useTick } from '@/composables/useTick'  // relative path

// --- Configurable settings ---
const startPort       = 20
const endPort         = 1024
const additionalPorts = [1433,1521,3306,3389,5900,8080]
const minTargets      = 10    // min services to find
const maxTargets      = 15    // max services to find
const hotTimeLimit    = 60   // seconds for hot port

// --- Port → service map (20–1024 + extras) ---
const portMap = {
  20: 'FTP Data', 21: 'FTP Control', 22: 'SSH', 23: 'Telnet',
  25: 'SMTP', 53: 'DNS', 67: 'DHCP Server', 68: 'DHCP Client',
  69: 'TFTP', 80: 'HTTP', 88: 'Kerberos', 110: 'POP3',
  119: 'NNTP', 123: 'NTP', 135: 'MS RPC', 137: 'NetBIOS Name',
  138: 'NetBIOS Datagram', 139: 'NetBIOS Session', 143: 'IMAP',
  161: 'SNMP', 162: 'SNMP Trap', 389: 'LDAP', 443: 'HTTPS',
  445: 'SMB', 465: 'SMTPS', 514: 'Syslog', 587: 'SMTP Submission',
  631: 'IPP', 636: 'LDAPS', 873: 'rsync', 993: 'IMAPS',
  995: 'POP3S', 1433: 'MSSQL', 1521: 'Oracle',
  3306: 'MySQL', 3389: 'RDP', 5900: 'VNC', 8080: 'HTTP-Alt'
}

// Build sorted, unique list of all ports we show
const allPorts = Array
  .from({ length: endPort - startPort + 1 }, (_, i) => startPort + i)
  .concat(additionalPorts)
  .filter((v,i,a) => a.indexOf(v) === i)
  .sort((a,b) => a - b)

// Reactive port entries
const ports = reactive(
  allPorts.map(port => ({
    port,
    found:   false,
    tooltip: portMap[port] || null
  }))
)

// Game state refs
const targets    = ref([])       // services to find
const foundSet   = new Set()     // found services
const foundCount = ref(0)
const hotService = ref(null)     // current “hot” service
const timer      = ref(0)
const gameStatus = ref('playing')// 'playing' | 'won' | 'lost'

// --- replace manual interval with our composable tick
const tick = useTick(1000)

// decrement `timer` on each tick when a hot challenge is active
watch(tick, () => {
  if (hotService.value && gameStatus.value === 'playing') {
    timer.value--
    if (timer.value <= 0) {
      gameStatus.value = 'lost'
    }
  }
})

// Pick a random count between minTargets and maxTargets
function pickTargetCount() {
  const totalServices = Object.values(portMap).length
  const range = maxTargets - minTargets + 1
  return Math.min(
    totalServices,
    Math.floor(Math.random() * range) + minTargets
  )
}

// Initialize the list of targets
function initTargets() {
  const services = Object.values(portMap)
  const count = pickTargetCount()
  const chosen = new Set()
  while (chosen.size < count) {
    chosen.add(services[Math.floor(Math.random() * services.length)])
  }
  targets.value = Array.from(chosen)
}

// Trigger a hot challenge (just sets `hotService` and `timer`)
function triggerHot() {
  const remaining = targets.value.filter(s => !foundSet.has(s))
  if (!remaining.length) return
  hotService.value = remaining[Math.floor(Math.random() * remaining.length)]
  timer.value = hotTimeLimit
}

// Reset the entire game
function resetGame() {
  ports.forEach(p => (p.found = false))
  foundSet.clear()
  foundCount.value = 0
  hotService.value = null
  timer.value = 0
  gameStatus.value = 'playing'
  initTargets()
}

// Handle a port click
function scan(entry) {
  if (gameStatus.value !== 'playing') return
  if (!entry.tooltip || entry.found) return

  // No hot active yet?
  if (!hotService.value) {
    if (targets.value.includes(entry.tooltip)) {
      // normal find
      entry.found = true
      foundSet.add(entry.tooltip)
      foundCount.value++
      if (foundCount.value === targets.value.length) {
        gameStatus.value = 'won'
      }
    } else {
      // misclick triggers hot
      triggerHot()
    }
    return
  }

  // Hot is active: must click exactly the hotService
  if (entry.tooltip === hotService.value) {
    entry.found = true
    foundSet.add(entry.tooltip)
    foundCount.value++

    // Replace one *other* unfound target
    const allServices = Object.values(portMap)
    const used = new Set([...targets.value, ...foundSet])
    const candidates = allServices.filter(s => !used.has(s))
    if (candidates.length) {
      const replacement =
        candidates[Math.floor(Math.random() * candidates.length)]
      const unfoundIdxs = targets.value
        .map((svc, idx) => (!foundSet.has(svc) ? idx : -1))
        .filter(idx => idx !== -1)
      if (unfoundIdxs.length) {
        const idxToReplace =
          unfoundIdxs[Math.floor(Math.random() * unfoundIdxs.length)]
        targets.value.splice(idxToReplace, 1, replacement)
      }
    }

    // clear hot state
    hotService.value = null
    timer.value = 0

    if (foundCount.value === targets.value.length) {
      gameStatus.value = 'won'
    }
  }
}

// Lifecycle
onMounted(resetGame)
</script>

<style scoped>
.port-scanner-app {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e2e;
  color: #eee;
  font-family: sans-serif;
}
.ps-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #292939;
  gap: 16px;
}
.ps-header h1 { margin: 0; }
.ps-header button {
  padding: 6px 12px;
  background: #5a2c7b;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.ps-stats {
  margin-left: auto;
  display: flex;
  gap: 12px;
  font-weight: bold;
}
.ps-targets {
  padding: 8px 16px;
  background: #222;
}
.ps-targets h2 {
  margin: 0 0 4px;
  font-size: 0.9rem;
  color: #f5c623;
}
.ps-targets ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.ps-targets li {
  padding: 4px 8px;
  background: #444;
  border-radius: 4px;
  font-size: 0.85rem;
  transition: background 0.2s;
}
.ps-targets li.found {
  background: #27ae60;
  color: #fff;
}
.ps-targets li.hot {
  background: #c0392b;
  color: #fff;
}
.ps-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(60px,1fr));
  gap: 4px;
  padding: 16px;
  overflow-y: auto;
}
.ps-port {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  border-radius: 4px;
  background: #444;
  color: #ccc;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.ps-port.found {
  background: #27ae60;
  color: #fff;
}
/* Tooltip */
.ps-port[data-service]:hover::after {
  content: attr(data-service);
  position: absolute;
  top: -1.6em;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}
.ps-port[data-service]:hover::before {
  content: '';
  position: absolute;
  top: -0.4em;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: #222;
  pointer-events: none;
  z-index: 10;
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
  color: #fff;
  padding: 24px;
  border-radius: 6px;
  text-align: center;
}
.message h2 {
  margin-bottom: 12px;
}
.message button {
  margin-top: 12px;
  padding: 8px 16px;
  background: #5a2c7b;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
