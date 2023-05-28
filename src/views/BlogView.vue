<script setup>
import PostView from './PostView.vue';
import FilterSide from '../components/FilterSide.vue';
import PreviewListLarge from '../components/PreviewListLarge.vue';
import {usePostsStore} from "../stores/posts.js"
import { RouterLink, RouterView } from 'vue-router'
const postsStore = usePostsStore();
</script>

<template>
  <main>
    <!-- <PostView v-for="(post, post_id) in postsStore.posts" :post_id="post_id"></PostView> -->
    <!-- <RouterLink v-for="(post, post_id) in postsStore.posts" :to="`/post/${post_id}`">Post {{ post_id }}</RouterLink> -->
    <p class="blog-title">BLOG TITLE</p>
    <section class="blog-sect">
      <div class="blog-list">
        <PreviewListLarge v-for="(post, post_id) in postsStore.posts" :post_id="post_id"></PreviewListLarge>
      </div>
        
      <div class="side">
        <FilterSide></FilterSide>
      </div>
    </section>
  </main>
</template>

<style scoped>
.blog-title{
  font-size: 6rem;
  font-weight: 500;
  padding: 0 4rem;
}
.blog-sect{
  width: 100%;
  padding: 0 2rem;
  display: flex
}
.blog-list{
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
  /* background-color: #636e72; */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>