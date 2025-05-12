<script setup>
import { ref, computed, onMounted } from 'vue'

// Dummy IP data
const ips = ref([])

// Seed with some example IPs
onMounted(() => {
  ips.value = [
    { id: 1, address: '203.0.113.5',   location: 'New York, USA', price: 2, purchased: true,  connected: false },
    { id: 2, address: '198.51.100.22', location: 'London, UK',    price: 3, purchased: false, connected: false },
    { id: 3, address: '203.0.113.45',  location: 'Tokyo, JP',     price: 4, purchased: false, connected: false },
    { id: 4, address: '198.51.100.77', location: 'Sydney, AU',    price: 3, purchased: false, connected: false }
  ]
})

// Compute the one IP that’s currently connected
const currentConnection = computed(() => ips.value.find(ip => ip.connected) || null)

// Buy an IP
function purchaseIp(id) {
  const ip = ips.value.find(i => i.id === id)
  if (ip && !ip.purchased) {
    ip.purchased = true
    // Optionally auto-connect free IPs: if (ip.price === 0) toggleConnection(id)
  }
}

// Toggle connection to exactly one IP at a time
function toggleConnection(id) {
  const ip = ips.value.find(i => i.id === id)
  if (!ip || !ip.purchased) return

  // If already connected, disconnect it
  if (ip.connected) {
    ip.connected = false
    return
  }

  // Otherwise disconnect any other, then connect this one
  ips.value.forEach(i => i.connected = false)
  ip.connected = true
}

// Disconnect any active connection
function disconnectAll() {
  ips.value.forEach(i => i.connected = false)
}
</script>

<template>
  <div class="vpn-app">
    <!-- Header / Status -->
    <header class="vpn-header">
      <h2>💩 Security</h2>
      <div class="status">
        <strong>Status:</strong>
        <span v-if="currentConnection">Connected to {{ currentConnection.address }}</span>
        <span v-else>Disconnected</span>
        <button v-if="currentConnection" @click="disconnectAll">Disconnect</button>
      </div>
    </header>

    <!-- Available IPs -->
    <section class="ip-list">
      <h3>Available IPs</h3>
      <table>
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Location</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ip in ips" :key="ip.id">
            <td>{{ ip.address }}</td>
            <td>{{ ip.location }}</td>
            <td>{{ ip.purchased ? '—' : `$${ip.price}` }}</td>
            <td class="actions">
              <!-- Buy if not purchased -->
              <button
                v-if="!ip.purchased"
                @click="purchaseIp(ip.id)"
                class="buy-btn"
              >
                Buy
              </button>

              <!-- Connect / Disconnect if purchased -->
              <button
                v-else
                :class="ip.connected ? 'disconnect-btn' : 'connect-btn'"
                @click="toggleConnection(ip.id)"
              >
                {{ ip.connected ? 'Disconnect' : 'Connect' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.vpn-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  color: #eee;
  font-family: sans-serif;
}

/* Header & status */
.vpn-header {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #44445a;
}
.vpn-header h2 {
  margin: 0;
  color: #b014cf;
}
.status {
  display: flex;
  align-items: center;
  gap: 12px;
}
.status button {
  padding: 4px 8px;
  background: #cf2020;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.status button:hover {
  filter: brightness(1.1);
}

/* IP list */
.ip-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.ip-list h3 {
  margin-top: 0;
  color: #fff;
}
.ip-list table {
  width: 100%;
  border-collapse: collapse;
}
.ip-list th,
.ip-list td {
  padding: 8px;
  border-bottom: 1px solid #44445a;
  text-align: left;
}
.ip-list th {
  background: rgba(0, 0, 0, 0.25);
}
.actions {
  display: flex;
  gap: 8px;
}

/* Buy button */
.buy-btn {
  background: #5a2c7b;
  color: #fff;
}
.buy-btn:disabled {
  background: #333;
  color: #777;
  cursor: default;
}

/* Connect button (green) */
.connect-btn {
  background: #3a6b3a;
  color: #fff;
}
.connect-btn:hover {
  filter: brightness(1.1);
}

/* Disconnect button (red) */
.disconnect-btn {
  background: #cf2020;
  color: #fff;
}
.disconnect-btn:hover {
  filter: brightness(1.1);
}

.actions button:disabled {
  background: #333 !important;
  color: #777 !important;
  cursor: default;
}
</style>
