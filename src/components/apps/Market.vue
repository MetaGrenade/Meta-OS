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
        <input
          v-model.number="aucStartBid"
          type="number"
          min="0"
          placeholder="Starting Bid"
          required
        />
        <input
          v-model.number="aucDuration"
          type="number"
          min="1"
          placeholder="Duration (min)"
          required
        />
        <textarea v-model="aucDesc" placeholder="Description" required />
        <button type="submit">Create Auction</button>
      </form>

      <h2>Ongoing Auctions</h2>
      <div class="listings">
        <div
          v-for="auc in liveAuctions"
          :key="auc.id"
          class="card"
          :class="{ ended: auc.remaining === '00:00:00' }"
        >
          <h3>{{ auc.title }}</h3>
          <p class="desc">{{ auc.description }}</p>
          <div class="meta">
            <span>Seller: {{ auc.seller }}</span>
            <span>Current Bid: ${{ auc.currentBid }}</span>
            <span>Ends In: {{ auc.remaining }}</span>
          </div>

          <div v-if="auc.remaining !== '00:00:00'" class="bid-row">
            <input
              v-model.number="auc.bidAmount"
              type="number"
              :min="auc.currentBid + 1"
              placeholder="Your Bid"
            />
            <button
              @click="placeBid(auc.id, auc.bidAmount)"
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
import { ref, reactive, computed } from 'vue'
import { useTick } from '@/composables/useTick'

// Tabs
const tabs = ['For Sale','Auctions','Wanted']
const tab  = ref('Auctions')

// --- For Sale state ---
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
  const itm = salesItems.find(i => i.id === id)
  if (itm) itm.sold = true
}

// --- Auctions state ---
const auctionItems = reactive([])
let auctionId      = 1
const aucTitle     = ref('')
const aucStartBid  = ref(0)
const aucDuration  = ref(1)  // minutes
const aucDesc      = ref('')

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
  aucTitle.value    = ''
  aucStartBid.value = 0
  aucDuration.value = 1
  aucDesc.value     = ''
}

function placeBid(id, amount) {
  const auc = auctionItems.find(a => a.id === id)
  if (auc && amount > auc.currentBid) {
    auc.currentBid = amount
    auc.bidAmount  = null
  }
}

// --- Wanted Ads state ---
const wantedPosts = reactive([])
let wantId        = 1
const wantTitle   = ref('')
const wantDesc    = ref('')

function postWanted() {
  wantedPosts.push({
    id:          wantId++,
    title:       wantTitle.value,
    description: wantDesc.value,
    seeker:      'You'
  })
  wantTitle.value = ''
  wantDesc.value  = ''
}

// Reactive “heartbeat” every second
const tick = useTick(1000)

// Build liveAuctions so each tick re-computes remaining time
const liveAuctions = computed(() => {
  // touch tick to trigger recompute each second
  tick.value

  return auctionItems.map(auc => {
    const diffSec = Math.max(0, auc.endTime - Date.now()) / 1000
    const h = String(Math.floor(diffSec / 3600)).padStart(2, '0')
    const m = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0')
    const s = String(Math.floor(diffSec % 60)).padStart(2, '0')
    return {
      ...auc,
      remaining: `${h}:${m}:${s}`
    }
  })
})
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
  padding: 0.741vh;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.tabs button.active {
  background: #fff;
  border-bottom: 0.185vh solid #007bff;
}
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.481vh;
}

/* Post forms */
.post-form {
  display: flex;
  flex-direction: column;
  gap: 0.741vh;
  margin-bottom: 1.481vh;
}
.post-form input,
.post-form textarea {
  padding: 0.741vh;
  border: 0.093vh solid #aaa;
  border-radius: 0.37vh;
}
.post-form button {
  align-self: flex-start;
  padding: 0.741vh 1.481vh;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
}

/* Listings grid */
.listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20.37vh, 1fr));
  gap: 1.481vh;
}
.card {
  background: #fff;
  padding: 1.111vh;
  border: 0.093vh solid #ccc;
  border-radius: 0.556vh;
  display: flex;
  flex-direction: column;
}
.card h3 {
  margin: 0 0 0.37vh;
}
.desc {
  flex: 1;
  font-size: 1.296vh;
  margin-bottom: 0.741vh;
}
.meta {
  font-size: 1.111vh;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.741vh;
}
.card button {
  padding: 0.556vh 1.111vh;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 0.37vh;
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
  gap: 0.37vh;
}
.bid-row input {
  flex: 1;
  padding: 0.556vh;
  border: 0.093vh solid #aaa;
  border-radius: 0.37vh;
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
