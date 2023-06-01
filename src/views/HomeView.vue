<script setup>
import Hero from '../components/Hero.vue';
import Banner from '../components/Banner.vue'
import PreviewList from '../components/PreviewList.vue';
import PreviewCard from '../components/PreviewCard.vue';
import Carousel from '../components/Carousel.vue';
// import { usePostsStore } from '../stores/posts';
// const postsStore = usePostsStore();
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';

const posts = ref()

const getPosts = function(){
  axios.get(`http://127.0.0.1:8000/api/posts/`)
  .then((res)=>{
    posts.value = res.data;
    console.log(`home: ${JSON.stringify(posts.value)}`);
    // console.log(`len: ${posts.value.length}`)
  }
  )
}

onBeforeMount(()=>{
  getPosts();
})

</script>

<template>
  <main>
    <Banner></Banner>
    <Hero></Hero>
    <Carousel></Carousel>
    <section class="main-section">
      <container class="preview-list">
        <PreviewList v-for="post in posts" :post="post"></PreviewList>
        <p class="big" v-for="post in posts"> Post: {{post.title}}</p>
        <p class="big" v-for="n in 3">n</p>
      </container>
      <container class="side">
      </container>
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
