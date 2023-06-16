<!-- 
    User view reached by supplying [user_slug] in params
    allows for viewing and editing/patching
 -->
<script setup>
import { useRouter, useRoute, routerKey } from 'vue-router';

import { ref } from 'vue';
// import PreviewList from '../components/PreviewList.vue'; 
import PostsPaginated from '../components/PostsPaginated.vue';
import GoBackButton from '../components/GoBackButton.vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const user_slug = route.params.user_slug;
const query_string = `posts/?author=${user_slug}`;

const user = ref();
const userExists = ref(0);
const errorMsg = ref();
// const posts = ref([]);
// const pages = ref([]);

//for pagination
const PAGE_SIZES = [5, 10, 15];

//TODO: nowy img itd..
const newName = ref('');
const newUsername = ref('');
const newMail = ref('');
const newBio = ref('');

const success = ref('');
const error = ref('');

const beingEdited = ref(0);
const openEdit = () =>{
    newName.value = user.value.name;
    newUsername.value = user.value.username;
    newMail.value = user.value.mail;
    newBio.value = user.value.bio;
    beingEdited.value = 1;
}

const submitEdit = async function(slug){
    const newPost = {
        name: newName.value,
        username: newUsername.value,
        mail: newMail.value,
        bio: newBio.value
    }
    axios.patch(`users/${slug}`, newPost)
    .then((res)=>{
        success.value += res.status + ' ' + res.statusText; 
    })
    .catch((err)=>{
        error.value += err;
    })
    .finally(()=>{
        newName.value = '';
        newUsername.value = '';
        newMail.value = '';
        newBio.value = '';
        getUser(user_slug);
        beingEdited.value = 0;
    })
}

const getUser = function(slug){
    axios.get(`users/${slug}`)
    .then((res)=>{
        user.value = res.data;
        userExists.value = 1;
    })
    // .then(()=>{
    //     getPosts(`posts/?author=${user_slug}`);
    // })
    .catch((error)=>{
        userExists.value = 0;
        errorMsg.value = error;
        router.push({name: 'catchall', params:{wrong_param: user_slug}});
    })
}

// const getPosts = async function(link){
//     posts.value = [];
//     axios.get(link)
//     .then((res)=>{
//         posts.value = res.data.results;
//         pages.value = res.data.context.page_links;
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// }

getUser(user_slug);

</script>

<template>
    <div class="main" v-if="userExists">
        <GoBackButton></GoBackButton>
        <!-- basic view -->
        <div class="user-info" v-if="!beingEdited">
            <img :src=user.avatar>
            <p class="name">{{ user.name }}</p>
            <p class="username">{{ user.username }}</p>
            <p class="mail">{{ user.mail }}</p>
            <p class="bio">{{ user.bio }}</p>
        </div>
        <!-- turn display into inputs for editing -->
        <div v-if="beingEdited" class="user-info">
            <img :src=user.avatar>
            <div class="label-div">
                <label for="name" class="name">name:</label>
                <input type="text" id="name" class="name" v-model="newName">
            </div>
            <div class="label-div">
                <label for="username" class="username">username:</label>
                <input type="text" id="username" class="username" v-model="newUsername">
            </div>
            <div class="label-div">
                <label for="mail" class="mail">mail:</label>
                <input type="email" id="mail" class="mail" v-model="newMail">
            </div>
            <div class="label-div">
                <label for="bio" class="name">bio:</label>
                <textarea id="bio" class="bio-input" v-model="newBio"></textarea>
            </div>
        </div>
        <button class="submit-button hover" v-if="!beingEdited" @click="openEdit">EDIT USER</button>
        <button class="submit-button hover" v-if="beingEdited" @click="submitEdit(user_slug)">CONFIRM</button>
        <p v-if="success" class="success">{{success}}</p>
        <p v-if="error" class="error">{{error}}</p>
        <p class="user-info"> {{ user.name }}'s posts:</p>
        <PostsPaginated :type="'small'" :page_sizes="PAGE_SIZES"
            :query_string="query_string"></PostsPaginated>

    </div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
.user-info, .user-posts{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-direction: column;
    font-size: 2rem;
}
.label-div{
    display: flex;
    gap: 1rem;
    font-size: 2rem;
}
.bio-input{
    width: 24rem;
    height: 8rem;
}
.submit-button{
    width: 12rem;
    height: 3rem;
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
.success, .error{
    font-size: 2rem;
    font-weight: 500;
    color: green;
}
.error{
    color: red;
}
</style>