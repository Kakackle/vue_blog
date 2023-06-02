<script setup>
import { storeToRefs } from 'pinia';
import { usePostsStore } from '../stores/posts';
import { useUserStore } from '../stores/users';
import {ref} from 'vue';

import { useRouter } from 'vue-router';

import axios from 'axios';

const router = useRouter();

// const postsStore = usePostsStore();
// const {posts} = storeToRefs(postsStore)
const post = props.post

// const userStore = useUserStore();
// const {users} = storeToRefs(userStore)
// const user = users.value[post.author];

const user = ref();
// const getUserById = function(id){
//     axios.get(`http://127.0.0.1:8000/api/users/${id}`)
//     .then((response)=>{
//         user.value=response.data;
//         // console.log(JSON.stringify(user.value))
//     })
//     .catch((error)=>{
//         console.log(`error: ${error}`)
//         router.push({name: 'catchall', params: {}});
//     })
// }
// onBeforeMount(()=>{
//     // console.log(`props: ${JSON.stringify(post)}`)
//     getUserById(post.author);
// })
user.value = post.author;

const props = defineProps(['post'])
</script>

<template>
<div class="card-preview" >
    <div class="top">
        <img class="card-img" :src=post.img>
    </div>
    <div class="bottom">
        <p class="title">{{ post.title }}</p>
        <div class="tags">
            <p v-for="tag in post.tags" class="tag hover"
            @click="router.push(`/tag/${tag.id}`)">{{ tag.name }}</p>
        </div>
        <p class="author hover"
        @click="router.push(`/user/${user.id}`)">{{ user.name }}</p>
        <p class="content">{{ post.content.slice(0,100) }}...</p>
        <p class="date">{{ post.date_posted }}</p>
    </div>
    <!-- <p class="post_id">{{ post.id }}</p> -->
    <ion-icon class="arr-icon hover" name="arrow-forward-outline"
    @click="router.push(`/post/${post.id}`)"></ion-icon>

</div>
</template>

<style scoped>
.card-preview{
    width: 30%;
    height: 100%;
    box-shadow: 0px 5px 12px rgba(0,0,0,0.15);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    position: relative;
}
.top, .card-img{
    width: 100%;
    aspect-ratio: 3/2;
}

.bottom{
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    font-size: 2rem;
    color: #636e72;
    position: relative;
    padding: 1rem;
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

.title{
    font-size: 2.4rem;
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
    bottom: 1rem;
    right: 1rem;
}

.date{
    position: absolute;
    top: 1rem;
    right: 1rem;
    filter: opacity(0.5);
}
.arr-icon{
    position: absolute;
    font-size: 1.5rem;
    bottom: 1rem;
    right: 1rem;
}
</style>