<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';
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
    <div class="card-preview" >
        <div class="top">
            <img class="card-img" :src=post.img>
        </div>

        <div class="bottom">
            <p class="title">{{ post.title }}</p>
            <div class="tags">
                <p v-for="tag in post.tags" class="tag hover"
                    @click="router.push({name:tag, params:{tag_slug: tag}})"
                >{{ tag }}</p>
            </div>
            <p class="author hover" v-if="user.name"
                @click="router.push({name: 'user', params:{user_slug: user.slug}})"
            >{{ user.name }}</p>
            <p class="content">{{ post.content.slice(0,50) }}...</p>
            <p class="date">{{ post.date_posted }}</p>
        </div>

        <!-- <p class="post_id">{{ post.id }}</p> -->
        <ion-icon class="arr-icon hover" name="arrow-forward-outline"
            @click="router.push({name: 'post', params:{post_slug : post.slug}})"
        ></ion-icon>
    </div>
</template>

<style scoped>
.card-preview{
    width: clamp(24rem, 30%, 40rem);
    height: 100%;
    box-shadow: 0px 5px 12px rgba(0,0,0,0.15);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    flex-grow: 1;
    /* flex: 1; */
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