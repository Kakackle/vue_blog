<!-- 
    A generic view for testing, mostly API calls etc
    just for really simple and quick things though

    CURRENTLY BEING TESTED:

    new composable axios functions for get, post and patch
 -->
<script setup>
import { getFromAPI, postToAPI, patchToAPI } from "../composables/axiosComposables";
import { ref } from "vue";
const posts = ref();
const pages = ref();
const status = ref();
// const query_string = `posts/first-blog-post`;
let query_string = `posts/`;

const getPosts = (query_string) => {
  posts.value = undefined;
  pages.value = undefined;
  getFromAPI(query_string).then((res) => {
    if (res.status === 200) {
      posts.value = res.data.results;
      pages.value = res.data.context.page_links;
      status.value = res.status;
    } else {
      status.value = res.status;
    }
  });
};
</script>

<template>
  <main class="">
    <section class="w-100 flex flex-col">
      <p class="text-3xl">TEST VIEW</p>
      <p class="text-2xl">CURRENTLY TESTED: NEW AXIOS COMPOSABLES</p>
      <p class="text-xl">last test date: 29.06.2023</p>
    </section>
    <section class="w-100 flex flex-col">
      <button class="text-2xl" @click="getPosts(query_string)">TEST</button>
      <p>RESULT: </p>  
      <div v-if="posts">
        <ul>
            <li v-for="(post, post_id) in posts">{{post.title}}</li>   
        </ul>
        </div>
      <p v-if="status">STATUS: {{ status }}</p>
    </section>
  </main>
</template>
