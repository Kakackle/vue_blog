<!-- 
    Carousel for displaying PreviewCard components for a quick moving display
    of either most recent, popular or belongng to user posts
    TODO: overflow i dynamcizna ilosc mieszczacych sie cards
    TODO: ruch, zmiana wyswietlanych?
 -->

<script setup>
import PreviewCard from './PreviewCard.vue';
import { ref} from 'vue';
import axios from 'axios';

const posts = ref()

const getPosts = function(){
  axios.get(`posts/`)
  .then((res)=>{
    posts.value = res.data.results;
  })
}
getPosts();
</script>

<template>
    <section class="sect">
        <div class="carousel">
            <PreviewCard v-for="(post, post_id) in posts" :post="post"></PreviewCard>
        </div>
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