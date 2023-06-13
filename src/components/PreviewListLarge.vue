<script setup>

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
const router = useRouter();

const props = defineProps(['post'])
const post = props.post

const user = ref();
user.value = post.author;

const getAuthor = async function(){
    axios.get(`users/${user.value}`)
    .then((res)=>{
        user.value = res.data;
    })
    .catch((err)=>{
        console.log(err);
    })
}

getAuthor();

</script>

<template>
<div class="list-preview hover">
    <div class="left">
        <img :src=post.img class="img">
    </div>
    <div class="right">
        <p class="title">{{ post.title }}</p>
        <div class="tags">
            <p v-for="tag in post.tags" class="tag hover"
            @click="router.push({name: 'tag', params: {tag_slug: tag}})"
            >{{ tag }}</p>
        </div>
        
        <p class="author hover" v-if="user.name"
        @click="router.push({name: 'user', params: {user_slug: user.slug}})"
        >{{ user.name }}</p>
        
        <p class="content">{{ post.content.slice(0,250) }}...</p>
    </div>
    <p class="post_id">{{ post.id }}</p>
    <p class="date">{{ post.date_posted }}</p>
    <ion-icon class="arr-icon hover" name="arrow-forward-outline"
    @click="router.push({name: 'post', params:{post_slug: post.slug}})"
    ></ion-icon>
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
    right: 3.5rem;
    color:#636e72;
}
.arr-icon{
    position: absolute;
    font-size: 1.5rem;
    bottom: 1rem;
    right: 1rem;
}
</style>