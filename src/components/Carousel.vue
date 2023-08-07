<!-- 
    Carousel for displaying PreviewCard components for a quick moving display
    of either most recent, popular or belongng to user posts
 -->

<script setup>
import PreviewCard from './PreviewCard.vue';
import {ref} from 'vue'; 
import axios from 'axios';

const props = defineProps(['posts']);
const posts = ref(props.posts);

// const posts = ref()

// const getPosts = function(){
//   axios.get(`posts/`)
//   .then((res)=>{
//     posts.value = res.data.results;
//   })
// }
// getPosts();
</script>

<template>
    <section class="sect">
        <div class="carousel unified-shadow">
            <PreviewCard v-for="(post, post_id) in posts" :post="post"></PreviewCard>
        </div>
    </section>
</template>

<style scoped>
.sect{
    /* width: 100vw; */
    width: 100%;
    /* flex-grow: 0; */
    /* flex-shrink: 1; */
    /* padding: 2rem; */
}
.carousel{
    /* width: 90%; */
    /* max-width: var(--max-page-width); */
    margin: 0 auto;
    max-width: var(--max-page-width);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    padding: 10px;
    overflow-x: scroll;
    /* flex-grow: 0; */
}
</style>