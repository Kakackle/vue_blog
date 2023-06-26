<script setup>
import {ref} from 'vue'
import axios from 'axios'
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
    <p class="title">ALL USERS LIST:</p>
    <ol class="posts" v-if="posts">
        <li v-for="post in posts">
            <router-link :to="{name: 'post', params:{post_slug: post.slug}}">
            {{post.slug}} - by: {{ post.author }}</router-link>
        </li>
    </ol>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
}
</style>