<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  layout: 'admin',
  methods: {
    async onSubmitted(formData) {
      try {
        const response = await axios.post(
          'https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts.json',
          formData
        )
        console.log(response)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>

