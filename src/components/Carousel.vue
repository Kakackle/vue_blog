<script setup>
import PreviewCard from './PreviewCard.vue';
import { usePostsStore } from '../stores/posts';
// const postsStore = usePostsStore();
import { ref} from 'vue';
import axios from 'axios';

const posts = ref()

const getPosts = function(){
  axios.get(`http://127.0.0.1:8000/api/posts/`)
  .then((res)=>{
    posts.value = res.data;
  }
  )
}
getPosts();
</script>

<template>
    <section class="sect">
        <container class="carousel">
            <PreviewCard v-for="(post, post_id) in posts" :post="post"></PreviewCard>
        </container>
    </section>
</template>

<style scoped>
.sect{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}
.carousel{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.15);
    padding: 2rem;
    overflow: hidden;
}
</style>