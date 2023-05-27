<script setup>
import { storeToRefs } from 'pinia';
import { usePostsStore } from '../stores/posts';

const postsStore = usePostsStore();
const {posts} = storeToRefs(postsStore)
const post = posts.value[props.post_id]

const props = defineProps(['post_id'])
</script>

<template>
<div class="list-preview">
    <div class="left">
        <p class="date">{{ post.date }}</p>
    </div>
    <div class="right">
        <p class="title">{{ post.title }}</p>
        <p class="author">{{ post.author }}</p>
        <p class="content">{{ post.contents.slice(0,20) }}...</p>
    </div>
    <p class="post_id">{{ post.id }}</p>
</div>
</template>

<style scoped>
.list-preview{
    width: 95%;
    height: 10rem;
    box-shadow: 0px 5px 12px rgba(0,0,0,0.15);
    border-radius: 0.5rem;
    display: flex;
    position: relative;
}

.left{
    display: flex;
    align-items: center;
    font-size: 2rem;
    color: #636e72;
}

.right{
    padding: 1rem;
}

.title{
    font-size: 2.4rem;
    border-bottom: 2px solid black;
    /* width: 100%; */
}
.author{
    font-size: 1.5rem;
}
.content{
    font-size: 1.2rem;
}
.post_id{
    font-size: 1.5rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
}
</style>