<script setup>

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

import {useUserStore} from '../stores/user.js';
const userStore = useUserStore();
const loggedUser = ref(userStore.getUser());

import {useToast} from "vue-toastification";
const toast = useToast();

//nowa wartosc jaka ma byc przeslana, troche useless tbh
const new_liked_by = ref();
const success = ref('');
const error = ref('')

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
        console.log(`get author err: ${err}`);
    })
}

getAuthor();

const updateLiked = async function(){
    console.log(`old liked_by: ${post.liked_by}`);
    success.value='';
    error.value='';
    if(!loggedUser.slug){
        loggedUser.value = userStore.getUser();
    }
    new_liked_by.value = loggedUser.value;
    if(!new_liked_by.value){
        toast.error(`log in first before trying to like`);
        return
    }
    if(post.liked_by.filter((slug)=>{ return slug === loggedUser.value.slug}).length === 0){
        console.log(`logged user not in liked_by`);

        post.liked_by.push(new_liked_by.value.slug);
        console.log(`new liked_by: ${post.liked_by}`);
        
        axios.patch(`posts/${post.slug}`, {
            liked_by: post.liked_by,
            likes: post.liked_by.length
        },
        {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
        })
        .then((res)=>{
            // console.log(`data sent: ${post.liked_by}`)
            success.value = `added to likes, ${res.status}, ${res.statusText}`;
            toast.success(success.value);
            new_liked_by.value=undefined;
            
        })
        .catch((err)=>{
            error.value = `${err.status}, ${err.statusText}`;
            toast.error(error.value);
            console.log(`update like err: ${err}`);
        })
    }
    else{
        console.log('user in liked_by already');
        toast.error('user in liked_by already');
    }
}


</script>

<template>
<div class="list-preview">
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

    <p class="post_id">id: {{ post.id }}</p>
    <p class="date">{{ post.date_posted }}</p>
    <p class="post_id views">views: {{ post.views }}</p>
    <p class="post_id likes">likes: {{ post.likes }}</p>

    <ion-icon class="arr-icon hover" name="arrow-forward-outline"
        @click="router.push({name: 'post', params:{post_slug: post.slug}})"
    ></ion-icon>
    <ion-icon class="arr-icon like-icon hover" name="thumbs-up-sharp"
        @click="updateLiked()"
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
    right: 6rem;
    color:#636e72;
}
.views{
    right: 16rem;
}
.likes{
    right: 24rem;
}
.arr-icon{
    position: absolute;
    font-size: 1.5rem;
    bottom: 1rem;
    right: 1rem;
}
.like-icon{
    right: 3rem;
}
</style>