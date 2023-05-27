<script setup>
import Hero from '../components/Hero.vue';
import Banner from '../components/Banner.vue'
import PreviewList from '../components/PreviewList.vue';
import { usePostsStore } from '../stores/posts';
const postsStore = usePostsStore();
</script>

<template>
  <main>
    <Banner></Banner>
    <Hero></Hero>
    <section class="main-section">
      <container class="preview-list">
        <PreviewList v-for="(post, post_id) in postsStore.posts" :post_id="post_id"></PreviewList>
      </container>
      <container class="side">
      </container>
    </section>  
  </main>
</template>

<style scoped>
.main-section{
  display: flex;
}
.preview-list{
  width: clamp(40rem, 75vw, 100rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.side{
  width: clamp(20rem, 25vw, 40rem);
  height: 40rem;
  background-color: #636e72;
}

</style>
