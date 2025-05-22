<template>
  <div class="lifeinvader-app">
    <!-- Header -->
    <header class="header">
      <img src="/img/logos/apps/lifeinvader.png" alt="Dynasty 8 - The best move you'll ever make!" />
    </header>

    <!-- New Post -->
    <section class="li-new-post">
      <textarea
        v-model="newPost"
        placeholder="What's on your mind?"
        rows="3"
      ></textarea>
      <button @click="postStatus" :disabled="!newPost.trim()">Post</button>
    </section>

    <!-- Feed -->
    <section class="li-feed">
      <div v-if="!posts.length" class="li-empty">
        No posts yet. Be the first to share!
      </div>

      <div
        v-for="post in posts"
        :key="post.id"
        class="li-post"
      >
        <div class="li-post-header">
          <strong :class="post.author === 'You' ? 'you' : 'author'">
            {{ post.author }}
          </strong>
          <span class="time">{{ formatTime(post.date) }}</span>
        </div>

        <!-- Text content -->
        <p class="content" v-html="post.content"></p>

        <!-- Attachments -->
        <div v-if="post.attachments?.length" class="li-media">
          <template v-for="(att, idx) in post.attachments" :key="idx">
            <img
              v-if="att.type === 'image'"
              :src="att.src"
              class="post-img"
              alt="Post image"
            />
            <video
              v-else-if="att.type === 'video'"
              controls
              class="post-video"
            >
              <source :src="att.src" type="video/mp4" />
              Your browser doesn’t support video tags.
            </video>
            <span
              v-else-if="att.type === 'emoji'"
              class="post-emoji"
            >{{ att.char }}</span>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])
const newPost = ref('')

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  })
}

function postStatus() {
  const text = newPost.value.trim()
  if (!text) return
  posts.value.unshift({
    id: Date.now(),
    author: 'You',
    content: text.replace(/\n/g, '<br/>'),
    date: new Date().toISOString(),
    attachments: []  // new posts start with no media
  })
  newPost.value = ''
}

onMounted(() => {
  // seed with some rich-media posts
  posts.value = [
    {
      id: 1,
      author: 'Chad',
      content: 'Just scored that new supercar in Los Santos! #blessed',
      date: new Date(Date.now() - 1e3 * 60 * 30).toISOString(),
      attachments: [
        { type: 'image', src: '/img/posts/supercar.jpg' }
      ]
    },
    {
      id: 2,
      author: 'Angel',
      content: 'LifeInvader party this weekend—check out the teaser!',
      date: new Date(Date.now() - 1e3 * 60 * 60 * 5).toISOString(),
      attachments: [
        { type: 'video', src: '/vid/bg_1k.webm' }
      ]
    },
    {
      id: 3,
      author: 'Franklin',
      content: 'Training at the shooting range today. Feeling pumped!',
      date: new Date(Date.now() - 1e3 * 60 * 60 * 24).toISOString(),
      attachments: [
        { type: 'emoji', char: '💪' },
        { type: 'emoji', char: '🔥' }
      ]
    }
  ]
})
</script>

<style scoped>
.lifeinvader-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fafafa;
  color: #333;
  font-family: sans-serif;
}

/* Header */
.header {
  background: #c9c9c9;
  color: #1a1a1a;
  padding: 1.481vh;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 5px solid #992020;
  max-height: 100px;
}
.header img {
  height: 100%;
  width: auto;
  margin: 0 auto;
  display: block;
}

/* New Post */
.li-new-post {
  padding: 1.111vh 1.481vh;
  background: #fff;
  border-bottom: 0.093vh solid #ddd;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.li-new-post textarea {
  resize: vertical;
  padding: 0.741vh;
  font-size: 1rem;
  border: 0.093vh solid #ccc;
  border-radius: 0.37vh;
}
.li-new-post button {
  align-self: flex-end;
  margin-top: 0.741vh;
  padding: 0.556vh 1.481vh;
  background: #cf1414;
  color: #fff;
  border: none;
  border-radius: 0.37vh;
  cursor: pointer;
}
.li-new-post button:disabled {
  background: #ccc;
  cursor: default;
}

/* Feed */
.li-feed {
  flex: 1;
  overflow-y: auto;
  padding: 1.481vh;
  background: #f0f0f0;
}
.li-empty {
  text-align: center;
  color: #777;
  margin-top: 2.222vh;
}

/* Individual post */
.li-post {
  background: #fff;
  border: 0.093vh solid #ddd;
  border-radius: 0.556vh;
  padding: 1.111vh;
  margin-bottom: 1.111vh;
}
.li-post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.741vh;
}
.author {
  color: #cf1414;
}
.you {
  color: #000 !important;
}
.time {
  font-size: 0.75rem;
  color: #777;
}
.content {
  margin: 0 0 0.741vh;
  line-height: 1.4;
}

/* Media attachments */
.li-media {
  display: flex;
  flex-wrap: wrap;
  gap: 0.741vh;
}
.post-img {
  max-width: 100%;
  border-radius: 0.37vh;
}
.post-video {
  max-width: 100%;
  border-radius: 0.37vh;
}
.post-emoji {
  font-size: 2.963vh;
  line-height: 1;
}
</style>
