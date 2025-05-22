<script setup>
import { reactive } from 'vue'

const apps = reactive([
  {
    id: 'appstore',
    name: 'App Store',
    icon: '/img/icons/apps/shop.png',
    description: 'Browse, purchase, and install new applications to expand your desktop experience.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'files',
    name: 'File Explorer',
    icon: '/img/icons/apps/files.png',
    description: 'Navigate folders, open documents, and manage all your files in one place.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'browser',
    name: 'Web Browser',
    icon: '/img/icons/apps/browser2.png',
    description: 'Browse the web from inside the desktop UI.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '/img/icons/apps/calculator.png',
    description: 'Basic arithmetic and scientific calculations.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: '/img/icons/apps/notepad.png',
    description: 'A simple text editor for quick notes.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'mailer',
    name: 'Mail Client',
    icon: '/img/icons/apps/email.png',
    description: 'Send and receive in-game email messages.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'lifeinvader',
    name: 'Life Invader',
    icon: '/img/icons/apps/lifeinvader.png',
    description: 'Connect with contacts, post status updates, and browse your social feed.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'dynasty8',
    name: 'Dynasty 8',
    icon: '/img/icons/apps/dynasty8.png',
    description: 'View, buy, and manage properties across the city’s real estate market.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'vpn',
    name: 'Turd VPN',
    icon: '/img/icons/apps/vpn.png',
    description: 'Secure your connection, mask your IP, and browse the web anonymously.',
    price: 10,
    purchased: false,
    installed: false
  },
  {
    id: 'taxi',
    name: 'Goober Taxi',
    icon: '/img/icons/apps/taxi.png',
    description: 'Secure your connection, mask your IP, and browse the web anonymously.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'bank',
    name: 'Maze Bank',
    icon: '/img/icons/apps/bank.png',
    description: 'Check your balance, transfer funds, and manage Maze Bank accounts.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'crypto',
    name: 'Crypto Miner',
    icon: '/img/icons/apps/crypto.png',
    description: 'Mine cryptocurrency using your virtual GPU rig.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'clicker',
    name: 'Donut Dash',
    icon: '/img/icons/apps/games/clicker.png',
    description: 'Click as many donuts as you can before time runs out!',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'garage',
    name: 'Garage',
    icon: '/img/icons/apps/garage.png',
    description: 'View your vehicles and see which garage they’re parked in.',
    price: 5,
    purchased: false,
    installed: false
  },
  {
    id: 'market',
    name: 'Market',
    icon: '/img/icons/apps/market.png',
    description: 'Buy, sell, and bid on items in classifieds, auctions, and wanted ads.',
    price: 5,
    purchased: false,
    installed: false
  },
  {
    id: 'events',
    name: 'Events',
    icon: '/img/icons/apps/events.png',
    description: 'Browse upcoming events, view details, and submit your own gatherings.',
    price: 0,
    purchased: true,
    installed: true
  },
  {
    id: 'reaction',
    name: 'Reaction Test',
    icon: '/img/icons/apps/games/reaction.png',
    description: 'Test your reflexes in a randomized reaction time challenge.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'memory',
    name: 'Memory Match',
    icon: '/img/icons/apps/games/memory.png',
    description: 'Flip cards and match pairs to clear the board as quickly as possible.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'slots',
    name: 'Slot Machine',
    icon: '/img/icons/apps/games/slots.png',
    description: 'Try your luck on the slot machine—spin, match symbols, and win chips.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: '/img/icons/apps/games/tictactoe.png',
    description: 'Play Tic Tac Toe against a friend or the AI—get three in a row to win.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: '2048game',
    name: '2048 Game',
    icon: '/img/icons/apps/games/2048game.png',
    description: 'Slide numbered tiles to combine them and reach 2048.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'whackamole',
    name: 'Whack-a-Mole',
    icon: '/img/icons/apps/games/whackamole.png',
    description: 'Whack popping moles to rack up points before time runs out.',
    price: 0,
    purchased: false,
    installed: false
  },
  {
    id: 'wifibreach',
    name: 'Wi-Fi Breacher',
    icon: '/img/icons/apps/hacks/wifibreach.png',
    description: 'Exploit network nodes and avoid firewalls to breach the target server.',
    price: 15,
    purchased: false,
    installed: false
  },
  {
    id: 'bruteforcepin',
    name: 'Pin Cracker',
    icon: '/img/icons/apps/hacks/bruteforcepin.png',
    description: 'Brute-force a 4-digit PIN before the alarm heat gauge maxes out.',
    price: 15,
    purchased: false,
    installed: false
  },
  {
    id: 'encryptionpuzzle',
    name: 'Encrypt',
    icon: '/img/icons/apps/hacks/encryptionpuzzle.png',
    description: 'Solve a substitution cipher to decrypt the secret message.',
    price: 15,
    purchased: false,
    installed: false
  },
  {
    id: 'signaljammer',
    name: 'Signal Jammer',
    icon: '/img/icons/apps/hacks/signaljammer.png',
    description: 'Tune your jamming frequency to cancel out hostile signals.',
    price: 20,
    purchased: false,
    installed: false
  }
])

