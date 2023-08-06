<!-- 
    TODO: zarzadzanie jak ze jesli uzytkownik ma polubiony post i jest on na stronie,
    to ikonka lajka zmienia kolor na zolty np
 -->
<script setup>

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

import Tag from './Tag.vue';

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
<div class="list-preview unified-shadow">
    <div class="left">
        <img :src=post.img class="img">
    </div>

    <div class="right">
        <div class="top">
            <div class="top-left">
                <p class="title">{{ post.title }}</p>
            </div>
            <div class="top-right">
                <!-- <p class="post_id">id: {{ post.id }}</p> -->
                <p class="likes">
                    <ion-icon class="like-icon hover" name="thumbs-up-sharp"
                    @click="updateLiked()"></ion-icon>
                    <p>{{ post.likes }}</p>
                </p>
                <p class="views"><ion-icon class="like-icon" name="eye">
                    </ion-icon>
                    <p>{{ post.views }}</p>
                </p>
                <p class="date">{{ post.date_posted }}</p>
            </div>
        </div>
        <div class="bottom">
            <div class="tags">
                <Tag v-for="tag in post.tags" class="tag hover"
                @click="router.push({name: 'tag', params: {tag_slug: tag}})"
                :tag="tag"></Tag>
            </div>
            
            <p class="author hover" v-if="user.name"
                @click="router.push({name: 'user', params: {user_slug: user.slug}})"
            >{{ user.name }}</p>
            
            <p class="content">{{ post.content.slice(0,250) }}...</p>
        </div>
    </div>

    <ion-icon class="arr-icon hover" name="arrow-forward-outline"
        @click="router.push({name: 'post', params:{post_slug: post.slug}})"
    ></ion-icon>
    
</div>
</template>

<style scoped>
.list-preview{
    /* width: 900px; */
    width: clamp(500px, 100%, 900px);
    /* height: 10rem; */
    padding: 1rem;
    /* box-shadow: 0px 5px 12px rgba(0,0,0,0.15); */
    /* border-radius: 0.5rem; */
    display: flex;
    position: relative;
    border-bottom: 8px solid var(--dark-gray);
    margin-bottom: 20px;
}

.left{
    display: flex;
    /* align-items: center; */
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
}

.img{
    height: 120px;
    width: 180px;
}

.right{
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.top{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.top-right{
    display: flex;
    align-items: center;
    gap: 10px;
}

.post_id, .date{
    font-size: 1.5rem;
    color:var(--mid-gray);
}
.likes, .views{
    color:var(--dark-gray);
    display: flex;
    align-items: top;
    font-size: 2rem;
    gap: 5px;
}
.like-icon{
    font-size: 1.5rem;
    color:var(--dark-gray);
    /* right: 3rem; */
}
.arr-icon{
    position: absolute;
    font-size: 1.5rem;
    bottom: 1rem;
    right: 1rem;
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

.content{
    font-size: 1.2rem;
}

</style>