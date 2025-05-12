<script setup>
import { ref, reactive, onMounted } from 'vue'

// --- State ---
const folders = ['Inbox', 'Sent']
const selectedFolder = ref('Inbox')
const emails = reactive({ Inbox: [], Sent: [] })
const selectedEmail = ref(null)

const showCompose = ref(false)
const compose = reactive({ to: '', subject: '', body: '' })

// --- Dummy data seed ---
const dummyInbox = [
  {
    id: '1',
    from: 'alice@example.com',
    to: 'me',
    subject: 'Welcome to the server!',
    body: 'Hey there,<br/>welcome aboard our RP server. Let me know if you need anything!',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false
  },
  {
    id: '2',
    from: 'noreply@updates.com',
    to: 'me',
    subject: 'Weekly Update',
    body: 'Here is your weekly digest of events and news.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true
  }
]

const dummySent = [
  {
    id: 's1',
    from: 'me',
    to: 'bob@example.com',
    subject: 'Re: Welcome!',
    body: 'Thanks, Bob! Happy to be here.',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: true
  }
]

// --- Helpers ---
function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString([], {
    hour: '2-digit', minute: '2-digit',
    month: 'short', day: 'numeric'
  })
}

function loadFolder(folder) {
  if (folder === 'Inbox') {
    emails.Inbox = [...dummyInbox]
  } else if (folder === 'Sent') {
    emails.Sent = [...dummySent]
  }
}

function selectFolder(folder) {
  selectedFolder.value = folder
  selectedEmail.value = null
  loadFolder(folder)
}

function openEmail(msg) {
  selectedEmail.value = msg
  if (!msg.read) {
    msg.read = true
  }
}

function openCompose() {
  showCompose.value = true
  compose.to = ''
  compose.subject = ''
  compose.body = ''
}

function closeCompose() {
  showCompose.value = false
}

// “Send” just adds to the Sent folder
function sendCompose() {
  const mail = {
    id:      Date.now().toString(),
    from:    'me',
    to:      compose.to,
    subject: compose.subject,
    body:    compose.body.replace(/\n/g,'<br/>'),
    date:    new Date().toISOString(),
    read:    true
  }
  // Add to dummySent so it appears if you switch folders
  dummySent.unshift(mail)
  if (selectedFolder.value === 'Sent') {
    emails.Sent.unshift(mail)
  }
  closeCompose()
}

// initial load
onMounted(() => {
  loadFolder('Inbox')
})
</script>

<template>
  <div class="mailer">
    <!-- Sidebar -->
    <aside class="sidebar">
      <button class="compose-btn" @click="openCompose">
        + Compose
      </button>
      <button
        v-for="folder in folders"
        :key="folder"
        :class="{ active: folder === selectedFolder }"
        @click="selectFolder(folder)"
      >
        {{ folder }}
      </button>
    </aside>

    <!-- Main -->
    <section class="main">
      <!-- Message list -->
      <div class="message-list">
        <div
          class="message-item"
          v-for="msg in emails[selectedFolder]"
          :key="msg.id"
          :class="{ unread: !msg.read, selected: msg === selectedEmail }"
          @click="openEmail(msg)"
        >
          <div class="from">{{ msg.from }}</div>
          <div class="subject">{{ msg.subject }}</div>
          <div class="time">{{ formatTime(msg.date) }}</div>
        </div>
      </div>

      <!-- Message detail -->
      <div class="message-detail" v-if="selectedEmail">
        <header>
          <h2>{{ selectedEmail.subject }}</h2>
          <div class="meta">
            <span><strong>From:</strong> {{ selectedEmail.from }}</span>
            <span><strong>To:</strong> {{ selectedEmail.to }}</span>
          </div>
        </header>
        <article class="body">
          <p v-html="selectedEmail.body"></p>
        </article>
      </div>
      <div class="message-detail empty" v-else>
        Select a message to read
      </div>
    </section>

    <!-- Compose Modal -->
    <div class="compose-overlay" v-if="showCompose">
      <div class="compose-modal">
        <header>
          <h2>New Message</h2>
          <button class="close" @click="closeCompose">×</button>
        </header>
        <div class="compose-form">
          <label>
            To:
            <input v-model="compose.to" placeholder="recipient@example.com"/>
          </label>
          <label>
            Subject:
            <input v-model="compose.subject" placeholder="Subject" />
          </label>
          <label>
            Body:
            <textarea v-model="compose.body" rows="6" />
          </label>
        </div>
        <footer>
          <button @click="sendCompose">Send</button>
          <button @click="closeCompose">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mailer {
  display: flex;
  height: 100%;
  font-family: sans-serif;
  color: #eee;
}

/* Sidebar */
.sidebar {
  width: 200px;
  background: #382c3a;
  padding: 8px;
  display: flex;
  flex-direction: column;
}
.sidebar button {
  background: none;
  border: none;
  color: #ccc;
  padding: 8px;
  margin-bottom: 4px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
}
.sidebar button.active,
.sidebar button:hover {
  background: #50445a;
  color: #fff;
}
.compose-btn {
  margin-bottom: 12px;
  background: #5a2c7b !important;
  color: #fff !important;
}

/* Main area */
.main {
  flex: 1;
  display: flex;
  background: #2a1e2e;
}
.message-list {
  width: 250px;
  overflow-y: auto;
  background: #392a3f;
}
.message-item {
  padding: 8px;
  border-bottom: 1px solid #4a3a4f;
  cursor: pointer;
}
.message-item.unread .subject { font-weight: bold; }
.message-item.selected { background: #5a4460; }
.message-item .from { font-size: 0.85rem; color: #aaa; }
.message-item .subject { margin-top: 2px; }
.message-item .time {
  font-size: 0.75rem;
  color: #999;
  float: right;
}

/* Message detail */
.message-detail {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #33243a;
}
.message-detail.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
}
.message-detail header {
  border-bottom: 1px solid #55445a;
  margin-bottom: 12px;
}
.message-detail header h2 {
  margin: 0 0 4px;
  color: #fff;
}
.message-detail .meta {
  font-size: 0.9rem;
  color: #aaa;
}
.message-detail .meta span {
  display: flex;
}
.message-detail .body {
  margin-top: 12px;
  color: #ddd;
}

/* Compose modal */
.compose-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}
.compose-modal {
  background: #352c3a;
  width: 500px;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
}
.compose-modal header {
  background: #56445a;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.compose-modal header h2 {
  margin: 0;
  color: #fff;
}
.compose-modal header .close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}
.compose-form {
  padding: 12px;
  display: flex;
  flex-direction: column;
}
.compose-form label {
  margin-bottom: 8px;
  color: #ddd;
}
.compose-form input,
.compose-form textarea {
  width: 100%;
  padding: 6px;
  border: none;
  border-radius: 4px;
  margin-top: 2px;
  background: #4c3a4f;
  color: #fff;
}
.compose-form textarea {
  resize: vertical;
}
.compose-modal footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px;
  background: #56445a;
}
.compose-modal footer button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.compose-modal footer button:first-child {
  background: #5a2c7b;
  color: #fff;
}
.compose-modal footer button:last-child {
  background: #777;
  color: #fff;
}
</style>
