<script setup>
import PreviewList from "../components/PreviewList.vue";
import {ref, render} from 'vue';
import { getDataFromLink } from "../composables/axiosComposables";

const posts=ref([])
const renderPosts = ref(posts);
const authorField = ref("");
const pages = ref([])

const base_link=`posts/`;

const getPosts = async function(link){
    posts.value = [];
    renderPosts.value = [];
    const data = (await getDataFromLink(link)).value;
    console.log(`results: ${JSON.stringify(data.results)}`)
    posts.value = data.results;
    console.log(`posts.: ${JSON.stringify(data.results)}`)
    pages.value = data.context.page_links;
    renderPosts.value = posts.value;
}

const getPostsByPage = async function(link){
    getPosts(link);
}

const filterBySearch = async function(){
    renderPosts.value = ( await getDataFromLink(base_link+`?author=${authorField.value}`)).value.results;
}

getPosts(base_link);

</script>
    
<template>
<div>
    <p>Filtering by query params test</p>
    <p><input type="text" v-model="authorField" @keyup.enter="filterBySearch"></p>
    <div class="post-list" v-if="renderPosts">
        <PreviewList v-for="(post, post_id) in renderPosts" :post="post"></PreviewList>
        <p class="page" v-for="(page, page_id) in pages" @click="getPostsByPage(page[0])">{{ page[1] }}</p>
    </div>

</div>
</template>

<style scoped>
div p{
    font-size: 2rem;
}
.page:hover{
    font-weight: 600;
    cursor: pointer;
}
</style>