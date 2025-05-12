<template>
  <div class="events-app">
    <!-- Header -->
    <header class="ev-header">
      <h1>City Events Calendar</h1>
    </header>

    <div class="ev-body">
      <!-- Calendar -->
      <div class="cal-section">
        <div class="cal-header">
          <button @click="prevMonth">‹</button>
          <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
          <button @click="nextMonth">›</button>
        </div>
        <div class="cal-grid">
          <div class="cal-day-label" v-for="d in dayLabels" :key="d">{{ d }}</div>

          <!-- blank slots to align first day -->
          <div v-for="(_, i) in blanks" :key="'b'+i" class="cal-cell blank"></div>

          <!-- days -->
          <div
            v-for="day in daysInMonth"
            :key="day"
            class="cal-cell"
            :class="{ 'has-event': hasEvent(day), selected: isSelected(day) }"
            @click="selectDay(day)"
          >
            {{ day }}
          </div>
        </div>
      </div>

      <!-- Events & Form -->
      <div class="ev-section">
        <h2>Events for {{ monthNames[selectedMonth] }} {{ selectedDay }}, {{ selectedYear }}</h2>

        <ul v-if="selectedEvents.length" class="event-list">
          <li v-for="evt in selectedEvents" :key="evt.id" class="event-item">
            <strong>{{ evt.title }}</strong>
            <p class="desc">{{ evt.description }}</p>
          </li>
        </ul>
        <p v-else class="no-events">No events scheduled.</p>

        <h3>Add New Event</h3>
        <form class="ev-form" @submit.prevent="addEvent">
          <label>
            Date:
            <input type="date" v-model="newDate" required />
          </label>
          <label>
            Title:
            <input type="text" v-model="newTitle" placeholder="Event title" required />
          </label>
          <label>
            Description:
            <textarea v-model="newDesc" rows="3" placeholder="Details"></textarea>
          </label>
          <button type="submit">Add Event</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const dayLabels   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const monthNames  = ['January','February','March','April','May','June','July','August','September','October','November','December']

// current calendar view
const today        = new Date()
const currentMonth = ref(today.getMonth())
const currentYear  = ref(today.getFullYear())

// selected day details
const selectedMonth = ref(currentMonth.value)
const selectedYear  = ref(currentYear.value)
const selectedDay   = ref(today.getDate())

// events storage
const events = reactive([])

// blanks before first day
const blanks = computed(() => {
  const firstDow = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return Array(firstDow).fill(null)
})
// days in this month
const daysInMonth = computed(() => {
  const days = new Date(currentYear.value, currentMonth.value+1, 0).getDate()
  return Array.from({ length: days }, (_, i) => i+1)
})

// select a day
function selectDay(day) {
  selectedDay.value   = day
  selectedMonth.value = currentMonth.value
  selectedYear.value  = currentYear.value
  newDate.value       = formatInputDate(selectedYear.value, selectedMonth.value, selectedDay.value)
}

// check if any event on that day
function hasEvent(day) {
  return events.some(e => {
    const d = new Date(e.date)
    return d.getFullYear() === currentYear.value &&
           d.getMonth() === currentMonth.value &&
           d.getDate() === day
  })
}

// highlight selected
function isSelected(day) {
  return day === selectedDay.value &&
         currentMonth.value === selectedMonth.value &&
         currentYear.value === selectedYear.value
}

// navigate months
function prevMonth() {
  let m = currentMonth.value-1, y = currentYear.value
  if (m<0) { m=11; y-- }
  currentMonth.value = m
  currentYear.value  = y
}
function nextMonth() {
  let m = currentMonth.value+1, y = currentYear.value
  if (m>11) { m=0; y++ }
  currentMonth.value = m
  currentYear.value  = y
}

// events for selected day
const selectedEvents = computed(() =>
  events.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === selectedYear.value &&
           d.getMonth() === selectedMonth.value &&
           d.getDate() === selectedDay.value
  })
)

// new event form
const newDate  = ref(formatInputDate(selectedYear.value, selectedMonth.value, selectedDay.value))
const newTitle = ref('')
const newDesc  = ref('')

function formatInputDate(y,m,d) {
  const mm = String(m+1).padStart(2,'0')
  const dd = String(d).padStart(2,'0')
  return `${y}-${mm}-${dd}`
}

function addEvent() {
  events.push({
    id: Date.now(),
    date: newDate.value,
    title: newTitle.value,
    description: newDesc.value
  })
  // clear form
  newTitle.value = ''
  newDesc.value  = ''
}

// seed with dummy events
onMounted(() => {
  events.push(
    { id:1, date: formatInputDate(today.getFullYear(), today.getMonth(), today.getDate()), title: 'Downtown Parade', description: 'Join the city parade at noon.' },
    { id:2, date: formatInputDate(today.getFullYear(), today.getMonth(), today.getDate()+2), title: 'Street Race', description: 'Midnight drag at the docks.' },
    { id:3, date: formatInputDate(today.getFullYear(), today.getMonth(), today.getDate()+5), title: 'Farmers Market', description: 'Fresh produce downtown.' }
  )
})
</script>

<style scoped>
.events-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
  background: #fafafa;
  color: #333;
}
.ev-header {
  background: #b014cf;
  color: #fff;
  padding: 12px;
  text-align: center;
}
.ev-header h1 { margin:0; }

.ev-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Calendar */
.cal-section {
  width: 50%;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}
.cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #eee;
}
.cal-header button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7,1fr);
  grid-auto-rows: 40px;
  text-align: center;
}
.cal-day-label {
  background: #ddd;
  line-height: 40px;
  font-weight: bold;
}
.cal-cell {
  border: 1px solid #eee;
  line-height: 40px;
  cursor: pointer;
  position: relative;
}
.cal-cell.blank {
  background: #f9f9f9;
  cursor: default;
}
.cal-cell.has-event::after {
  content: '';
  width: 8px;
  height: 8px;
  background: #b014cf;
  border-radius: 50%;
  position: absolute;
  bottom: 4px;
  right: 4px;
}
.cal-cell.selected {
  background: #f0e6f6;
  border-color: #b014cf;
}

/* Events & Form */
.ev-section {
  width: 50%;
  padding: 16px;
  overflow-y: auto;
}
.event-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.event-item {
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
}
.event-item .desc {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #555;
}
.no-events {
  font-style: italic;
  color: #777;
  margin-bottom: 16px;
}
.ev-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ev-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}
.ev-form input,
.ev-form textarea {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.ev-form button {
  align-self: flex-start;
  padding: 8px 16px;
  background: #b014cf;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.ev-form button:hover {
  filter: brightness(1.1);
}
</style>
