<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  icon:     String,
  label:    String,
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['click','dblclick'])
</script>

<template>
  <div
    :class="['icon', { 'icon--focused': selected }]"
    @click="emit('click')"
    @dblclick="emit('dblclick')"
  >
    <img :src="icon" alt="" />
    <div class="label">{{ label }}</div>
  </div>
</template>

<style>
.icon { 
    text-align: center; 
    cursor: pointer; 
    user-select: none; 
    padding: 0.185vh; 
    border-radius: 0.093vh;
    /* transition: background 0.2s, border 0.2s;  */
    border: 0.093vh solid transparent;
}
.icon img { 
  width: 4.444vh; 
  height: 4.444vh; 
}
.label { 
  font-size: 0.75rem; 
  font-weight: 600; 
  margin-top: 0.37vh; 
  text-shadow: 0.093vh 0.093vh #000; 
}
.icon--focused {
    background: rgba(255, 255, 255, 0.25);
    border: 0.093vh solid #fff;
}
</style>
