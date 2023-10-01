<!-- 
    renderowanie jest czescia wlasnie komponentu postu i musi sprawdzac
    np. czy author.slug = loggedUser.slug
 -->
<script setup>

import { useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';
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
const post = ref(props.post);

const user = ref();
user.value = post.value.author;

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

const emit = defineEmits(['refresh']);

const updateLikedNew = async function(){
    success.value='';
    error.value='';
    // jesli stan zalogowanego uzytkownika nie jest aktualny
    if(!loggedUser.value.slug){
        loggedUser.value = userStore.getUser();
    }
    // jesli uzytkownik mimo to nie zadawany
    if(!loggedUser.value){
        toast.error(`log in first before trying to like`);
        return
    }
    if(loggedUser.value.slug === post.value.author){
        toast.error(`you can't like your own posts, silly`);
        return
    }
    axios.patch(`posts/${post.value.slug}/like`, {
        user: loggedUser.value.id
    })
    .then((res)=>{
        console.log(res.data.message);
        success.value = `updated likes, ${res.status}, ${res.statusText}`;
        toast.success(success.value);
        emit('refresh');
    })
    .catch((err)=>{
        console.log(err);
        error.value = `${err.status}, ${err.statusText}`;
        toast.error(error.value);
    })
}  

// if post liked by logged user

const post_liked = computed(()=>{
    if(loggedUser.value && post.value)
        return post.value.liked_by.includes(loggedUser.value.slug);
    else return false;
})

// Try using markdown in preview
import { marked } from "marked";
const compiledMarkdown = computed(() => {
  return DOMPurify.sanitize(marked.parse(post.value.content.slice(0,250), {
    mangle: false,
    headerIds: false,
  }));
});

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
                <p class="likes">
                    <ion-icon class="like-icon hover" name="thumbs-up-sharp"
                    @click="updateLikedNew()"
                    :class="{'post-liked': post_liked}"></ion-icon>
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
            <div class="content prose" v-html="compiledMarkdown"></div>
        </div>
    </div>
    
    <p class="hover-underline read-more"
    @click="router.push({name: 'post', params:{post_slug: post.slug}})">
        <span>read more</span>
        <ion-icon class="arr-icon" name="arrow-forward-outline"
        ></ion-icon>
    </p>

    
</div>
</template>

<style scoped>
.list-preview{
    width: clamp(500px, 100%, 900px);
    height: 220px;
    padding: 1rem;
    display: flex;
    position: relative;
    border-bottom: 8px solid var(--dark-gray);
    margin-bottom: 20px;
    overflow: hidden;
}

.left{
    display: flex;
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
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow: hidden;
}

.right:after {
  content: '';
  position: absolute;
  left: 0px;
  right: 0px;
  height: 20%;
  bottom: 0px;
  background: linear-gradient(180deg, rgba(139,167,32,0) 0%, rgba(255,255,255,1) 100%);
  pointer-events: none;
}

.top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid black;
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
    color: var(--dark-gray);
    visibility: visible;
}

.post-liked{
    color: var(--accent-yellow);
    visibility: visible;
}

.read-more{
    position: absolute;
    font-size: 20px;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.arr-icon{
    font-size: 15px;
    visibility: visible;
}

.title{
    font-size: 2.4rem;
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
    margin-top: 10px;
    font-size: 1.2rem;
    max-width: 700px;
}

</style>