<!-- 
    Komponent realizujacy sekcje wyswietlajaca posty w postaci listy z paginacja
    jako propy przyjac moze typ listy "small" lub "large" w zaleznosci od pozadanego
    typu podkomponentu, wraz z dzialajaca paginacja otrzymywana w postaci linkow z API
    
    samo pobiera dane do wyswietlania z API
    
    wszystkie props opcjonalne:

    - query_string: <String> zaczynajacy sie od 'posts/?', ex. 'posts/?author=admin'

    w przeciwnym wypadku bedzie wyswietlac wszystkie posty

    - page_sizes: <Array[Int]> ex. [5, 10, 15] rozmairow page size do wyboru

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
//wybrany w komonencie rozmiar strony
const selected_size = ref(page_sizes.value[0]);
const page_orders = ["date_posted", "title", "views", "likes"];
//wybrany w komponencie sposob sortowania
const selected_order = ref('date_posted');
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

const set_order = async function(order){
    selected_order.value = order;
    // query_string.value += `?page_size=${size}`;
    let full_query = query_string.value + `&ordering=${order}`;
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
        <div class="controls">
            <div class="page_size">
            <p class="hover" v-for="(size, size_id) in page_sizes"
                @click="set_page_size(size)"
                :class="(selected_size === page_sizes[size_id])? 'selected' : 'normal'"
            >{{size}}</p>
            <!-- <p>selected: {{ selected_size }}</p>
            <p>size_id: {{ page_sizes[size_id] }}</p> --> 
            </div>
            
            <div class="page_size order">
            <p class="hover" v-for="(order, order_id) in page_orders"
                @click="set_order(order)"
                :class="(selected_order === page_orders[order_id])? 'selected' : 'normal'"
            >{{order}}</p>
            <!-- <p>selected: {{ selected_size }}</p>
            <p>size_id: {{ page_sizes[size_id] }}</p> -->
            </div>
        </div>
        <div clas="post-list" v-if="posts.length != 0">
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
        <div v-else class="no-posts-message">
            <p>NO POSTS TO DISPLAY WITH CURRENTLY APPLIED FILTERS, PLEASE TRY A DIFFERENT COMBINATION</p>
            <p> THANKS ;]</p>
        </div>
    </div>
</template>

<style scoped>
.controls{
    display: flex;
    gap: 2rem;
    align-self: end;
    /* transform: translateX(-4rem); */
    /* font-size: 2rem; */
}
.page_size{
  display: flex;
  gap: 1rem;
  font-size: 2rem;
  /* right: 1rem; */
  align-self: end;
  transform: translateX(-4rem);
}
.order{
    right: 4rem;
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

.no-posts-message{
    width: clamp(400px, 100%, 800px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 2.5rem;
    color: var(--dark-gray);
    padding: 20px;
    /* margin: 0 auto; */
}
</style>