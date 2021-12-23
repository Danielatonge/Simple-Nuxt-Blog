<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="post" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'admin',
  async asyncData({ error, params }) {
    try {
      const response = await axios.get(
        `https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts/${params.postId}.json`
      )
      return { post: response.data }
    } catch (e) {
      error(e)
    }
  },
  methods: {
    async onSubmitted(updatePost) {
      try {
        const postId = this.$route.params.postId
        const response = await axios.put(
          `https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts/${postId}.json`,
          updatePost
        )
        this.$store
          .dispatch('updatePost', response.data)
          .then(() => this.$router.push({ path: '/admin/' }))
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
