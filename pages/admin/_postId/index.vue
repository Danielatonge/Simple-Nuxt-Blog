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
      const payload = {
        postId: this.$route.params.postId,
        post: updatePost,
      }
      await this.$store
        .dispatch('updatePost', payload)
        .then(() => this.$router.push({ path: '/admin/' }))
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
