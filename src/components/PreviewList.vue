<script setup>

import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
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
        console.log(err);
    })
}

getAuthor();

// funkcja bierze z postu property "liked_by"
// i jesli uzytkownik jest zalogowany to pozwala mu przechodzic dalej
// i jesli zalogowany uzytnik nie jest w "liked_by"
// to dodaje do tablicy i patchuje post z ta nowa tablica uzytkownikow
// oraz z dlugoscia odpowiadajaca countowi lajkow
const updateLiked = async function(){
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
    // console.log(`new liked by: ${new_liked_by.value.slug}`);
    // console.log(`post liked_by: ${post.liked_by}`);
    // console.log(`post: ${JSON.stringify(post.liked_by)}`)
    // console.log(post.liked_by.filter((slug)=>{ return slug === loggedUser.value.slug}))
    if(post.liked_by.filter((slug)=>{ return slug === loggedUser.value.slug}).length === 0){
        console.log(`logged user not in liked_by`);

        // liked_by.value.push(post.liked_by);
        // console.log(`liked_by value: ${liked_by.value}`);

        // liked_by.value.push(new_liked_by.value.slug);
        // console.log(`liked_by to be sent: ${JSON.stringify(liked_by.value)}`);
        post.liked_by.push(new_liked_by.value.slug);
        // console.log(`post liked by to be sent: ${post.liked_by}`)
        axios.patch(`posts/${post.slug}`, {
            liked_by: post.liked_by,
            likes: post.liked_by.length
        })
        .then((res)=>{
            // console.log(`added_liked: ${res.statusText}`);
            success.value = `added to likes, ${res.status}, ${res.statusText}`;
            toast.success(success.value);
            new_liked_by.value=undefined;
            
        })
        .catch((err)=>{
            error.value = `${err.status}, ${err.statusText}`;
            toast.error(error.value);
            console.log(err);
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
        <p class="date">{{ post.date_posted }}</p>
    </div>

    <div class="right">
        <p class="title">{{ post.title }}</p>
        <div class="tags">
            <p v-for="tag in post.tags" class="tag hover"
                @click="router.push({name: 'tag', params: {tag_slug: tag}})"
            >{{ tag }}</p>
        </div>
        <p class="author hover" v-if="user.name"
            @click="router.push({name: 'user', params: {user_slug: user.slug}})">{{ user.name }}</p>
        <p class="content">{{ post.content.slice(0,100) }}...</p>
    </div>

    <p class="post_id">id: {{ post.id }}</p>
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
    align-items: center;
    font-size: 2rem;
    color: #636e72;
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
.post_id{
    font-size: 1.5rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
}
.views{
    top: 2.5rem;
}
.likes{
    top: 4rem;
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