<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Tag from './Tag.vue';

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
        console.log(`get author error: ${err}`);
    })
}

getAuthor();

</script>

<template>
    <div class="card-preview unified-shadow" >
        <div class="top">
            <img class="card-img" :src=post.img>
        </div>

        <div class="bottom">
            <p class="title">{{ post.title }}</p>
            <div class="tags">
                <Tag v-for="tag in post.tags" class="tag hover"
                    @click="router.push({name:tag, params:{tag_slug: tag}})"
                    :tag="tag"
                ></Tag>
            </div>
            <p class="author hover" v-if="user.name"
                @click="router.push({name: 'user', params:{user_slug: user.slug}})"
            >{{ user.name }}</p>
            <p class="content">{{ post.content.slice(0,50) }}...</p>
            <p class="date">{{ post.date_posted }}</p>
        </div>

        <ion-icon class="arr-icon hover" name="arrow-forward-outline"
            @click="router.push({name: 'post', params:{post_slug : post.slug}})"
        ></ion-icon>
    </div>
</template>

<style scoped>
.card-preview{
    width: 360px;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
}
.top, .card-img{
    width: 100%;
    aspect-ratio: 4/2;
}

.bottom{
    display: flex;
    flex-direction: column;
    font-size: 2rem;
    position: relative;
    padding: 1rem;
}
.tags{
    display: flex;
    font-size: 1.2rem;
    gap: 1rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}

.title{
    font-size: 2rem;
}
.author{
    font-size: 1.2rem;
    color: var(--mid-gray);
}
.content{
    font-size: 1.2rem;
    color: var(--dark-gray);
}
.post_id{
    font-size: 1.5rem;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
}

.date{
    position: absolute;
    top: 5px;
    right: 10px;
    filter: opacity(0.5);
}
.arr-icon{
    position: absolute;
    font-size: 1.5rem;
    bottom: 1rem;
    right: 1rem;
}
</style>