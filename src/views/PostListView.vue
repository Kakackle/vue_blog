<script setup>
import {ref} from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
const router = useRouter();

import Tag from '../components/Tag.vue';

const posts = ref();

const getAllUsers = async function(){
    axios.get('posts/all/')
    .then((res)=>{
        posts.value = res.data;
        console.log(`get all users: ${res.statusText}`);
    })
    .catch((err)=>{
        console.log(`get all users error: ${err.statusText}`);
    })
}

getAllUsers();

</script>

<template>
<div class="main">
    <p class="title">ALL POSTS LIST:</p>
    <section class="posts" v-if="posts">
        <div class="post" v-for="post in posts">
            <p class="name">{{ post.title }}</p>
            <p class="desc">{{ post.author }}</p>
            <div class="tags">
                <Tag v-for="(tag, index) in post.tags" :tag="tag"></Tag>
            </div>
            <ion-icon name="arrow-forward-outline" class="icon hover"
            @click="router.push({name: 'post', params:{post_slug: post.slug}})"
            ></ion-icon>
            <!-- <router-link :to="{name: 'post', params:{post_slug: post.slug}}">
            {{post.slug}} - by: {{ post.author }}</router-link> -->
            </div>
    </section>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: var(--max-page-width);
    margin: 0 auto;
    color: var(--dark-gray);
}
.title{
    font-size: 4rem;
}
.posts{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 10px;
}
.post{
    font-size: 2rem;
    position: relative;
}
.icon{
    position: absolute;
    right: 1rem;
}

.name{
    font-weight: 500;
    text-decoration: underline;
}

.tags{
    display: flex;
    gap: 5px;
}

</style>