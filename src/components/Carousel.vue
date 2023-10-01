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
    width: 100%;
}
.carousel{
    margin: 0 auto;
    max-width: var(--max-page-width);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    padding: 10px;
    overflow-x: scroll;
}
</style>