<template>
  <div class="admin-page">
    <section class="new-post">
      <AppButton @click="$router.push('/admin/new-post')"
        >Create Post</AppButton
      >
      <AppButton @click="onLogout">Logout</AppButton>
    </section>
    <section class="existing-posts">
      <h1>Existing Posts</h1>
      <PostList is-admin :posts="posts" />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  async fetch({ store, error }) {
    try {
      const response = await axios.get(
        'https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts.json'
      )
      const result = []
      for (const key in response.data) {
        result.push({ ...response.data[key], id: key })
      }
      store.dispatch('setPosts', result)
      console.log(result)
    } catch (e) {
      error(e)
    }
  },
  computed: {
    ...mapState(['posts']),
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logOut').then(() => {
        this.$router.push('/admin/auth')
      })
    },
  },
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>
