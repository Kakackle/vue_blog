<script setup>
import { useRouter, useRoute, routerKey } from 'vue-router';
// import { useUserStore } from '../stores/users';
// import { usePostsStore } from '../stores/posts';
// import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import PreviewList from '../components/PreviewList.vue'; 
import GoBackButton from '../components/GoBackButton.vue';
import axios from 'axios';
// const userStore = useUserStore();
// const postsStore = usePostsStore();
const route = useRoute();
const router = useRouter();
const user_id = parseInt(route.params.user_id);
// const posts = postsStore.getPostsByAuthor(user_id);
// const {users} = storeToRefs(userStore);
// const user = users.value[user_id]

const user = ref();
const userExists = ref(0);
const errorMsg = ref();
const posts = ref([]);

const getUser = function(id){
    axios.get(`http://127.0.0.1:8000/api/users/${id}`)
    .then((res)=>{
        user.value = res.data;
        userExists.value = 1;
    })
    .then(()=>{
        user.value.posts.forEach(post =>{
            getPostByHyperlink(post);
        })
    })
    .catch((error)=>{
        userExists.value = 0;
        errorMsg.value = error;
        router.push({name: 'catchall', params:{user_id: user_id}});
    })
}

const getPostByHyperlink = async function(link){
    await axios.get(link)
    .then((res)=>{
        posts.value.push(res.data);
    })
}

getUser(user_id);

</script>

<template>
    <div v-if="userExists">
        <GoBackButton></GoBackButton>
        <div class="user-info" >
            <img :src=user.avatar>
            <p class="name">{{ user.name }}</p>
            <p class="username">{{ user.username }}</p>
            <p class="mail">{{ user.mail }}</p>
            <p class="bio">{{ user.bio }}</p>
        </div>
        <p class="user-info"> {{ user.name }}'s posts:</p>
        <div class="user-posts">
            <PreviewList v-for="(post, post_id) in posts" :post="post"></PreviewList>
        </div>
    </div>
</template>

<style scoped>
.user-info, .user-posts{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-direction: column;
    font-size: 2rem;
}
</style>