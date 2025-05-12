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
    padding: 2px; 
    border-radius: 1px;
    /* transition: background 0.2s, border 0.2s;  */
    border: 1px solid transparent;
}
.icon img { 
  width: 48px; 
  height: 48px; 
}
.label { 
  font-size: 0.75rem; 
  font-weight: 600; 
  margin-top: 4px; 
  text-shadow: 1px 1px #000; 
}
.icon--focused {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid #fff;
}
</style>
