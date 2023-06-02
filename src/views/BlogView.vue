<script setup>
import PostView from './PostView.vue';
import FilterSide from '../components/FilterSide.vue';
import PreviewListLarge from '../components/PreviewListLarge.vue';
import GoBackButton from '../components/GoBackButton.vue';
import { RouterLink, RouterView } from 'vue-router'
import { ref, render } from 'vue';
import { getDataFromLink } from '../composables/axiosComposables';

const posts = ref([]);
const renderPosts = ref(posts);
const filterByBoxes = function(checkedTags){
  console.log(`checkedTags: ${checkedTags}`)
  renderPosts.value = posts.value.filterByTags(checkedTags);
}

const getPosts = async function(){
  posts.value = (await getDataFromLink(`http://127.0.0.1:8000/api/posts/`)).value;
}
getPosts();

</script>

<template>
  <main>
    <GoBackButton></GoBackButton>
    <!-- <PostView v-for="(post, post_id) in postsStore.posts" :post_id="post_id"></PostView> -->
    <!-- <RouterLink v-for="(post, post_id) in postsStore.posts" :to="`/post/${post_id}`">Post {{ post_id }}</RouterLink> -->
    <p class="blog-title">BLOG TITLE</p>
    <section class="blog-sect" v-if="posts">
      <div class="blog-list">
        <PreviewListLarge v-for="(post, post_id) in posts" :post="post"></PreviewListLarge>
      </div>
        
      <div class="side">
        <FilterSide @filterBox="filterByBoxes"></FilterSide>
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
</style>