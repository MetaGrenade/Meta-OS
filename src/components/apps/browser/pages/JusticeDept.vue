<template>
  <div class="doj-page">
    <!-- Header -->
    <header class="header">
      <img src="/img/logos/apps/browser/doj.webp" alt="DOJ Logo" />
      <p>“Protecting and serving the people of Los Santos”</p>
    </header>

    <!-- Announcements -->
    <section class="announcements">
      <h2>Latest Announcements</h2>
      <ul>
        <li v-for="a in announcements" :key="a.id">
          <span class="date">{{ a.date }}</span>
          <span class="text">{{ a.text }}</span>
        </li>
      </ul>
    </section>

    <!-- Traffic Tickets -->
    <section class="tickets">
      <h2>Your Traffic Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>Charge</th>
            <th>Fee</th>
            <th>Officer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id">
            <td>{{ t.charge }}</td>
            <td>${{ t.fee }}</td>
            <td>Officer {{ t.officer }}</td>
            <td :class="t.paid ? 'paid' : 'unpaid'">
              {{ t.paid ? 'Paid' : 'Unpaid' }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Criminal History -->
    <section class="history">
      <h2>Your Criminal History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Charge</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in criminalHistory" :key="c.id">
            <td>{{ c.date }}</td>
            <td>{{ c.charge }}</td>
            <td>{{ c.outcome }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// dummy data
const announcements = reactive([
  { id: 1, date: '2025-05-01', text: 'New DUI checkpoints set up across Vinewood.' },
  { id: 2, date: '2025-04-28', text: 'Department looking for witnesses in Downtown heist.' },
  { id: 3, date: '2025-04-25', text: 'Mayor’s cleanup initiative to reduce street racing.' }
])

const tickets = reactive([
  { id: 101, charge: 'Speeding (50→80 MPH)',      fee: 250, officer: 'Jones',   paid: false },
  { id: 102, charge: 'Illegal U-turn',            fee: 100, officer: 'Santiago',paid: true  },
  { id: 103, charge: 'Running Red Light',         fee: 300, officer: 'Mendoza', paid: false }
])

const criminalHistory = reactive([
  { id: 201, date: '2025-03-10', charge: 'Grand Theft Auto',   outcome: 'Bailed'    },
  { id: 202, date: '2025-02-20', charge: 'Assault with a Deadly Weapon', outcome: 'Pending' },
  { id: 203, date: '2024-12-15', charge: 'Possession of Illegal Firearm', outcome: 'Fined'   }
])

// in a real app you might fetch these from your Lua backend
onMounted(() => {
  // e.g. fetch('/doj/announcements').then(...)
})
</script>

<style scoped>
.doj-page {
  font-family: sans-serif;
  color: #eee;
  background: #1b2631;
  padding: 16px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}
.header {
  text-align: center;
  margin-bottom: 24px;
}
.header img {
  width: 250px;
  height: auto;
}
.header p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #ccc;
}

/* Announcements */
.announcements {
  margin-bottom: 24px;
}
.announcements h2 {
  color: #f5c518;
  border-bottom: 2px solid #f5c518;
  padding-bottom: 4px;
}
.announcements ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}
.announcements li {
  display: flex;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #2e3b4e;
}
.announcements .date {
  width: 100px;
  color: #aaa;
  font-size: 0.85rem;
}
.announcements .text {
  flex: 1;
}

/* Tables */
section table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}
section th,
section td {
  padding: 8px;
  border: 1px solid #2e3b4e;
  text-align: left;
  font-size: 0.9rem;
}
section th {
  background: #2e3b4e;
}
.paid {
  color: #27ae60;
}
.unpaid {
  color: #e74c3c;
}

/* Criminal History */
.history h2 {
  color: #f5c518;
  border-bottom: 2px solid #f5c518;
  padding-bottom: 4px;
}
</style>
