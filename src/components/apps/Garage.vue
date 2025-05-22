<template>
  <div class="garage-app">
    <header class="ga-header">
      <h1>Player Garage</h1>
    </header>

    <!-- filters -->
    <div class="ga-controls">
      <input
        v-model="searchTerm"
        type="search"
        placeholder="Search by plate or model…"
      />
      <select v-model="statusFilter">
        <option value="">All Statuses</option>
        <option value="In Garage">In Garage</option>
        <option value="Out">Out</option>
        <option value="Insurance">Insurance</option>
      </select>
    </div>

    <!-- grouped listing -->
    <div v-if="!filteredVehicles.length" class="ga-empty">
      No vehicles match your filters.
    </div>
    <div v-else class="ga-list">
      <div
        v-for="(group, loc) in groupedByLocation"
        :key="loc"
        class="ga-group"
      >
        <h2>{{ loc }}</h2>
        <table>
          <thead>
            <tr>
              <th>Plate</th>
              <th>Model</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="veh in group"
              :key="veh.id"
              @click="openDetails(veh)"
              class="ga-row"
            >
              <td>{{ veh.plate }}</td>
              <td>{{ veh.model }}</td>
              <td :class="veh.status.toLowerCase().replace(' ', '-')">
                {{ veh.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <div
      v-if="detailsVeh"
      class="modal-overlay"
      @click.self="detailsVeh = null"
    >
      <div class="modal">
        <h3>Vehicle Details</h3>
        <ul>
          <li><strong>Plate:</strong> {{ detailsVeh.plate }}</li>
          <li><strong>Model:</strong> {{ detailsVeh.model }}</li>
          <li><strong>Status:</strong> {{ detailsVeh.status }}</li>
          <li v-if="detailsVeh.location">
            <strong>Garage:</strong> {{ detailsVeh.location }}
          </li>
        </ul>
        <button @click="detailsVeh = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// raw vehicle list
const vehicles = reactive([])

// filters
const searchTerm   = ref('')
const statusFilter = ref('')

// modal
const detailsVeh = ref(null)

// seed some dummy vehicles
onMounted(() => {
  vehicles.push(
    { id:1, plate: 'SPEEDR',    model: 'Comet SR',        status: 'In Garage', location: 'Central Garage' },
    { id:2, plate: 'PA1NT3D',   model: 'Vagner',          status: 'Out',       location: null },
    { id:3, plate: 'HELI04',    model: 'Frogger',         status: 'Insurance', location: null },
    { id:4, plate: 'TAXI99',    model: 'Taxi',            status: 'In Garage', location: 'Downtown Garage' },
    { id:5, plate: 'INSURE',    model: 'Banshee 900R',    status: 'Out',       location: null },
    { id:6, plate: 'ROCKED',    model: 'Freeway',         status: 'In Garage', location: 'Sandy Shores Garage' }
  )
})

// computed: filtered list
const filteredVehicles = computed(() => {
  return vehicles.filter(v => {
    // search
    const text = `${v.plate} ${v.model}`.toLowerCase()
    if (!text.includes(searchTerm.value.toLowerCase())) return false
    // status
    if (statusFilter.value && v.status !== statusFilter.value) return false
    return true
  })
})

// group “In Garage” by their location, and lump others under their status
const groupedByLocation = computed(() => {
  const groups = {}
  filteredVehicles.value.forEach(v => {
    const key = v.status === 'In Garage'
      ? v.location || 'Unknown Garage'
      : v.status
    if (!groups[key]) groups[key] = []
    groups[key].push(v)
  })
  return groups
})

// open details
function openDetails(v) {
  detailsVeh.value = { ...v }
}
</script>

<style scoped>
.garage-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
  background: #f5f5f5;
  color: #222;
}
.ga-header {
  background: #333;
  color: #fff;
  padding: 1.111vh;
  text-align: center;
}
.ga-controls {
  display: flex;
  gap: 0.741vh;
  padding: 0.741vh;
  background: #fff;
}
.ga-controls input,
.ga-controls select {
  padding: 0.556vh;
  border: 0.093vh solid #aaa;
  border-radius: 0.37vh;
}
.ga-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 1.481vh;
}
.ga-group {
  margin-bottom: 2.222vh;
}
.ga-group h2 {
  margin-bottom: 0.741vh;
  color: #444;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.741vh;
  border: 0.093vh solid #ddd;
  text-align: left;
}
th {
  background: #eee;
}
td.out {
  color: #c00;
}
td.insurance {
  color: #b80;
}
td.in-garage {
  color: #007bff;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  padding: 1.481vh;
  border-radius: 0.556vh;
  width: 25.926vh;
}
.modal h3 {
  margin-top: 0;
}
.modal ul {
  padding-left: 1.481vh;
}
.modal button {
  margin-top: 1.111vh;
  padding: 0.556vh 1.111vh;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
}
</style>
