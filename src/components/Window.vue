<script>
import { defineComponent } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

// simple debounce helper (you already had)
function debounce(fn, ms = 50) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// lightweight throttle: calls fn at most once per `ms`, with a trailing call
function throttle(fn, ms = 50) {
  let last = 0
  let timer = null
  return (...args) => {
    const now = Date.now()
    const delta = now - last
    if (delta >= ms) {
      last = now
      fn(...args)
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = Date.now()
        fn(...args)
      }, ms - delta)
    }
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
  emits: ['close','focus','minimize','update:position'], //,'update:size'
  created() {
    // debounce focus so it won't spam when you drag-click rapidly
    this.debouncedFocus = debounce(() => this.$emit('focus'), 50)

    // throttle continuous drag updates to once every 50ms
    this.throttledDrag = throttle((l, t) =>
      this.$emit('update:position', { x: l, y: t }), 50)

    // throttle continuous resize updates to once every 50ms
    // this.throttledResize = throttle((l, t, w, h) =>
    //   this.$emit('update:size', { x: l, y: t, width: w, height: h }), 50)
  },
  methods: {
    // immediate focus when clicking titlebar
    onFocus() {
      this.$emit('focus')
    },
    // debounced focus when draggable library emits "activated"
    onActivated() {
      this.debouncedFocus()
    },
    // continuous drag – throttled
    onDrag(left, top) {
      this.throttledDrag(left, top)
    },
    // final drag end – immediate
    onDragStop(left, top) {
      this.$emit('update:position', { x: left, y: top })
    },
    // // continuous resize – throttled
    // onResize(left, top, width, height) {
    //   this.throttledResize(left, top, width, height)
    // },
    // // final resize end – immediate
    // onResizeStop(left, top, width, height) {
    //   this.$emit('update:size', { x: left, y: top, width, height })
    // }
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
    @drag="onDrag"
    @dragstop="onDragStop"
  >
  <!-- @resizing="onResize" -->
  <!-- @resizestop="onResizeStop" -->
  
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
  width: 100%; 
  height: 100%;
  background: rgb(39, 20, 52);
  border: 0.093vh solid #b014cf;
  box-shadow: 0 0 0.556vh rgba(0,0,0,0.3);
}
/* Only this has the move cursor, and also is your drag-handle */
.titlebar {
  background: rgba(31, 16, 41, 0.9);;
  align-items: center;
  padding-left: 0.926vh;
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
  width: 1.481vh;
  height: 1.481vh;
  margin-right: 0.926vh;
}
/* ensure the text grows/shrinks nicely */
.titlebar-title {
  font-size: 1.296vh;
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
  font-size: 1.481vh;
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
