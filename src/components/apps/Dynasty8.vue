<template>
  <div class="dynasty8-app">
    <!-- Header -->
    <header class="header">
      <img src="/img/logos/apps/dynasty8.webp" alt="Dynasty 8 - The best move you'll ever make!" />
    </header>

    <!-- Properties Grid -->
    <section class="property-grid">
      <div
        v-for="property in properties"
        :key="property.id"
        class="property-card"
      >
        <img :src="property.image" alt="" class="property-image" />
        <div class="property-info">
          <h3 class="property-name">{{ property.name }}</h3>
          <span class="property-type">{{ property.type }}</span>
          <div class="property-location">{{ property.location }}</div>
          <div class="property-price">{{ formatPrice(property.price) }}</div>
          <button class="details-btn">View Details</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const properties = ref([
  {
    id: 1,
    name: 'Rockford Hills Manor',
    type: 'Residential',
    location: 'Rockford Hills',
    price: 3500000,
    image: '/img/properties/residential.png'
  },
  {
    id: 2,
    name: 'Vespucci Boulevard Mall',
    type: 'Commercial',
    location: 'Vespucci Canals',
    price: 1200000,
    image: '/img/properties/commercial.png'
  },
  {
    id: 3,
    name: 'Sandy Shores Depot',
    type: 'Industrial',
    location: 'Sandy Shores',
    price:  800000,
    image: '/img/properties/industrial.png'
  },
  {
    id: 4,
    name: 'Del Perro Heights Condo',
    type: 'Residential',
    location: 'Del Perro',
    price: 2250000,
    image: '/img/properties/residential.png'
  },
  {
    id: 5,
    name: 'Downtown Office Tower',
    type: 'Commercial',
    location: 'Downtown Los Santos',
    price: 3000000,
    image: '/img/properties/commercial.png'
  },
  {
    id: 6,
    name: 'Elysian Island Warehouse',
    type: 'Industrial',
    location: 'Elysian Island',
    price:  950000,
    image: '/img/properties/industrial.png'
  }
])

function formatPrice(val) {
  return '$' + val.toLocaleString()
}
</script>

<style scoped>
.dynasty8-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #eee;
  font-family: sans-serif;
  color: #333;
}

/* Dynasty 8 gold header */
.header {
  background: #209950;
  color: #1a1a1a;
  padding: 1.481vh;
  text-align: center;
  font-size: 2.222vh;
  font-weight: bold;
  border-bottom: 0.185vh solid #209950;
  max-height: 9.259vh;
}

.header img {
  height: 100%;
  width: auto;
  margin: 0 auto;
  display: block;
}

/* grid of property cards */
.property-grid {
  flex: 1;
  overflow-y: auto;
  padding: 1.481vh;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22.222vh, 1fr));
  gap: 1.481vh;
}

.property-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.741vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.185vh 0.37vh rgba(0,0,0,0.1);
}

.property-image {
  width: 100%;
  height: 14.815vh;
  object-fit: cover;
  border-top-left-radius: 0.741vh;
  border-top-right-radius: 0.741vh;
}

.property-info {
  flex: 1;
  padding: 1.111vh;
  display: flex;
  flex-direction: column;
}

.property-name {
  margin: 0;
  font-size: 1.574vh;
  color: #1a1a1a;
}

.property-type {
  display: inline-block;
  margin: 0.741vh 0 0.37vh;
  padding: 0.185vh 0.556vh;
  background: #1a1a1a;
  color: #ffd700;
  font-size: 1.111vh;
  border-radius: 0.37vh;
}

.property-location {
  font-size: 1.204vh;
  color: #555;
  margin-bottom: 0.741vh;
}

.property-price {
  font-size: 1.574vh;
  font-weight: bold;
  margin-top: auto;
  color: #209950;
}

.details-btn {
  margin-top: 1.111vh;
  padding: 0.741vh;
  background: #ffd700;
  color: #1a1a1a;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
  font-size: 1.296vh;
  transition: filter 0.2s;
}

.details-btn:hover {
  filter: brightness(1.1);
}
</style>
