<script setup>
// import { storeToRefs } from 'pinia';
// import { usePostsStore } from '../stores/posts';
// import { useUserStore } from '../stores/users';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();

// const postsStore = usePostsStore();
// const {posts} = storeToRefs(postsStore)
const post = props.post

// const userStore = useUserStore();
// const {users} = storeToRefs(userStore)
// const user = users.value[post.author];
const user = ref();
user.value = post.author;
const props = defineProps(['post'])
</script>

<template>
<div class="list-preview hover" @click="router.push(`/post/${post.id}`)">
    <div class="left">
        <img :src=post.img class="img">
    </div>
    <div class="right">
        <p class="title">{{ post.title }}</p>
        <div class="tags">
            <p v-for="tag in post.tags" class="tag hover">{{ tag }}</p>
        </div>
        <p class="author">{{ user.name }}</p>
        <p class="content">{{ post.content.slice(0,250) }}...</p>
    </div>
    <p class="post_id">{{ post.id }}</p>
    <p class="date">{{ post.date }}</p>
</div>
</template>

<style scoped>
.list-preview{
    width: 95%;
    /* height: 10rem; */
    padding: 1rem;
    box-shadow: 0px 5px 12px rgba(0,0,0,0.15);
    border-radius: 0.5rem;
    display: flex;
    position: relative;
}

.left{
    display: flex;
    /* align-items: center; */
    flex-direction: column;
    justify-content: center;
    font-size: 2rem;
    color: #636e72;
}

.img{
    height: 10rem;
    width: 15rem;
}

.right{
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.title{
    font-size: 2.4rem;
    border-bottom: 2px solid black;
    /* width: 100%; */
}
.author{
    font-size: 1.5rem;
}
.tags{
    display: flex;
    color: #636e72cc;
    font-size: 1.2rem;
    gap: 1rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
.content{
    font-size: 1.2rem;
}
.post_id, .date{
    font-size: 1.5rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
}

.date{
    right: 2.5rem;
    color:#636e72;
}
</style>