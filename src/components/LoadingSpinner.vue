<template>
  <div class="spinner">
    <div class="dot" v-for="n in 3" :key="n"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.dot {
  width: 8px; height: 8px;
  margin: 0 4px;
  background: #b014cf;
  border-radius: 50%;
  animation: blink 1s infinite ease-in-out;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink {
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}
</style>
