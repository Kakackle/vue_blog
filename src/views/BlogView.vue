<script setup>
import PostView from './PostView.vue';
import {usePostsStore} from "../stores/posts.js"
import { RouterLink, RouterView } from 'vue-router'
const postsStore = usePostsStore();
</script>

<template>
  <main>
    <!-- <PostView v-for="(post, post_id) in postsStore.posts" :post_id="post_id"></PostView> -->
    <RouterLink v-for="(post, post_id) in postsStore.posts" :to="`/post/${post_id}`">Post {{ post_id }}</RouterLink>
  </main>
</template>