<!-- 
    Komponent realizujacy sekcje wyswietlajaca posty w postaci listy z paginacja
    jako propy przyjac moze typ listy "small" lub "large" w zaleznosci od pozadanego
    typu podkomponentu, wraz z dzialajaca paginacja otrzymywana w postaci linkow z API
    
    samo pobiera dane do wyswietlania z API

    TODO: dodac mozliwosc przesylania w prop page_size do brania z API
    zrealizowane w postaci wyboru nad postami z np 3 opcji typu 5 10 15
 -->
<script setup>
import { nextTick, ref } from 'vue';
import PreviewList from './PreviewList.vue';
import PreviewListLarge from './PreviewListLarge.vue'
// import { getDataFromLink } from "../composables/axiosComposables";
import axios from 'axios';

// const props = defineProps(['posts', 'pages', 'type']);
const props = defineProps(['type']);
const type = ref(props.type);

// const posts = ref(props.posts);
// const pages = ref(props.pages);
const posts = ref([]);
const pages = ref([]);
const selectedPage = ref(0);

const getPosts = async function(link){
    posts.value = [];
    pages.value = [];
    await nextTick();

    axios.get('posts/')
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
        <PreviewList v-for="(post, post_id) in posts" :post="post"
            v-if="type === 'small'"></PreviewList>
        <PreviewListLarge v-for="(post, post_id) in posts" :post="post" 
            v-if="type === 'large'"></PreviewListLarge>
        <div class="pages" v-if="pages">
            <p class="page" v-for="(page, page_id) in pages"
                @click="getPostsByPage(page[0], page_id)"
                :class="(selectedPage === page_id)? 'selected' : 'normal'"
                >{{ page[1] }}</p>
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