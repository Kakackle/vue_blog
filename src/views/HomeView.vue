<!--
  View z glownym przegladem postow, tzn w postaci komponentow PreviewListLarge
  wraz z bocznym elementem FilterSide do tworzenia query
  do pobierania i wyswietlania stron w komponencie PostsPaginated
-->

<script setup>
import Hero from '../components/Hero.vue';
import Banner from '../components/Banner.vue';
import Carousel from '../components/Carousel.vue';
import FilterSide from '../components/FilterSide.vue';
import PreviewListLarge from '../components/PreviewListLarge.vue';
import PostsPaginated from '../components/PostsPaginated.vue';
import GoBackButton from '../components/GoBackButton.vue';
import SubscribeForm from '../components/SubscribeForm.vue';
import Footer from '../components/Footer.vue';
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

// dropdowns
const sideDropOpen = ref(0); //is open?

const openSideDrop = function(){
  //flip the value on each click
  sideDropOpen.value? sideDropOpen.value = 0 : sideDropOpen.value=1;
  //if closed, will add border class and open drop
  //if open, will remove border class and close drop
};


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
}

const trending_posts = ref([]);
const getTrendingPosts = async function(){
  axios.get(`posts/trending/`)
  .then((res)=>{
    trending_posts.value = res.data;
  })
  .catch((err)=>{
    console.log(err);
  })
}
getTrendingPosts();

</script>

<template>
  <main>
    <Banner></Banner>
    <Hero></Hero>
    <section class="blog-sect">
      <div class="posts-sect">
        <PostsPaginated :type="'large'" :query_string="query_string" 
          :page_sizes="PAGE_SIZES"
          v-if="changed === 0"></PostsPaginated>
        </div>
        
      <div class="side">
        <FilterSide @filterQuery="filterByQuery" class="filter-side"></FilterSide>
      </div>
      <!-- dropdown for mobile devices -->
      <div class="side-drop"
        :class="{'drop-open': sideDropOpen}">
        <ion-icon class="hover side-burger" @click="openSideDrop" name="menu-sharp"></ion-icon>
        <div v-if="sideDropOpen" class="drop-filter-side">
          <FilterSide @filterQuery="filterByQuery"></FilterSide></div>
      </div>
    </section>
    <section class="carousel-sect" v-if="trending_posts">
      <p class="title">CHECK OUT THESE TRENDING POSTS</p>
      <Carousel :posts=trending_posts v-if="trending_posts.length"></Carousel>
    </section>
    <section class="subscribe-sect">
      <SubscribeForm></SubscribeForm>
    </section>
    <Footer></Footer>
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
  width: 100%;
  max-width: var(--max-page-width);
  display: flex;
  margin: var(--section-margin) auto;
  gap: 10px;
}
.posts-sect{
  width: 100%;
  max-width: 900px;
}

.side{
  width: clamp(150px, 100%, 290px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.5rem;
}

.side-drop{
  display: none;
  position: relative;
  height: 4rem;
}
.side-burger{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: var(--dark-gray);
}

.drop-filter-side{
  position: absolute;
  top: 40px;
  right: 0px;
  width: 200px;
  z-index: 2;
}

.drop-open{
  border-radius: 5px;
  border: 2px solid var(--dark-gray);
}


@media (max-width: 768px){
  .side-drop{
    display: flex;
  }
  .side{
    display: none;
  }
  .side{

  }
}
.pages{
    display: flex;
    justify-content: center;
    font-size: 2.5rem;
    gap: 1rem;
    color: #636e72;
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
  margin-bottom: var(--section-margin);
}
.title{
  font-size: 3rem;
}

.subscribe-sect{
  width: 100%;
  margin: auto;
  margin-bottom: var(--section-margin);
}
</style>