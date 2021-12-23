<template>
  <div class="home-page">
    <section class="intro">
      <h1>Get the latest tech news!</h1>
    </section>
    <PostList :posts="posts" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: { ...mapState(['posts']) },
}
</script>
