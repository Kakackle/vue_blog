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

const props = defineProps(['posts', 'pages', 'type']);
// const props = defineProps(['type']);
const type = ref(props.type);

//posts oraz pages - moga byc pelne lub po filtracji z zewnetrznego view
const posts = ref(props.posts);
const pages = ref(props.pages);
// console.log(`pages: ${pages.value}`)
// const posts = ref([]);
// const pages = ref([]);
const selectedPage = ref(0);

const getPosts = async function(link){
    axios.get(link)
    .then((res)=>{
        posts.value = res.data.results;
        pages.value = res.data.context.page_links;
    })

}

const getPostsByPage = async function(link, page_id){
    posts.value = [];
    pages.value = [];
    await nextTick();
    getPosts(link);
    selectedPage.value = page_id;
}

getPostsByPage('posts/', selectedPage.value);

</script>

<template>
    <div class="post-list" v-if="posts.length">
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