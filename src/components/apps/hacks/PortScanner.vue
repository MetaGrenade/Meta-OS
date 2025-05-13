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
        <h2 v-if="gameStatus === 'won'">✅ You’re a Scanner Pro!</h2>
        <h2 v-else>❌ You Failed</h2>
        <p v-if="gameStatus === 'won'">
          You found all {{ targets.length }} services.
        </p>
        <p v-else>
          You didn't find <strong>{{ hotService }}</strong> in time.
        </p>
        <button @click="resetGame">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// --- Configurable settings ---
const startPort       = 20
const endPort         = 1024
const additionalPorts = [1433,1521,3306,3389,5900,8080]
const minTargets      = 3    // minimum services to find each round
const maxTargets      = 5   // maximum services to find each round
const hotTimeLimit    = 60   // seconds to find the hot port

// --- Port → service map (only ports 20–1024 + extras) ---
const portMap = {
  20: 'FTP Data', 21: 'FTP Control', 22: 'SSH', 23: 'Telnet',
  25: 'SMTP', 53: 'DNS', 67: 'DHCP Server', 68: 'DHCP Client',
  69: 'TFTP', 80: 'HTTP', 88: 'Kerberos', 110: 'POP3',
  119: 'NNTP', 123: 'NTP', 135: 'MS RPC', 137: 'NetBIOS Name',
  138: 'NetBIOS Datagram', 139: 'NetBIOS Session', 143: 'IMAP',
  161: 'SNMP', 162: 'SNMP Trap', 389: 'LDAP', 443: 'HTTPS',
  445: 'SMB', 465: 'SMTPS', 514: 'Syslog', 587: 'SMTP Submission',
  631: 'IPP', 636: 'LDAPS', 873: 'rsync', 993: 'IMAPS',
  995: 'POP3S',
  1433: 'MSSQL', 1521: 'Oracle', 3306: 'MySQL',
  3389: 'RDP', 5900: 'VNC', 8080: 'HTTP-Alt'
}

// --- Build full, unique, sorted port list ---
const allPorts = Array
  .from({ length: endPort - startPort + 1 }, (_, i) => startPort + i)
  .concat(additionalPorts)
  .filter((v,i,a) => a.indexOf(v) === i)
  .sort((a,b) => a - b)

// --- Reactive port entries ---
const ports = reactive(
  allPorts.map(port => ({
    port,
    found: false,
    tooltip: portMap[port] || null
  }))
)

// --- Game state ---
const targets    = ref([])       // list of service names to find
const foundSet   = new Set()     // services already found
const foundCount = ref(0)
const hotService = ref(null)     // current “hot” service
const timer      = ref(0)
const gameStatus = ref('playing')// 'playing' | 'won' | 'lost'

// internal interval handle
let hotInterval = null

// --- Helpers ---

// Pick a random number between minTargets and maxTargets (inclusive)
function pickTargetCount() {
  const range = maxTargets - minTargets + 1
  return Math.min(
    Object.keys(portMap).length,
    Math.floor(Math.random() * range) + minTargets
  )
}

// Initialize the list of targets to find this round
function initTargets() {
  const services = Object.values(portMap)
  const count = pickTargetCount()
  const chosen = new Set()
  while (chosen.size < count) {
    const svc = services[Math.floor(Math.random() * services.length)]
    chosen.add(svc)
  }
  targets.value = Array.from(chosen)
}

// Start a “hot” challenge for one remaining service
function triggerHot() {
  const remaining = targets.value.filter(s => !foundSet.has(s))
  if (!remaining.length) return
  hotService.value = remaining[Math.floor(Math.random() * remaining.length)]
  timer.value = hotTimeLimit

  clearInterval(hotInterval)
  hotInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(hotInterval)
      gameStatus.value = 'lost'
    }
  }, 1000)
}

// Reset the entire game
function resetGame() {
  ports.forEach(p => p.found = false)
  foundSet.clear()
  foundCount.value = 0
  hotService.value = null
  timer.value = 0
  gameStatus.value = 'playing'
  clearInterval(hotInterval)
  initTargets()
}

// Handle a port click
function scan(entry) {
  if (gameStatus.value !== 'playing') return
  if (!entry.tooltip || entry.found) return

  // No hot active yet?
  if (!hotService.value) {
    // If it’s a valid target, mark found normally
    if (targets.value.includes(entry.tooltip)) {
      entry.found = true
      foundSet.add(entry.tooltip)
      foundCount.value++
      if (foundCount.value === targets.value.length) {
        gameStatus.value = 'won'
      }
    } else {
      // misclick: trigger hot challenge
      triggerHot()
    }
    return
  }

  // Hot is active: only clicking the hotService succeeds
  if (entry.tooltip === hotService.value) {
    entry.found = true
    foundSet.add(entry.tooltip)
    foundCount.value++
    clearInterval(hotInterval)
    hotService.value = null
    // Shuffle the remaining targets to change order
    const rem = targets.value.filter(s => !foundSet.has(s))
    targets.value = rem.sort(() => Math.random() - 0.5)
    if (foundCount.value === targets.value.length + foundCount.value) {
      gameStatus.value = 'won'
    }
  }
}

// Lifecycle hooks
onMounted(resetGame)
onUnmounted(() => clearInterval(hotInterval))
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
/* Tooltip for ports with data-service */
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
