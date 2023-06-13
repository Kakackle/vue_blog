<script setup>
import Hero from '../components/Hero.vue';
import Banner from '../components/Banner.vue'
import PreviewList from '../components/PreviewList.vue';
import PostsPaginated from '../components/PostsPaginated.vue';
import PreviewCard from '../components/PreviewCard.vue';
import Carousel from '../components/Carousel.vue';

import { ref} from 'vue';
import axios from 'axios';

import { getDataFromLink } from '../composables/axiosComposables';
//TODO: chyba jednak beda przywracane pobieranie pages i posts do paginated

// const posts = ref()
// const pages = ref()

// const getPosts = async function(){
//   // posts.value = (await getDataFromLink(`http://127.0.0.1:8000/api/posts/`)).value;
//   axios.get('posts/')
//   .then((res)=>{
//     posts.value = res.data.results;
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
    <Banner></Banner>
    <Hero></Hero>
    <Carousel></Carousel>
    <section class="main-section">
      <div class="preview-list">
        <!-- <PreviewList v-for="post in posts" :post="post"></PreviewList> -->
        <!-- <PostsPaginated :posts="posts" :pages="pages" :type="'large'"></PostsPaginated> -->
        <PostsPaginated :type="'large'"></PostsPaginated>
      </div>
      <div class="side">
      </div>
    </section>  
  </main>
</template>

<style scoped>
.main-section{
  display: flex;
}
.preview-list{
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
  background-color: #636e72;
}

.big{
  font-size: 2.4rem;
}
</style>
