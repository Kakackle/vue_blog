<!-- Whole post view -->
<script setup>
import {usePostsStore} from "../stores/posts.js"
import { onMounted } from "vue";
import {useRouter, useRoute} from "vue-router"
import {ref} from "vue"
import { storeToRefs } from "pinia";

const route = useRoute()

const postsStore = usePostsStore();

const {posts} = storeToRefs(postsStore)
const post = posts.value[route.params.post_id]

onMounted(()=>{
  const str = JSON.stringify(post)
  console.log(`post: ${str}`)
})


</script>

<template>
  <main>
    <!-- {{ $route.params }} -->
    <container class="post">
        <h1>{{ post.title }}</h1>
        <h3>{{ post.author }}</h3>
        <p>{{ post.date }}</p>
        <p>{{ post.contents }}</p>
        <img :src="post.img">
    </container>
  </main>
</template>

<style scoped>
</style>