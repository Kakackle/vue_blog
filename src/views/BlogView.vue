<!--
  View z glownym przegladem postow, tzn w postaci komponentow PreviewListLarge
  wraz z bocznym elementem FilterSide do tworzenia query
  do pobierania i wyswietlania stron w komponencie PostsPaginated
  TODO: Dodaj cos moze jeszcze pod filtrami
-->

<script setup>
import Hero from '../components/Hero.vue';
import Banner from '../components/Banner.vue';
import Carousel from '../components/Carousel.vue';
import FilterSide from '../components/FilterSide.vue';
import PreviewListLarge from '../components/PreviewListLarge.vue';
import PostsPaginated from '../components/PostsPaginated.vue';
import GoBackButton from '../components/GoBackButton.vue';
import { RouterLink, RouterView } from 'vue-router'
import { nextTick, ref, render } from 'vue';
import axios from 'axios';

import { useRoute } from 'vue-router';
import {useRouteStore} from '../stores/routeHistory'
import { storeToRefs } from 'pinia';

const routeStore = useRouteStore();
const {routeHistory} = storeToRefs(routeStore); 
const route = useRoute();
routeStore.pushRoute(route);

//posts przechowywane jako backup wszystkich postow
const posts = ref([]);
//renderPosts jako posty uzyskiwane poprzez API z filtracja z query
const renderPosts = ref(posts);
const pages = ref([]);

const PAGE_SIZES = [5,10,15];

//from filterSide
const query_string = ref('posts/?');

const changed = ref(0);

/**
 * Dokonuje filtracji poprzez wykonanie query do API
 * z wybranymi tagami, query term
 * przeksztalcanymi w query_string dodawany do adresu endpointu
 * @param {*} tags 
 * @param {*} search 
 */

/**
* Na podstawie otrzymanego z emitu query
  Wywoluje aktualizacje PostsPaginated poprzez zmiane wartosi changed,
  co powoduje rerender komponentu z nową wartością query_string do filtracji postów
  @param {String} query
*/
const filterByQuery = async function(query){
  changed.value = 1;
  query_string.value = query;
  // renderPosts.value=[];
  await nextTick();
  changed.value = 0;
  // getPostsByFilters(checked.value, selectedPage.value, queryTerm.value, page_size.value);
}

//initial state, for backup
// const getPosts = async function(){
//   axios.get('posts/')
//   .then((res)=>
//   {
//     posts.value = res.data.results;
//     renderPosts.value = res.data.results;
//     pages.value = res.data.context.page_links;
//   })
//   .catch((err)=>{
//     console.log(err);
//   })
// }

// getPosts();

</script>

<template>
  <main>
    <!-- <GoBackButton></GoBackButton> -->
    <Banner></Banner>
    <Hero></Hero>
    <!-- <p class="blog-title">BLOG TITLE</p> -->
    <section class="blog-sect">
      <div class="posts-sect">
        <PostsPaginated :type="'large'" :query_string="query_string" 
          :page_sizes="PAGE_SIZES"
          v-if="changed === 0"></PostsPaginated>
        </div>
    
      <div class="side">
        <FilterSide @filterQuery="filterByQuery"></FilterSide>
      </div>
    </section>
    <section class="carousel-sect">
      <p class="title">CHECK OUT THESE TRENDING POSTS</p>
      <Carousel></Carousel>
    </section>
  </main>
</template>

<style scoped>
*{
  font-size: 62.5%;
  background-color: var(--almost-white);
}
.blog-title{
  font-size: 6rem;
  font-weight: 500;
  padding: 0 4rem;
}
.blog-sect{
  /* width: 100%; */
  max-width: var(--max-page-width);
  /* padding: 0 2rem; */
  display: flex;
  margin: var(--section-margin) auto;
  flex-wrap: wrap;
}
.posts-sect{
  max-width: 900px;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; */
}

/* ------ unused ------ */
/* .blog-list{
  width: clamp(40rem, 75vw, 100rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
} */
.side{
  width: clamp(250px, 100%, 300px);
  /* height: 40rem; */
  height: 100%;
  /* background-color: #636e72; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 1rem; */
  margin-top: 2.5rem;
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

.carousel-sect{
  max-width: var(--max-page-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.title{
  font-size: 3rem;
}
</style>