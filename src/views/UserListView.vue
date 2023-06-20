<script setup>
import {ref} from 'vue'
import axios from 'axios'
const users = ref();

const getAllUsers = async function(){
    axios.get('users')
    .then((res)=>{
        users.value = res.data;
        console.log(res.statusText);
    })
    .catch((err)=>{
        console.log(err.statusText);
    })
}

getAllUsers();

</script>

<template>
<div class="main">
    <p class="title">ALL USERS LIST:</p>
    <ol class="users" v-if="users">
        <li v-for="user in users">
            <router-link :to="{name: 'user', params:{user_slug: user.slug}}">{{user.slug}}</router-link>
        </li>
    </ol>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
}
</style>