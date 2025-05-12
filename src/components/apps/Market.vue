<template>
  <div class="market-app">
    <!-- Tab Navigation -->
    <nav class="tabs">
      <button
        v-for="t in tabs"
        :key="t"
        :class="{ active: tab === t }"
        @click="tab = t"
      >{{ t }}</button>
    </nav>

    <!-- For Sale Tab -->
    <section v-if="tab === 'For Sale'" class="tab-content">
      <h2>Post an Item for Sale</h2>
      <form class="post-form" @submit.prevent="postSale">
        <input v-model="saleTitle" placeholder="Title" required />
        <input v-model="salePrice" type="number" min="0" placeholder="Price" required />
        <textarea v-model="saleDesc" placeholder="Description" required></textarea>
        <button type="submit">List for ${{ salePrice }}</button>
      </form>

      <h2>Items for Sale</h2>
      <div class="listings">
        <div
          v-for="item in salesItems"
          :key="item.id"
          class="card"
        >
          <h3>{{ item.title }}</h3>
          <p class="desc">{{ item.description }}</p>
          <div class="meta">
            <span class="seller">Seller: {{ item.seller }}</span>
            <span class="price">${{ item.price }}</span>
          </div>
          <button
            @click="buyItem(item.id)"
            :disabled="item.sold"
          >{{ item.sold ? 'Sold' : 'Buy' }}</button>
        </div>
      </div>
    </section>

    <!-- Auctions Tab -->
    <section v-if="tab === 'Auctions'" class="tab-content">
      <h2>Start an Auction</h2>
      <form class="post-form" @submit.prevent="postAuction">
        <input v-model="aucTitle" placeholder="Title" required />
        <input v-model="aucStartBid" type="number" min="0" placeholder="Starting Bid" required />
        <input v-model="aucDuration" type="number" min="1" placeholder="Duration (min)" required />
        <textarea v-model="aucDesc" placeholder="Description" required></textarea>
        <button type="submit">Create Auction</button>
      </form>

      <h2>Ongoing Auctions</h2>
      <div class="listings">
        <div
          v-for="auc in auctionItems"
          :key="auc.id"
          class="card"
          :class="{ ended: timeRemaining(auc) === '00:00:00' }"
        >
          <h3>{{ auc.title }}</h3>
          <p class="desc">{{ auc.description }}</p>
          <div class="meta">
            <span>Seller: {{ auc.seller }}</span>
            <span>Current Bid: ${{ auc.currentBid }}</span>
            <span>Ends In: {{ timeRemaining(auc) }}</span>
          </div>
          <div class="bid-row" v-if="timeRemaining(auc) !== '00:00:00'">
            <input
              v-model.number="auc.bidAmount"
              type="number"
              :min="auc.currentBid + 1"
              placeholder="Your Bid"
            />
            <button
              @click="placeBid(auc.id)"
              :disabled="!auc.bidAmount || auc.bidAmount <= auc.currentBid"
            >Bid</button>
          </div>
          <div v-else class="ended-label">Auction ended</div>
        </div>
      </div>
    </section>

    <!-- Wanted Tab -->
    <section v-if="tab === 'Wanted'" class="tab-content">
      <h2>Post a Wanted Ad</h2>
      <form class="post-form" @submit.prevent="postWanted">
        <input v-model="wantTitle" placeholder="What are you looking for?" required />
        <textarea v-model="wantDesc" placeholder="Details" required></textarea>
        <button type="submit">Post Ad</button>
      </form>

      <h2>Wanted Ads</h2>
      <div class="listings">
        <div v-for="ad in wantedPosts" :key="ad.id" class="card">
          <h3>{{ ad.title }}</h3>
          <p class="desc">{{ ad.description }}</p>
          <span class="seller">Seeker: {{ ad.seeker }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// Tabs
const tabs = ['For Sale','Auctions','Wanted']
const tab  = ref('For Sale')

// --- For Sale ---
const salesItems = reactive([])
let saleId = 1
const saleTitle = ref('')
const salePrice = ref(0)
const saleDesc  = ref('')

function postSale() {
  salesItems.push({
    id: saleId++,
    title: saleTitle.value,
    price: salePrice.value,
    description: saleDesc.value,
    seller: 'You',
    sold: false
  })
  saleTitle.value = ''
  salePrice.value = 0
  saleDesc.value = ''
}

function buyItem(id) {
  const itm = salesItems.find(i=>i.id===id)
  if (itm) itm.sold = true
}

// --- Auctions ---
const auctionItems = reactive([])
let auctionId = 1
const aucTitle    = ref('')
const aucStartBid = ref(0)
const aucDuration = ref(1)  // minutes
const aucDesc     = ref('')

function postAuction() {
  const now = Date.now()
  auctionItems.push({
    id:           auctionId++,
    title:        aucTitle.value,
    description:  aucDesc.value,
    seller:       'You',
    currentBid:   aucStartBid.value,
    bidAmount:    null,
    endTime:      now + aucDuration.value * 60000
  })
  aucTitle.value = ''
  aucStartBid.value = 0
  aucDuration.value = 1
  aucDesc.value = ''
}

// return HH:MM:SS until auction.endTime
function timeRemaining(auc) {
  const diff = Math.max(0, auc.endTime - Date.now()) / 1000
  const h = String(Math.floor(diff/3600)).padStart(2,'0')
  const m = String(Math.floor((diff%3600)/60)).padStart(2,'0')
  const s = String(Math.floor(diff%60)).padStart(2,'0')
  return `${h}:${m}:${s}`
}

function placeBid(id) {
  const auc = auctionItems.find(a=>a.id===id)
  if (auc && auc.bidAmount > auc.currentBid && timeRemaining(auc) !== '00:00:00') {
    auc.currentBid = auc.bidAmount
    auc.bidAmount = null
  }
}

// keep auctions ticking so timeRemaining updates
let tick
onMounted(() => {
  tick = setInterval(() => {
    // force reactivity
    auctionItems.forEach(a=>a.endTime=a.endTime)
  }, 1000)
})
onUnmounted(() => clearInterval(tick))

// --- Wanted Ads ---
const wantedPosts = reactive([])
let wantId = 1
const wantTitle = ref('')
const wantDesc  = ref('')

function postWanted() {
  wantedPosts.push({
    id: wantId++,
    title: wantTitle.value,
    description: wantDesc.value,
    seeker: 'You'
  })
  wantTitle.value = ''
  wantDesc.value = ''
}
</script>

<style scoped>
.market-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
  background: #f0f0f0;
  color: #333;
}

/* Tabs */
.tabs {
  display: flex;
  background: #ddd;
}
.tabs button {
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.tabs button.active {
  background: #fff;
  border-bottom: 2px solid #007bff;
}
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Post forms */
.post-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.post-form input,
.post-form textarea {
  padding: 8px;
  border: 1px solid #aaa;
  border-radius: 4px;
}
.post-form button {
  align-self: flex-start;
  padding: 8px 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Listings grid */
.listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.card {
  background: #fff;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}
.card h3 {
  margin: 0 0 4px;
}
.desc {
  flex: 1;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
.meta {
  font-size: 0.85rem;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card button {
  padding: 6px 12px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.card button:disabled {
  background: #aaa;
  cursor: default;
}

/* Auction specifics */
.card.ended {
  opacity: 0.6;
}
.bid-row {
  display: flex;
  gap: 4px;
}
.bid-row input {
  flex: 1;
  padding: 6px;
  border: 1px solid #aaa;
  border-radius: 4px;
}
.bid-row button {
  background: #ffc107;
}
.ended-label {
  color: #a00;
  font-weight: bold;
  text-align: center;
}
</style>
