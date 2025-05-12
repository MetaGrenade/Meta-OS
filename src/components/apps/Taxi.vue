<script setup>
import { ref, reactive, computed } from 'vue'

const role = ref('passenger')            // 'passenger' or 'driver'
const pickup = ref('')                   // passenger input
const dropoff = ref('')
const rideRequests = reactive([])        // store all requests
let nextId = 1

// passenger’s own request
const myRequest = computed(() =>
  rideRequests.find(r => r.passengerName === 'You')
)

// pending rides for drivers
const pendingRequests = computed(() =>
  rideRequests.filter(r => r.status === 'pending')
)
// accepted rides for this driver
const acceptedRequests = computed(() =>
  rideRequests.filter(r => r.status === 'accepted' && r.driverName === 'You')
)

function requestRide() {
  if (!pickup.value || !dropoff.value) return
  // prevent multiple
  if (myRequest.value) return
  rideRequests.push({
    id: nextId++,
    passengerName: 'You',
    pickup: pickup.value,
    dropoff: dropoff.value,
    status: 'pending',
    driverName: null,
    eta: null
  })
  pickup.value = ''
  dropoff.value = ''
}

function acceptRide(id) {
  const r = rideRequests.find(r => r.id === id)
  if (!r || r.status !== 'pending') return
  r.status = 'accepted'
  r.driverName = 'You'
  r.eta = Math.floor(Math.random() * 5) + 2   // random 2–6 min ETA
}

function completeRide(id) {
  const idx = rideRequests.findIndex(r => r.id === id)
  if (idx !== -1) rideRequests.splice(idx, 1)
}
</script>

<template>
  <div class="taxi-app">
    <!-- Role Switch -->
    <div class="role-switch">
      <label>
        <input type="radio" value="passenger" v-model="role" /> Passenger
      </label>
      <label>
        <input type="radio" value="driver"    v-model="role" /> Driver
      </label>
    </div>

    <!-- Passenger View -->
    <div v-if="role === 'passenger'" class="passenger-view">
      <h2>Request a Ride</h2>
      <form @submit.prevent="requestRide">
        <input v-model="pickup"   placeholder="Pickup location" required />
        <input v-model="dropoff"  placeholder="Dropoff location" required />
        <button type="submit">Call Taxi</button>
      </form>

      <div v-if="myRequest" class="my-request">
        <h3>Your Request</h3>
        <p><strong>From:</strong> {{ myRequest.pickup }}</p>
        <p><strong>To:</strong>   {{ myRequest.dropoff }}</p>
        <p v-if="myRequest.status === 'pending'">
          Status: Waiting for driver…
        </p>
        <p v-else>
          <strong>Driver:</strong> {{ myRequest.driverName }}<br/>
          <strong>ETA:</strong> {{ myRequest.eta }} min
        </p>
      </div>
    </div>

    <!-- Driver View -->
    <div v-else class="driver-view">
      <h2>Available Rides</h2>
      <div v-if="pendingRequests.length" class="requests-list">
        <div v-for="r in pendingRequests" :key="r.id" class="request-card">
          <p><strong>Passenger:</strong> {{ r.passengerName }}</p>
          <p><strong>From:</strong> {{ r.pickup }}</p>
          <p><strong>To:</strong>   {{ r.dropoff }}</p>
          <button @click="acceptRide(r.id)">Accept Ride</button>
        </div>
      </div>
      <div v-else class="no-requests">
        No pending requests
      </div>

      <div v-if="acceptedRequests.length" class="accepted-list">
        <h3>Your Active Rides</h3>
        <div v-for="r in acceptedRequests" :key="r.id" class="request-card accepted">
          <p><strong>Passenger:</strong> {{ r.passengerName }}</p>
          <p><strong>From:</strong> {{ r.pickup }}</p>
          <p><strong>To:</strong>   {{ r.dropoff }}</p>
          <p><strong>ETA:</strong> {{ r.eta }} min</p>
          <button @click="completeRide(r.id)">Complete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.taxi-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
  color: #222;
  background: #f5f5f5;
}

/* Role toggle */
.role-switch {
  display: flex;
  gap: 1rem;
  padding: 8px 16px;
  background: #ddd;
}
.role-switch label {
  cursor: pointer;
}
.role-switch input {
  margin-right: 4px;
}

/* PASSENGER */
.passenger-view {
  flex: 1;
  padding: 16px;
}
.passenger-view form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.passenger-view input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.passenger-view button {
  padding: 8px 16px;
  background: #007bff;
  color: #fff;
  border: none; border-radius: 4px;
  cursor: pointer;
}
.passenger-view button:disabled {
  background: #aaa;
  cursor: default;
}
.my-request {
  padding: 12px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* DRIVER */
.driver-view {
  flex: 1;
  padding: 16px;
}
.requests-list,
.accepted-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.request-card {
  padding: 12px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.request-card.accepted {
  border-color: #28a745;
}
.request-card button {
  margin-top: 8px;
  padding: 6px 12px;
  background: #28a745;
  color: #fff;
  border: none; border-radius: 4px;
  cursor: pointer;
}
.request-card.accepted button {
  background: #dc3545;
}
.no-requests {
  font-style: italic;
  color: #666;
}
</style>
