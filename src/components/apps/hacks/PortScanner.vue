<template>
  <div class="port-scanner-app">
    <!-- Header & Controls -->
    <header class="ps-header">
      <h1>Port Scanner</h1>
      <button @click="resetGame">Reset</button>
      <div class="ps-stats">
        <div>Found: {{ foundCount }} / {{ targets.length }}</div>
        <div>Fails: {{ failCount }} / {{ maxFails }}</div>
      </div>
    </header>

    <!-- Target List -->
    <section class="ps-targets">
      <h2>Find These Services:</h2>
      <ul>
        <li
          v-for="svc in targets"
          :key="svc"
          :class="{ found: foundSet.has(svc) }"
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
        :class="{
          found: entry.found,
          failed: entry.failed
        }"
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
        <h2 v-else>❌ Scan Failed</h2>
        <p v-if="gameStatus === 'won'">
          You found all {{ targets.length }} services.
        </p>
        <p v-else>
          You had {{ failCount }} wrong clicks. Try again?
        </p>
        <button @click="resetGame">Play Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// --- Configuration ---
const startPort       = 20
const endPort         = 1024
const additionalPorts = [1433, 1521, 3306, 3389, 5900, 8080]
const maxFails        = 5

// full port → service map (only ports 20–1024 and your additional ones)
const portMap = {
  20:  'FTP Data',
  21:  'FTP Control',
  22:  'SSH',
  23:  'Telnet',
  25:  'SMTP',
  53:  'DNS',
  67:  'DHCP Server',
  68:  'DHCP Client',
  69:  'TFTP',
  80:  'HTTP',
  88:  'Kerberos',
  110: 'POP3',
  119: 'NNTP',
  123: 'NTP',
  135: 'MS RPC',
  137: 'NetBIOS Name',
  138: 'NetBIOS Datagram',
  139: 'NetBIOS Session',
  143: 'IMAP',
  161: 'SNMP',
  162: 'SNMP Trap',
  389: 'LDAP',
  443: 'HTTPS',
  445: 'SMB',
  465: 'SMTPS',
  514: 'Syslog',
  587: 'SMTP Submission',
  631: 'IPP (Printing)',
  636: 'LDAPS',
  873: 'rsync',
  993: 'IMAPS',
  995: 'POP3S',
  // additional
  1433: 'MSSQL',
  1521: 'Oracle',
  3306: 'MySQL',
  3389: 'RDP',
  5900: 'VNC',
  8080: 'HTTP-Alt'
}

// 1) build the full, unique, sorted port list
const allPortsList = Array
  .from({ length: endPort - startPort + 1 }, (_, i) => startPort + i)
  .concat(additionalPorts)
  .filter((v, i, a) => a.indexOf(v) === i)      // de-duplicate
  .sort((a, b) => a - b)

// 2) reactive state for each port cell
const ports = reactive(
  allPortsList.map(port => ({
    port,
    found:   false,
    failed:  false,
    tooltip: portMap[port] || null
  }))
)

const targets    = ref([])
const foundSet   = new Set()
const foundCount = ref(0)
const failCount  = ref(0)
const gameStatus = ref('playing')

// pick 10–15 random services from our portMap (only those that actually exist)
function initTargets() {
  const services = allPortsList
    .map(p => portMap[p])
    .filter(Boolean)
  const count = Math.min(services.length, Math.floor(Math.random() * 6) + 10)
  const chosen = new Set()
  while (chosen.size < count) {
    chosen.add(services[Math.floor(Math.random() * services.length)])
  }
  targets.value = Array.from(chosen)
}

// reset everything
function resetGame() {
  ports.forEach(p => {
    p.found   = false
    p.failed  = false
    // tooltip already set at creation
  })
  foundSet.clear()
  foundCount.value = 0
  failCount.value  = 0
  gameStatus.value = 'playing'
  initTargets()
}

// user clicks a port
function scan(entry) {
  if (gameStatus.value !== 'playing') return
  if (!entry.tooltip || entry.found || entry.failed) return

  if (targets.value.includes(entry.tooltip)) {
    entry.found = true
    foundSet.add(entry.tooltip)
    foundCount.value++
    if (foundCount.value === targets.value.length) {
      gameStatus.value = 'won'
    }
  } else {
    entry.failed = true
    failCount.value++
    if (failCount.value >= maxFails) {
      gameStatus.value = 'lost'
    }
  }
}

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
/* Header */
.ps-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #292939;
  gap: 16px;
}
.ps-header h1 {
  margin: 0;
}
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
/* Target List */
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
}
.ps-targets li.found {
  background: #27ae60;
  color: #fff;
}
/* Grid */
.ps-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px,1fr));
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
.ps-port.failed {
  background: #c0392b;
  color: #fff;
}
/* Tooltip for all tooltip-enabled ports */
.ps-port[data-service]:hover::after {
  content: attr(data-service);
  position: absolute;
  top: -1.6em; left: 50%;
  transform: translateX(-50%);
  background: #222; color: #fff;
  padding: 2px 6px; border-radius: 3px;
  font-size: 0.75rem; white-space: nowrap;
  pointer-events: none; z-index: 10;
}
.ps-port[data-service]:hover::before {
  content: '';
  position: absolute;
  top: -0.4em; left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: #222;
  pointer-events: none; z-index: 10;
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
