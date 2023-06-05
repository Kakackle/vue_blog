<script setup>

import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';

const router = useRouter();

const post = props.post

// const user = ref();
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
const user = ref();
user.value = post.author;

const props = defineProps(['post'])
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
            @click="router.push(`/tag/${tag.id}`)"
            >{{ tag.name }}</p>
        </div>
        <p class="author hover"
         @click="router.push(`/user/${user.id}`)">{{ user.name }}</p>
        <p class="content">{{ post.content.slice(0,100) }}...</p>
    </div>
    <p class="post_id">id: {{ post.id }}</p>
    <p class="post_id views">views: {{ post.views }}</p>
    <ion-icon class="arr-icon hover" name="arrow-forward-outline"
    @click="router.push(`/post/${post.id}`)"></ion-icon>
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
.arr-icon{
    position: absolute;
    font-size: 1.5rem;
    bottom: 1rem;
    right: 1rem;
}
</style>