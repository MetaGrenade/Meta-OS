<template>
  <div class="search-page">
    <div class="logo">Gargle Search</div>
    <div class="search-box">
      <input
        v-model="query"
        @keyup.enter="onSearch"
        placeholder="Gargle the web..."
      />
      <button @click="onSearch">Search</button>
    </div>

    <div v-if="results.length" class="results">
      <div
        v-for="(res, i) in results"
        :key="i"
        class="result-item"
      >
        <a :href="res.link" target="_blank" @click.prevent>
          {{ res.title }}
        </a>
        <div class="link">{{ res.link }}</div>
      </div>
    </div>

    <div v-else class="extensions">
        <strong>Common Domain Extensions:</strong> 
        <p>
            <button>.cum</button> <button>.nut</button> <button>.guv</button>
        </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const query   = ref('')
const results = ref([])

function onSearch() {
  if (!query.value) return
  // dummy generated results
  results.value = Array.from({ length: 5 }, (_, i) => ({
    title: `Result for “${query.value}” (#${i+1})`,
    link:  `https://example.com/search?q=${encodeURIComponent(query.value)}&r=${i+1}`
  }))
}
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 16px;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}
.search-box input {
  width: 300px;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search-box button {
  padding: 8px 16px;
  font-size: 1rem;
}

.results {
  width: 80%;
  max-width: 600px;
}
.result-item {
  margin-bottom: 24px;
}
.result-item a {
  font-size: 1.1rem;
  color: #1a0dab;
  text-decoration: none;
}
.result-item a:hover {
  text-decoration: underline;
}
.link {
  font-size: 0.85rem;
  color: #006621;
  margin-top: 4px;
}

.extensions button {
  margin: 0 4px;
  padding: 4px 8px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #000;
}
</style>
