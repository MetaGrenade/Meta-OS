<script setup>
import { ref } from 'vue'
import { Parser } from 'expr-eval'

const expression = ref('')
// create a single parser instance
const parser = new Parser()

function append(char) {
  // Prevent invalid leading operators
  if (expression.value === '' && /[+\-*/.]/.test(char)) return
  expression.value += char
}

function clear() {
  expression.value = ''
}

function calculate() {
  try {
    // Replace ÷/× with JS operators
    const safeExpr = expression.value
      .replace(/÷/g, '/')
      .replace(/×/g, '*')

    // parse & evaluate via expr-eval
    const result = parser.evaluate(safeExpr)
    expression.value = String(result)
  } catch {
    expression.value = 'Error'
  }
}
</script>

<template>
  <div class="calculator">
    <!-- Display -->
    <div class="display">{{ expression || '0' }}</div>

    <!-- Buttons Grid -->
    <div class="buttons">
      <button @click="clear" class="span-2 red">C</button>
      <button @click="append('(')">(</button>
      <button @click="append(')')">)</button>
      <button @click="append('/')" class="blue">÷</button>

      <button @click="append('7')">7</button>
      <button @click="append('8')">8</button>
      <button @click="append('9')">9</button>
      <button @click="append('*')" class="blue">×</button>

      <button @click="append('4')">4</button>
      <button @click="append('5')">5</button>
      <button @click="append('6')">6</button>
      <button @click="append('-')" class="blue">−</button>

      <button @click="append('1')">1</button>
      <button @click="append('2')">2</button>
      <button @click="append('3')">3</button>
      <button @click="append('+')" class="blue">+</button>

      <button @click="append('0')" class="span-2">0</button>
      <button @click="append('.')">.</button>
      <button @click="calculate" class="span-4 green">=</button>
    </div>
  </div>
</template>

<style scoped>
.calculator {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  color: #fff;
}

/* Display at the top */
.display {
  background: rgba(0, 0, 0, 0.35);
  color: rgb(255, 0, 234);
  font-size: 2rem;
  padding: 16px;
  text-align: right;
  user-select: none;
}

/* Grid of buttons */
.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 60px;
  gap: 8px;
  padding: 8px;
}

/* All buttons */
button {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

/* Highlight on hover */
button:hover {
  background: #44445a;
}

/* “Span two columns” helper */
.span-2 {
  grid-column: span 2;
}
.span-4 {
  grid-column: span 4;
}

.red {
  background: #3a2c2c !important;
}
.blue {
  background: #272e3b !important;
}
.green {
  background: #2c3a2d !important;
}
</style>