function purchaseApp(id) {
  const a = apps.find(x => x.id === id)
  if (a && !a.purchased) {
    a.purchased = true
    // auto-install free apps
    if (a.price === 0) {
      a.installed = true
    }
  }
}

function installApp(id) {
  const a = apps.find(x => x.id === id)
  if (a && a.purchased && !a.installed) {
    a.installed = true
  }
}
</script>

<template>
  <div class="app-store">
    <h2>App Store</h2>
    <div class="store-grid">
      <div v-for="app in apps" :key="app.id" class="store-card">
        <img :src="app.icon" alt="" class="card-icon" />
        <h3 class="card-title">{{ app.name }}</h3>
        <p class="card-description">{{ app.description }}</p>
        <div class="card-footer">
          <button
            class="buy-btn"
            :disabled="app.purchased"
            @click="purchaseApp(app.id)"
          >
            {{ app.purchased ? 'Purchased' : app.price > 0 ? `Buy: ${app.price}Ɏ` : 'Buy: Free' }}
          </button>
          <button
            class="install-btn"
            :disabled="!app.purchased || app.installed"
            @click="installApp(app.id)"
          >
            {{ app.installed ? 'Installed' : 'Install' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-store {
  padding: 1.481vh;
  color: #fff;
  font-family: sans-serif;
}
.app-store h2 {
  margin-top: 0;;
  margin-bottom: 1.481vh;
  color: #b014cf;
}

/* grid of cards */
.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16.667vh, 1fr));
  gap: 1.481vh;
}

/* each app card */
.store-card {
  display: flex;
  flex-direction: column;
  background: #2c2c3a;
  border: 0.093vh solid #44445a;
  border-radius: 0.741vh;
  padding: 1.111vh;
  text-align: center;
}
.card-icon {
  width: 4.444vh;
  height: 4.444vh;
  margin: 0 auto 0.741vh;
}
.card-title {
  margin: 0.741vh 0;
  font-size: 1.574vh;
  color: #fff;
}
.card-description {
  flex: 1;
  font-size: 1.204vh;
  color: #ccc;
  margin-bottom: 1.111vh;
}

/* footer buttons */
.card-footer {
  display: flex;
  gap: 0.741vh;
  justify-content: center;
}
.card-footer button {
  flex: 1;
  padding: 0.556vh;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
  font-size: 1.204vh;
  transition: background 0.2s;
}
.buy-btn {
  background: #5a2c7b;
  color: #fff;
}
.buy-btn:disabled {
  background: #333;
  color: #777;
  cursor: default;
}
.install-btn {
  background: #3a6b3a;
  color: #fff;
}
.install-btn:disabled {
  background: #333;
  color: #777;
  cursor: default;
}
.card-footer button:not(:disabled):hover {
  filter: brightness(1.1);
}
</style>
