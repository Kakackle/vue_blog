<!--
TODO: dodac do filterside boxy do filtracji po autorach

TODO: a potem jakos sie zamieni to query na lepszy system filtracji/searchu,
  bo na pewno są, aktualnie jest dosyc kaleki

TODO: czy w jakikolwiek sposob korzystam z rozroznienia miedzy render a zwyklymi
      posts?

TODO: kwestia jest ze PostsPaginated i FilterSide to osobne komponenty, polaczone
      wlasnie poprzez BlogView, dzieki czemu filter wplywa na blog a blog na paginated
      wiec trzeba bedzie chyba znowu zwrocic przesylanie posts i pages do paginated
      bo to nie zawsze jest pelne, a przewaznie wlasnie przefiltrowane
      co dziala, poniewaz przesylamy rowniez linki z query stringami zawartymi w nich
      do celow paginacji

TODO: tutaj wgl nie ma PostsPaginated! a przydaloby sie dodac jak w reszcie elementow
- dlatego ze jest filtracja, ale to nie jest problem, jesli przekazujemy w paginated
linki do stron z zaaplikowana filtracja
-->

<script setup>

import FilterSide from '../components/FilterSide.vue';
import PreviewListLarge from '../components/PreviewListLarge.vue';
import PostsPaginated from '../components/PostsPaginated.vue';
import GoBackButton from '../components/GoBackButton.vue';
import { RouterLink, RouterView } from 'vue-router'
import { nextTick, ref, render } from 'vue';
import axios from 'axios';

//posts przechowywane jako backup wszystkich postow
const posts = ref([]);
//renderPosts jako posty uzyskiwane poprzez API z filtracja z query
const renderPosts = ref(posts);
const pages = ref([]);

const PAGE_SIZES = [5,10,15];
const page_size = ref(PAGE_SIZES[0]);

const set_page_size = async function(size){
  page_size.value = size;
  renderPosts.value=[];
  await nextTick();
  getPostsByFilters(checked.value, selectedPage.value, queryTerm.value, page_size.value);
}

//list of checkboxes from side filter comp
const checked = ref([]);
//query term for post title from side filter comp
const queryTerm = ref('');

const selectedPage = ref(1);

/**
 * Dokonuje filtracji poprzez wykonanie query do API
 * z wybranymi tagami, query term oraz stroną z paginacji
 * przeksztalcanymi w query_string dodawany do adresu endpointu
 * @param {*} tags 
 * @param {*} page 
 * @param {*} search 
 */

const getPostsByFilters = async function(tags, page, search, page_size){
  //podstawowy query z ? oczekujacym na query
  let query_string='posts/?';
  //dla kazdego z wybranych checkboxow odpowiadajacych nazwom tagow
  tags.forEach((tag)=>{
    query_string += `&tag=${tag}`;
  })
  //jesli wskazana strona paginacji
  if (page){
    query_string += `&page=${page}`;
  }
  //jesli query term po tytulach postow
  if(search){
    query_string += `&title=${search}`;
  }
  if(page_size){
    query_string += `&page_size=${page_size}`;
  }
  console.log(`resulting query: ${query_string}`);
  axios.get(query_string)
  .then((res)=>{
    renderPosts.value = res.data.results;
    pages.value = res.data.context.page_links;
  })
  .catch((err)=>
  {
    console.log(err);
  })
}

/**
 * aktualizuje zestaw wybranych tagow na podstawie otrzymanego emitu z FilterSide
 * i wywoluje pobranie nowych danych
 * @param {} checkedTags 
 */
const filterByBoxes = async function(checkedTags){
  checked.value = checkedTags;
  renderPosts.value=[];
  await nextTick();
  getPostsByFilters(checked.value, selectedPage.value, queryTerm.value, page_size.value);
}

const filterByTerm = async function(query){
  queryTerm.value = query;
  renderPosts.value=[];
  await nextTick();
  getPostsByFilters(checked.value, selectedPage.value, queryTerm.value, page_size.value);
}

// const getPostsByPage = async function(page_id){
//   renderPosts.value=[];
//   selectedPage.value = page_id;
//   getPostsByFilters(checked.value, page_id, queryTerm.value);
// }

//initial state, for backup
const getPosts = async function(){
  axios.get('posts/')
  .then((res)=>
  {
    posts.value = res.data.results;
    renderPosts.value = res.data.results;
    pages.value = res.data.context.page_links;
  })
  .catch((err)=>{
    console.log(err);
  })
}

getPosts();

</script>

<template>
  <main>
    <GoBackButton></GoBackButton>
    <p class="blog-title">BLOG TITLE</p>
    <section class="blog-sect">
      <div class="posts-sect" v-if="renderPosts.length">
        <!-- <div class="blog-list">
          <PreviewListLarge v-for="(post, post_id) in renderPosts" :post="post"></PreviewListLarge>
        </div>

        <div class="pages" v-if="pages">
              <p class="page" v-for="page in pages"
              @click="getPostsByPage(page[1])"
              :class="(selectedPage === page[1])? 'selected' : 'normal'">{{ page[1] }}</p>
        </div> -->
        <PostsPaginated :posts="renderPosts" :pages="pages" :type="'large'"
          :page_sizes="PAGE_SIZES"
          v-if="renderPosts.length"
          @set_page_size="set_page_size"></PostsPaginated>
      </div>
    
      <div class="side">
        <FilterSide @filterBox="filterByBoxes" @filterTerm="filterByTerm"></FilterSide>
      </div>
    </section>
  </main>
</template>

<style scoped>
.blog-title{
  font-size: 6rem;
  font-weight: 500;
  padding: 0 4rem;
}
.blog-sect{
  width: 100%;
  padding: 0 2rem;
  display: flex
}
.posts-sect{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.blog-list{
  width: clamp(40rem, 75vw, 100rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}
.side{
  width: clamp(20rem, 25vw, 40rem);
  height: 40rem;
  /* background-color: #636e72; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.pages{
    display: flex;
    justify-content: center;
    font-size: 2.5rem;
    gap: 1rem;
    color: #636e72;
}
.hover:hover{
  cursor: pointer;
  filter: brightness(0.7);
}
.page:hover{
    font-weight: 600;
    cursor: pointer;
}
.selected{
    font-weight: 700;
}
</style>