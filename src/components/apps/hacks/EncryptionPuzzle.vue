<template>
  <div class="encryption-puzzle">
    <!-- Cipher Text -->
    <section class="cipher-section">
      <h2>Cipher Text</h2>
      <textarea readonly rows="2" v-model="cipherText"></textarea>
    </section>

    <!-- Mapping Inputs -->
    <section class="mapping-section">
      <h2>Substitution Mapping</h2>
      <div class="mapping-grid">
        <div
          v-for="letter in alphabet"
          :key="letter"
          class="map-cell"
        >
          <label :for="letter">{{ letter }}</label>
          <input
            :id="letter"
            v-model="mapping[letter]"
            maxlength="1"
            @input="onMapInput(letter)"
          />
        </div>
      </div>
    </section>

    <!-- Decoded Text -->
    <section class="decoded-section">
      <h2>Decoded Text</h2>
      <div class="decoded">{{ decodedText }}</div>
    </section>

    <!-- Win Overlay -->
    <div v-if="won" class="overlay">
      <div class="message">
        🎉 Decrypted! The secret phrase is:  
        <strong>{{ plaintext }}</strong>  
        <button @click="resetGame">Play Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// the target plaintext
const plaintext = 'ENTER VAULT'

// uppercase alphabet
const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
)

// reactive mapping: cipherLetter → guessedPlainLetter
const mapping = reactive({})
alphabet.forEach(l => mapping[l] = '')

// will hold the generated cipher text (uppercase)
const cipherText = ref('')

// win flag
const won = ref(false)

// generate a random substitution key & cipher the plaintext
function genCipher() {
  // create a random permutation of A–Z
  const shuffled = alphabet.slice()
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  // build mapping: plain→cipher
  const key = {}
  alphabet.forEach((p, idx) => key[p] = shuffled[idx])

  // cipher the plaintext
  const ct = plaintext
    .split('')
    .map(ch => {
      if (ch === ' ') return ' '
      return key[ch] || ch
    })
    .join('')
  cipherText.value = ct
}

// live‐computed decoded text
const decodedText = computed(() =>
  cipherText.value
    .split('')
    .map(ch => {
      if (ch === ' ') return ' '
      const guess = (mapping[ch] || '').toUpperCase()
      return guess || '_'
    })
    .join('')
)

// watch for a win
const checkWin = () => {
  if (decodedText.value === plaintext) {
    won.value = true
  }
}

// sanitize input to uppercase A–Z only
function onMapInput(letter) {
  const v = mapping[letter].toUpperCase()
  mapping[letter] = /^[A-Z]$/.test(v) ? v : ''
  checkWin()
}

// reset everything
function resetGame() {
  // clear mapping
  alphabet.forEach(l => mapping[l] = '')
  won.value = false
  genCipher()
}

// initialize on mount
onMounted(resetGame)
</script>

<style scoped>
.encryption-puzzle {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.481vh;
  box-sizing: border-box;
  font-family: sans-serif;
  color: #222;
  background: #fafafa;
  user-select: none;
}
section {
  margin-bottom: 1.481vh;
}
h2 {
  margin: 0 0 0.741vh;
  font-size: 1.481vh;
  color: #444;
}
textarea {
  width: 100%;
  resize: none;
  font-family: monospace;
  font-size: 1.759vh;
  padding: 0.741vh;
  box-sizing: border-box;
}
.mapping-grid {
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  gap: 0.37vh;
}
.map-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.map-cell label {
  font-size: 0.75rem;
  margin-bottom: 0.185vh;
}
.map-cell input {
  width: 2.963vh;
  height: 2.963vh;
  text-align: center;
  font-size: 1.481vh;
  text-transform: uppercase;
  border: 0.093vh solid #ccc;
  border-radius: 0.37vh;
}
.decoded {
  font-family: monospace;
  font-size: 2.037vh;
  padding: 0.741vh;
  background: #eaeaea;
  border-radius: 0.37vh;
  min-height: 2.963vh;
}

/* Win overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}
.message {
  text-align: center;
  background: #fff;
  padding: 2.222vh;
  border: 0.185vh solid #4caf50;
  border-radius: 0.741vh;
}
.message strong {
  display: block;
  margin: 0.741vh 0;
  font-size: 1.759vh;
  color: #4caf50;
}
.message button {
  margin-top: 1.111vh;
  padding: 0.741vh 1.481vh;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
}
</style>
