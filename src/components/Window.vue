<script>
import { defineComponent } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

// simple debounce helper
function debounce(fn, ms = 50) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

export default defineComponent({
  name: 'Window',
  components: { Vue3DraggableResizable },
  props: {
    title:     { type: String,  required: true },
    icon:      { type: String,  required: true },
    z:         { type: Number,  required: true },
    minimized: { type: Boolean, default: false },
    x:         { type: Number, default: 50 },
    y:         { type: Number, default: 50 },
    width:     { type: Number, default: 1920 },
    height:    { type: Number, default: 1080 }
  },
  emits: ['close','focus','minimize','update:position','update:size'],
  created() {
    // debounce focus so @activated only fires at most once per 50ms
    this.debouncedFocus = debounce(() => this.$emit('focus'), 50)
  },
  methods: {
    // immediate focus on titlebar click
    onFocus() {
      this.$emit('focus')
    },
    // debounced focus on drag‐activated
    onActivated() {
      this.debouncedFocus()
    },
    onDragStop(left, top) {
      this.$emit('update:position', { x: left, y: top })
    },
    onResizeStop(left, top, w, h) {
      this.$emit('update:size', { x: left, y: top, width: w, height: h })
    }
  }
})
</script>

<template>
  <!-- v-if for minimized windows frees up the drag-listener bindings from Vue3DraggableResizable (performance optimization) -->
  <Vue3DraggableResizable
    v-if="!minimized"
    :x="x"
    :y="y"
    :w="width"
    :h="height"
    :draggable="true"
    :resizable="true"
    :parent="true"
    :style="{ zIndex: z }"
    class="window-wrapper"
    @activated="onActivated"
    @dragstop="onDragStop"
    @resizestop="onResizeStop"
  >
    <div class="window-content">
      <!-- TITLEBAR: still lets mousedown through, so drag works here -->
      <div class="titlebar" @mousedown="onFocus">
        <div class="titlebar-left">
          <img :src="icon" class="titlebar-icon" />
          <span class="titlebar-title">{{ title }}</span>
        </div>
        <div class="controls">
          <button @click.stop="$emit('minimize')">–</button>
          <button class="close" @click.stop="$emit('close')">×</button>
        </div>
      </div>
      <!-- CONTENT: block all mousedown so drag never starts here -->
      <div class="content" @mousedown.stop @touchstart.stop>
        <slot/>
      </div>
    </div>
  </Vue3DraggableResizable>
</template>

<style scoped>
.window-wrapper { 
  position: absolute;
  will-change: transform;
}
.window-content {
  display: flex;
  flex-direction: column;
  width: 100%; height: 100%;
  background: rgb(39, 20, 52);
  border: 1px solid #b014cf;
  box-shadow: 0 0 6px rgba(0,0,0,0.3);
}
/* Only this has the move cursor, and also is your drag-handle */
.titlebar {
  background: rgba(31, 16, 41, 0.9);;
  align-items: center;
  padding-left: 10px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  user-select: none;
  z-index: 1;
  color: rgba(176, 20, 207, 0.8);
}
/* group icon + title */
.titlebar-left {
  display: flex;
  align-items: center;
}
/* icon styling */
.titlebar-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
/* ensure the text grows/shrinks nicely */
.titlebar-title {
  font-size: 0.9rem;
  line-height: 1;
}
.content {
  flex: 1; 
  overflow-y: auto; 
  overflow-x: hidden;
}
.controls button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #fff;
  border-radius: 0;
}
.controls button:hover {
  background: rgba(176, 20, 207, 0.1);
}
.controls .close:hover {
  background: rgba(207, 20, 42, 0.1);
  color: rgb(207, 20, 42);
}
</style>
