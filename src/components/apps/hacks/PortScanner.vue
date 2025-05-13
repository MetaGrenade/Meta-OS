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
          :class="{ 
            found: foundSet.has(svc),
            hot:   svc === hotService 
          }"
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
        <h2 v-if="gameStatus === 'won'">✅ Success!</h2>
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
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue'

// Configuration
const startPort       = 20
const endPort         = 1024
const additionalPorts = [1433,1521,3306,3389,5900,8080]
const hotTimeLimit    = 60  // seconds to find the hot port

// Port → service map (20–1024 + extras)
const portMap = {
  20: 'FTP Data',21:'FTP Control',22:'SSH',23:'Telnet',25:'SMTP',53:'DNS',
  67:'DHCP Server',68:'DHCP Client',69:'TFTP',80:'HTTP',88:'Kerberos',
  110:'POP3',119:'NNTP',123:'NTP',135:'MS RPC',137:'NetBIOS Name',138:'NetBIOS Datagram',139:'NetBIOS Session',
  143:'IMAP',161:'SNMP',162:'SNMP Trap',389:'LDAP',443:'HTTPS',445:'SMB',
  465:'SMTPS',514:'Syslog',587:'SMTP Submission',631:'IPP',636:'LDAPS',873:'rsync',
  993:'IMAPS',995:'POP3S',
  1433:'MSSQL',1521:'Oracle',3306:'MySQL',3389:'RDP',5900:'VNC',8080:'HTTP-Alt'
}

// Build a sorted, deduped list of all ports
const allPorts = Array
  .from({ length: endPort - startPort + 1 }, (_, i) => startPort + i)
  .concat(additionalPorts)
  .filter((v,i,a)=>a.indexOf(v)===i)
  .sort((a,b)=>a-b)

// Reactive port entries
const ports = reactive(
  allPorts.map(port=>({
    port,
    found: false,
    tooltip: portMap[port] || null
  }))
)

// Game state
const targets    = ref([])      // services to find
const foundSet   = new Set()    // set of found services
const foundCount = ref(0)
const hotService = ref(null)    // current “hot” service
const timer      = ref(0)
const gameStatus = ref('playing')

// Internal handles
let hotInterval = null

// Pick 10–15 random services from portMap keys
function initTargets() {
  const services = Object.values(portMap)
  const count = Math.min(services.length, Math.floor(Math.random()*6)+10)
  const chosen = new Set()
  while(chosen.size < count) {
    chosen.add(services[Math.floor(Math.random()*services.length)])
  }
  targets.value = Array.from(chosen)
}

// Start a new hot challenge
function triggerHot() {
  // pick one of the remaining targets
  const remaining = targets.value.filter(s=>!foundSet.has(s))
  if (!remaining.length) return
  hotService.value = remaining[Math.floor(Math.random()*remaining.length)]
  timer.value = hotTimeLimit

  // countdown
  hotInterval && clearInterval(hotInterval)
  hotInterval = setInterval(()=>{
    timer.value--
    if(timer.value<=0) {
      clearInterval(hotInterval)
      gameStatus.value = 'lost'
    }
  },1000)
}

// Reset everything
function resetGame() {
  ports.forEach(p=>p.found=false)
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
  if (gameStatus.value!=='playing') return
  if (!entry.tooltip || entry.found) return

  // If no hot is active: any misclick triggers hot mode
  if (!hotService.value) {
    // Only misclick (clicked a non-target tooltip) triggers hot
    if (targets.value.includes(entry.tooltip)) {
      // Found a listed service normally
      entry.found = true
      foundSet.add(entry.tooltip)
      foundCount.value++
      if (foundCount.value === targets.value.length) {
        gameStatus.value = 'won'
      }
    } else {
      triggerHot()
    }
    return
  }

  // If hot is active: only clicking the hotService counts
  if (entry.tooltip === hotService.value) {
    // succeed hot challenge
    entry.found = true
    foundSet.add(entry.tooltip)
    foundCount.value++
    clearInterval(hotInterval)
    hotService.value = null
    // shuffle remaining targets so order changes
    const rem = targets.value.filter(s=>!foundSet.has(s))
    targets.value = rem.sort(()=>Math.random()-0.5)
    if (foundCount.value === targets.value.length + foundCount.value) {
      // all originally targets found
      gameStatus.value = 'won'
    }
  }
}

// Lifecycle
onMounted(() => {
  resetGame()
})
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
  padding: 6px 12px; background: #5a2c7b; border: none; border-radius: 4px; cursor: pointer;
}
.ps-stats { margin-left: auto; display: flex; gap: 12px; font-weight: bold; }
.ps-targets {
  padding: 8px 16px; background: #222;
}
.ps-targets h2 {
  margin: 0 0 4px; font-size: 0.9rem; color: #f5c623;
}
.ps-targets ul {
  display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0; list-style: none;
}
.ps-targets li {
  padding: 4px 8px; background: #444; border-radius: 4px; font-size: 0.85rem;
}
.ps-targets li.found {
  background: #27ae60; color: #fff;
}
.ps-targets li.hot {
  background: #c0392b;  /* red for the “hot” service */
  color: #fff;
}
.ps-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(60px,1fr));
  gap:4px; padding:16px; overflow-y:auto;
}
.ps-port {
  position: relative; display:flex; align-items:center; justify-content:center;
  height:32px; border-radius:4px; background:#444; color:#ccc; cursor:pointer;
  user-select:none; transition:background .2s;
}
.ps-port.found {
  background:#27ae60; color:#fff;
}
/* Tooltip for ports with data-service */
.ps-port[data-service]:hover::after {
  content: attr(data-service);
  position:absolute; top:-1.6em; left:50%;
  transform:translateX(-50%);
  background:#222; color:#fff; padding:2px 6px; border-radius:3px;
  font-size:0.75rem; white-space:nowrap; pointer-events:none; z-index:10;
}
.ps-port[data-service]:hover::before {
  content:'';
  position:absolute; top:-0.4em; left:50%;
  transform:translateX(-50%);
  border:4px solid transparent; border-bottom-color:#222;
  pointer-events:none; z-index:10;
}
.overlay {
  position:absolute; inset:0; background:rgba(0,0,0,0.8);
  display:flex; align-items:center; justify-content:center;
}
.message {
  background:#222; color:#fff; padding:24px; border-radius:6px; text-align:center;
}
.message h2 { margin-bottom:12px; }
.message button {
  margin-top:12px; padding:8px 16px; background:#5a2c7b; border:none; border-radius:4px; cursor:pointer;
}
</style>
