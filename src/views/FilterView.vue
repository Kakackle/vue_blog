<script setup>
import PreviewList from "../components/PreviewList.vue";
import {ref, render} from 'vue';
import { getDataFromLink } from "../composables/axiosComposables";

const posts=ref([])
const renderPosts = ref(posts);
const authorField = ref("");

const base_link=`http://127.0.0.1:8000/api/posts/`;

const getPosts = async function(link){
    posts.value = (await getDataFromLink(link)).value;
    renderPosts.value = posts.value;
}

const filterBySearch = async function(){
    renderPosts.value = ( await getDataFromLink(base_link+`?author=${authorField.value}`)).value;
}

getPosts(base_link);

</script>
    
<template>
<div>
    <p>Filtering by query params test</p>
    <p><input type="text" v-model="authorField" @keyup.enter="filterBySearch"></p>
    <div class="post-list" v-if="renderPosts">
        <PreviewList v-for="(post, post_id) in renderPosts" :post="post"></PreviewList>
    </div>

</div>
</template>

<style scoped>
div p{
    font-size: 2rem;
}
</style>