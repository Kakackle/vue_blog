<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/users';
import { usePostsStore } from '../stores/posts';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import PreviewList from '../components/PreviewList.vue'; 
const userStore = useUserStore();
const postsStore = usePostsStore();
const route = useRoute();
const user_id = parseInt(route.params.user_id);
const posts = postsStore.getPostsByAuthor(user_id);
const {users} = storeToRefs(userStore);
const user = users.value[user_id]


</script>

<template>
    <div class="user-info">
        <img :src=user.avatar>
        <p class="name">{{ user.name }}</p>
        <p class="username">{{ user.username }}</p>
        <p class="mail">{{ user.mail }}</p>
        <p class="bio">{{ user.bio }}</p>
    </div>
    <div class="user-posts">
        <PreviewList v-for="(post, post_id) in posts" :post="post"></PreviewList>
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