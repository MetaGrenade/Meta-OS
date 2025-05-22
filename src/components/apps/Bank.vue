<template>
  <div class="bank-app">
    <!-- Header / Balance -->
    <header class="bank-header">
      <h1>Maze Bank</h1>
      <div class="balance">
        Balance: <strong>{{ formatCurrency(balance) }}</strong>
      </div>
    </header>

    <div class="bank-body">
      <!-- Actions -->
      <section class="bank-actions">
        <div class="action-card">
          <h2>Deposit</h2>
          <input v-model.number="depositAmt" type="number" min="0" placeholder="$ Amount" />
          <button @click="deposit" :disabled="!depositAmt">Deposit</button>
        </div>
        <div class="action-card">
          <h2>Withdraw</h2>
          <input v-model.number="withdrawAmt" type="number" :max="balance" min="0" placeholder="$ Amount" />
          <button @click="withdraw" :disabled="!withdrawAmt || withdrawAmt > balance">Withdraw</button>
        </div>
        <div class="action-card transfer-card">
          <h2>Transfer</h2>
          <input v-model="transferTo" type="text" placeholder="Recipient name" />
          <input v-model.number="transferAmt" type="number" :max="balance" min="0" placeholder="$ Amount" />
          <button @click="transfer" :disabled="!transferTo || !transferAmt || transferAmt > balance">
            Send
          </button>
        </div>
      </section>

      <!-- Transaction History -->
      <section class="history">
        <h2>Transaction History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Type</th><th>Amount</th><th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id">
              <td>{{ formatTime(tx.date) }}</td>
              <td :class="tx.type">{{ tx.type }}</td>
              <td :class="tx.type">{{ formatCurrency(tx.amount) }}</td>
              <td>{{ tx.details }}</td>
            </tr>
            <tr v-if="!transactions.length">
              <td colspan="4" class="no-trans">No transactions yet.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const balance = ref(5000)    // starting balance
const depositAmt = ref(0)
const withdrawAmt = ref(0)
const transferAmt = ref(0)
const transferTo = ref('')

const transactions = reactive([])  // { id, type, amount, date, details }

let nextTxId = 1

function formatCurrency(val) {
  return '$' + val.toLocaleString(undefined, { minimumFractionDigits: 2 })
}
function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString([], {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function addTx(type, amount, details) {
  transactions.unshift({
    id: nextTxId++,
    type,
    amount,
    date: new Date().toISOString(),
    details
  })
}

function deposit() {
  if (depositAmt.value <= 0) return
  balance.value += depositAmt.value
  addTx('Deposit', depositAmt.value, 'Cash deposit')
  depositAmt.value = 0
}

function withdraw() {
  if (withdrawAmt.value <= 0 || withdrawAmt.value > balance.value) return
  balance.value -= withdrawAmt.value
  addTx('Withdrawal', -withdrawAmt.value, 'ATM withdrawal')
  withdrawAmt.value = 0
}

function transfer() {
  if (!transferTo.value.trim() || transferAmt.value <= 0 || transferAmt.value > balance.value) return
  balance.value -= transferAmt.value
  addTx('Transfer', -transferAmt.value, `To ${transferTo.value}`)
  // could also record a credit to the recipient separately
  transferAmt.value = 0
  transferTo.value = ''
}
</script>

<style scoped>
.bank-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f9fa;
  font-family: sans-serif;
  color: #333;
}

/* Header */
.bank-header {
  background: #003a6d;
  color: #fff;
  padding: 1.481vh;
  text-align: center;
}
.bank-header h1 {
  margin: 0;
  font-size: 1.8rem;
}
.balance {
  margin-top: 0.741vh;
  font-size: 1.2rem;
}

/* Body */
.bank-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.481vh;
}

/* Actions */
.bank-actions {
  display: flex;
  gap: 1.481vh;
  margin-bottom: 2.222vh;
  flex-wrap: wrap;
}
.action-card {
  background: #fff;
  border: 0.093vh solid #ccc;
  border-radius: 0.741vh;
  padding: 1.111vh;
  flex: 1;
  min-width: 18.519vh;
  display: flex;
  flex-direction: column;
}
.transfer-card {
  flex: 2;
}
.action-card h2 {
  margin: 0 0 0.741vh;
  color: #003a6d;
}
.action-card input {
  margin-bottom: 0.741vh;
  padding: 0.741vh;
  font-size: 1rem;
  border: 0.093vh solid #999;
  border-radius: 0.37vh;
}
.action-card button {
  padding: 0.741vh;
  background: #ffd700;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
  font-weight: bold;
  color: #003a6d;
}
.action-card button:disabled {
  background: #ddd;
  cursor: default;
}

/* History */
.history {
  flex: 1;
  overflow-y: auto;
}
.history h2 {
  margin: 0 0 0.741vh;
  color: #003a6d;
}
.history table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}
.history th,
.history td {
  padding: 0.741vh;
  border-bottom: 0.093vh solid #ccc;
  text-align: left;
}
.history th {
  background: #e9ecef;
}
.history .Deposit {
  color: #006400;
}
.history .Withdrawal,
.history .Transfer {
  color: #a00;
}
.no-trans {
  text-align: center;
  padding: 1.481vh;
  color: #777;
}
</style>
