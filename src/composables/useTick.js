import { ref, onMounted, onUnmounted } from 'vue'

export function useTick() {
  const tick = ref(0)
  let id
  onMounted(() => { id = setInterval(() => tick.value++, 1000) })
  onUnmounted(() => clearInterval(id))
  return tick
}
