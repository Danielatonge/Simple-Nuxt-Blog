<template>
  <div class="posts-page">
    <PostList :posts="posts" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: { ...mapState(['posts']) },
}
</script>

<style scoped>
.posts-page {
}
</style>