<script setup>
import { ref } from 'vue';
import PreviewList from './PreviewList.vue';
const props = defineProps(['posts', 'pages']);
const posts = ref(props.posts);
const pages = ref(props.pages);

import { getDataFromLink } from "../composables/axiosComposables";

const selectedPage = ref(0);

const getPosts = async function(link){
    posts.value = [];
    const data = (await getDataFromLink(link)).value;
    posts.value = data.results;
    pages.value = data.context.page_links;
}

const getPostsByPage = async function(link, page_id){
    getPosts(link);
    selectedPage.value = page_id;
}
</script>

<template>
    <div class="post-list" v-if="posts">
        <PreviewList v-for="(post, post_id) in posts" :post="post"></PreviewList>
        <div class="pages" v-if="pages">
            <p class="page" v-for="(page, page_id) in pages"
            @click="getPostsByPage(page[0], page_id)"
            :class="(selectedPage === page_id)? 'selected' : 'normal'">{{ page[1] }}</p>
        </div>
    </div>
</template>

<style scoped>
.pages{
    display: flex;
    justify-content: center;
    font-size: 2.5rem;
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