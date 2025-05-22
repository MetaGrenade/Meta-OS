<script setup>
import { ref, computed, h } from 'vue'
import SearchPage from './browser/pages/SearchPage.vue'
import WebPage from './browser/pages/WebPage.vue'
import JusticeDept from './browser/pages/JusticeDept.vue'

// map “URLs” to components
const pages = {
  'gargle.cum': SearchPage,
  'www.gargle.cum': SearchPage,
  'gargle': SearchPage,
  'doj.guv': JusticeDept,
  'www.doj.guv': JusticeDept,
  'doj': JusticeDept,
  'upnatom.nut': {
    render() { return h(WebPage, { url: 'https://www.theupnatom.com' }) }
  },
  'www.upnatom.nut': {
    render() { return h(WebPage, { url: 'https://www.theupnatom.com' }) }
  },
  'up n atom': {
    render() { return h(WebPage, { url: 'https://www.theupnatom.com' }) }
  },
  // GAMES
  'doom.dos': {
    render() { return h(WebPage, { url: 'https://dos.zone/doom-dec-1993/' }) }
  },
  'www.doom.dos': {
    render() { return h(WebPage, { url: 'https://dos.zone/doom-dec-1993/' }) }
  },
  'doom': {
    render() { return h(WebPage, { url: 'https://dos.zone/doom-dec-1993/' }) }
  },
  'oregontrail.dos': {
    render() { return h(WebPage, { url: 'https://oregontrail.ws/games/the-oregon-trail/play/' }) }
  },
  'www.oregontrail.dos': {
    render() { return h(WebPage, { url: 'https://oregontrail.ws/games/the-oregon-trail/play/' }) }
  },
  'oregon trail': {
    render() { return h(WebPage, { url: 'https://oregontrail.ws/games/the-oregon-trail/play/' }) }
  },
}

// browser history
const history = ref(['gargle.cum'])
const historyIndex = ref(0)

// bind to address bar
const inputUrl = ref(history.value[0])

// navigate to whatever’s in the bar
function navigate() {
  if (!inputUrl.value) return
  // trim trailing slash, lowercase, basic normalization:
  const url = inputUrl.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
  // push / replace history
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(url)
  historyIndex.value = history.value.length - 1
  inputUrl.value = url
}

// back / forward
function goBack() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    inputUrl.value = history.value[historyIndex.value]
  }
}
function goForward() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    inputUrl.value = history.value[historyIndex.value]
  }
}

// derive current URL & component
const currentUrl           = computed(() => history.value[historyIndex.value])
const currentPageComponent = computed(() => pages[currentUrl.value] || {
  template: `<div style="padding:2.222vh; color:#900;">404 Page not found: {{ url }}</div>`,
  props: ['url'],
  setup() { return { url: currentUrl.value } }
})
</script>

<template>
  <div class="browser">
    <!-- toolbar -->
    <div class="toolbar">
      <button @click="goBack" :disabled="historyIndex <= 0">←</button>
      <button @click="goForward" :disabled="historyIndex >= history.length-1">→</button>
      <input
        v-model="inputUrl"
        @keyup.enter="navigate"
        class="address-bar"
        placeholder="Enter URL..."
      />
      <button @click="navigate">Go</button>
    </div>

    <!-- content area -->
    <div class="content">
      <component :is="currentPageComponent" />
    </div>
  </div>
</template>

<style scoped>
.browser {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* border: 0.093vh solid #666; */
}

/* toolbar */
.toolbar {
  display: flex;
  align-items: center;
  background: rgba(56, 29, 75, 0.9);
  padding: 0.37vh;
  gap: 0.37vh;
}
.address-bar {
  flex: 1;
  padding: 0.37vh 0.741vh;
  border: 0.093vh solid #ccc;
  border-radius: 0.37vh;
}

/* content area */
.content {
  flex: 1;
  overflow: auto;
  background: transparent;
}
</style>
