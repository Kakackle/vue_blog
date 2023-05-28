<script setup>
import PreviewCard from './PreviewCard.vue';
import { usePostsStore } from '../stores/posts';
const postsStore = usePostsStore();
</script>

<template>
    <section class="sect">
        <container class="carousel">
            <PreviewCard v-for="(post, post_id) in postsStore.posts" :post_id="post_id"></PreviewCard>
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