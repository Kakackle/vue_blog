<script>
/**
 * @file PostsPaginated.vue - pag
 * @author MM
 * @see <a href="https://google.com"> Google </a>
 */

</script>

<script setup>


import { nextTick, ref } from 'vue';
import PreviewList from './PreviewList.vue';
import PreviewListLarge from './PreviewListLarge.vue'
// const props = defineProps(['posts', 'pages', 'type']);
const props = defineProps(['type']);
// const posts = ref(props.posts);
// const pages = ref(props.pages);
const posts = ref([]);
const pages = ref([]);

const type = ref(props.type);
// const checkType = function(){
//     console.log(`type: ${type === 'small'}`)
// }
import { getDataFromLink } from "../composables/axiosComposables";
import axios from 'axios';

const selectedPage = ref(0);

/**
 * Get posts from backend by supplied link
 * @param {*} link 
 */
const getPosts = async function(link){
    posts.value = [];
    pages.value = [];
    await nextTick();
    // const data = (await getDataFromLink(link)).value;
    axios.get(link)
    .then((res)=>{
        posts.value = res.data.results;
        pages.value = res.data.context.page_links;
    })

}

const getPostsByPage = async function(link, page_id){
    getPosts(link);
    selectedPage.value = page_id;
}

getPostsByPage('http://127.0.0.1:8000/api/posts', selectedPage.value);

</script>

<template>
    <div class="post-list" v-if="posts">
        <PreviewList v-for="(post, post_id) in posts" :post="post" v-if="type === 'small'"></PreviewList>
        <PreviewListLarge v-for="(post, post_id) in posts" :post="post" v-if="type === 'large'"></PreviewListLarge>
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
.post-list{
    display: flex;
    flex-direction: column;
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