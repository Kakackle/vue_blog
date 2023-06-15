<!-- 
    Komponent realizujacy sekcje wyswietlajaca posty w postaci listy z paginacja
    jako propy przyjac moze typ listy "small" lub "large" w zaleznosci od pozadanego
    typu podkomponentu, wraz z dzialajaca paginacja otrzymywana w postaci linkow z API
    
    samo pobiera dane do wyswietlania z API
    
    TODO: obsluga zmiany page size jakos tak jak w BlogView z query stringiem
    bo to dosyc integralna czesc komponentu paginacji i nie chcialbym musiec
    dodawac obsluge tego w kazdym komponencie ktory uzywa postspaginated

    wiec musialbym modyfikowac otrzymane z zewnatrz linki do stron?
 -->
<script setup>
import { nextTick, ref } from 'vue';
import PreviewList from './PreviewList.vue';
import PreviewListLarge from './PreviewListLarge.vue'
// import { getDataFromLink } from "../composables/axiosComposables";
import axios from 'axios';

// const props = defineProps(['posts', 'pages', 'type', 'page_sizes']);
const props = defineProps({
    // posts:{},
    // pages:{},
    type:{
        type: String,
        default: "small"
    },
    page_sizes:{
        default: [5, 10, 15]
    },
    query_string:{
        type: String,
        default: 'posts/?'
    }
});

const type = ref(props.type);
const page_sizes = ref(props.page_sizes);
const selected_size = ref(page_sizes.value[0]);
//otrzymany query string z filtrami
const query_string = ref(props.query_string);
//pelny query zawierajacy takze page oraz page_size
const full_query = ref(query_string.value);

// const emit = defineEmits(['set_page_size'])
const set_page_size = async function(size){
    selected_size.value = size;
    // query_string.value += `?page_size=${size}`;
    let full_query = query_string.value + `&page_size=${size}`;
    posts.value = [];
    pages.value = [];
    getPosts(full_query);
}

//posts oraz pages - moga byc pelne lub po filtracji z zewnetrznego view
const posts = ref(props.posts);
const pages = ref(props.pages);

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

// getPostsByPage('posts/', selectedPage.value);
getPosts(query_string.value);

</script>

<template>
    <div class="post-list" v-if="posts">
        <div class="page_size">
          <p class="hover" v-for="(size, size_id) in page_sizes"
            @click="set_page_size(size, size_id)"
            :class="(selected_size === page_sizes[size_id])? 'selected' : 'normal'"
          >{{size}}
          <!-- <p>selected: {{ selected_size }}</p>
          <p>size_id: {{ page_sizes[size_id] }}</p> -->
        </p>
          
        </div>
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
.page_size{
  display: flex;
  gap: 1rem;
  font-size: 1.5rem;
  right: 1rem;
  align-self: end;
  transform: translateX(-4rem);
}
.hover:hover{
  cursor: pointer;
  filter: brightness(0.7);
}
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