<script setup>
import {ref} from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
const router = useRouter();
const users = ref();

const getAllUsers = async function(){
    axios.get('users')
    .then((res)=>{
        users.value = res.data;
        console.log(`all users get: ${res.statusText}`);
    })
    .catch((err)=>{
        console.log(`all users get error: ${err.statusText}`);
    })
}

getAllUsers();

</script>

<template>
<div class="main">
    <p class="title">ALL USERS LIST:</p>
    <section class="users" v-if="users">
        <div class="user" v-for="user in users">
            <img class="user-img" :src="user.avatar">
            <div class="user-right">
                <p class="name">{{ user.name }}</p>
                <p class="desc">{{ user.mail }}</p>
                <p class="desc">{{ user.bio }}</p>
                <p class="desc">{{user.post_count}} posts by user</p>
            </div>
            <ion-icon name="arrow-forward-outline" class="icon hover"
            @click="router.push({name: 'user', params:{user_slug: user.slug}})"
            ></ion-icon>
        </div>
    </section>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    margin: 0 auto;
    color: var(--dark-gray);
}
.title{
    font-size: 4rem;
}
.users{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: calc(var(--max-page-width) - 200px);
    width: 100%;
}
.user{
    position: relative;
    display: flex;
    gap: 20px;
}

.user-img{
    height: 80px;
    width: 80px;
    border-radius: 50%;
    align-self: center;
}

.user-right{
    font-size: 2rem;
    display: flex;
    flex-direction: column;
}
.icon{
    font-size: 2rem;
    position: absolute;
    right: 1rem;
    bottom: 1rem;
}

.name{
    font-weight: 500;
    text-decoration: underline;
}
</style>