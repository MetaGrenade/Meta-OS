<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

// ensure full protocol
const normalizedUrl = computed(() => {
  let u = props.url.trim()
  if (!/^https?:\/\//i.test(u)) {
    u = 'https://' + u
  }
  return u
})
</script>

<template>
  <div class="webpage-container">
    <iframe
      :src="normalizedUrl"
      frameborder="0"
      class="webpage-frame"
    ></iframe>
  </div>
</template>

<style scoped>
.webpage-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.webpage-frame {
  width: 100%;
  height: 100%;
  border: none;
  /* optionally: sandbox, allow-scripts, etc. */
}
</style>
