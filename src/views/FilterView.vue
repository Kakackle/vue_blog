<script setup>
import PreviewList from "../components/PreviewList.vue";
import {ref, render} from 'vue';
import { getDataFromLink } from "../composables/axiosComposables";

const posts=ref([])
const renderPosts = ref(posts);
const authorField = ref("");
const pages = ref([])
const selectedPage = ref(0);

const base_link=`posts/`;

const getPosts = async function(link){
    posts.value = [];
    renderPosts.value = [];
    const data = (await getDataFromLink(link)).value;
    posts.value = data.results;
    pages.value = data.context.page_links;
    renderPosts.value = posts.value;
}

const getPostsByPage = async function(link, page_id){
    getPosts(link);
    selectedPage.value = page_id;
}

//search by author name query (only)
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
        <div class="pages">
            <p class="page" v-for="(page, page_id) in pages"
            @click="getPostsByPage(page[0], page_id)"
            :class="(selectedPage === page_id)? 'selected' : 'normal'">{{ page[1] }}</p>
        </div>
    </div>

</div>
</template>

<style scoped>
div p{
    font-size: 2rem;
}
.pages{
    display: flex;
    gap: 1rem;
}
.page:hover{
    font-weight: 600;
    cursor: pointer;
}
.selected{
    font-weight: 700;
}
</style>