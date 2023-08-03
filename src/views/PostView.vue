<!-- 
    Whole post view
    TODO: Upieknienie
    TODO: moze jesli jestes zalogowny to umozliw klikniecie "edytuj" in place, idk
-->
<script setup>
import { defineAsyncComponent, onMounted } from "vue";
import { useRouter, useRoute, routerKey } from "vue-router";
import { ref, computed } from "vue";
import { getDataFromLink, getDataWithSuccess } from "../composables/axiosComposables";
import GoBackButton from "../components/GoBackButton.vue";
// import Comment from "../components/Comment.vue";
import CommentsPaginated from "../components/CommentsPaginated.vue";
import Tag from "../components/Tag.vue";
import Footer from "../components/Footer.vue";
import Carousel from "../components/Carousel.vue";
import axios from "axios";

import { useRouteStore } from "../stores/routeHistory";
import { storeToRefs } from "pinia";
const routeStore = useRouteStore();
const { routeHistory } = storeToRefs(routeStore);

const route = useRoute();
const router = useRouter();
const post_slug = route.params.post_slug;

routeStore.pushRoute(route);

const post = ref();
const postExists = ref(0);
const errorMsg = ref("");

const getPost = async function () {
  post.value = (await getDataFromLink(`http://127.0.0.1:8000/api/posts/${post_slug}`)).value;
  if (!post) {
    postExists.value = 0;
    console.log("post not found");
    router.push({ name: "catchall", params: { wrong_param: post_slug } });
  }
  postExists.value = 1;
  getPostsByAuthor(post.value.author);
  // aktualizacja wyswietlen w database
  axios.patch(
    `http://127.0.0.1:8000/api/posts/${post_slug}`,
    {
      views: post.value.views + 1,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

getPost();

import { marked } from "marked";
const compiledMarkdown = computed(() => {
  return marked.parse(post.value.content, {
    mangle: false,
    headerIds: false,
  });
});

// const comments = ref();
// const pages = ref();
// const getCommentsByPost = async function(post){
//     axios.get(`comments/?post=${post}`)
//     .then((res)=>{
//         comments.value = res.data.results;
//         pages.value = res.data.context.page_links;
//         console.log(res);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// }

// getCommentsByPost(post_slug);

// FIXME: aktualnie robione
const author_posts = ref([]);
// posty uzytkownika do karuzeli
const getPostsByAuthor = async function(author){
  axios.get(`posts/?author=${author}`)
  .then((res)=>{
    author_posts.value = res.data.results;
    console.log(`get posts by author success`);
  })
  .catch((err)=>{
    console.log(`get posts by author failure: ${err}`);
  })
}

// TODO: + pobieranie trendujacych tu tez, moze jakos w composables by to zawrzec potem

const posts = ref([]);
const getPosts = async function(){
  axios.get(`posts/`)
  .then((res)=>{
    posts.value = res.data.results;
  })
  .catch((err)=>{
    console.log(err);
  })
}
getPosts();
// + kwestia - getpostbyauthor moze byc tylko wywolywane w getpost
// bo music post istniec czy daloby sie inaczej?
// getPostsByAuthor(post.value.author);

</script>

<template>
  <div>
    <GoBackButton></GoBackButton>
    <main class="main">
      <section class="post-main" v-if="postExists">
        <div class="post">
          <p class="post-title">{{ post.title }}</p>
          <div class="second-row">
            <p
              class="post-author hover"
              @click="router.push({ name: 'user', params: { user_slug: post.author } })"
            >
              {{ post.author }}
            </p>
            <p class="centerdot">&centerdot;</p>
            <p class="post-date">{{ post.date_posted }}</p>
            <p class="centerdot">&centerdot;</p>
            <p class="post-date">views: {{ post.views }}</p>
            <p class="centerdot">&centerdot;</p>
            <button
              class="go-button hover"
              @click="router.push({ name: 'create', params: { post_slug: post.slug } })"
            >
              EDIT POST
            </button>
          </div>

          <div class="post-tags">
            <Tag
              class="tag hover"
              v-for="(tag, tag_id) in post.tags"
              @click="router.push({ name: 'tag', params: { tag_slug: tag } })"
              :tag = tag
              >
          </Tag>
          </div>

          <img :src="post.img" class="post-img" />
          <!-- <div class="post-content">{{ post.content }}</div> -->
          <div class="post-content prose" v-html="compiledMarkdown"></div>
          <p class="author_signature">{{ post.author }}</p>
          <!-- comments -->
          <p class="title">COMMENTS ON POST:</p>
          <CommentsPaginated :post_slug="post_slug"></CommentsPaginated>
          <!-- carousels -->
          <p class="subtitle">CHECK OUT THESE TRENDING POSTS</p>
          <Carousel v-if="posts.length" :posts=posts></Carousel>
          <p class="subtitle">MORE POSTS BY {{ post.author }}</p>
          <Carousel v-if="author_posts.length" :posts=author_posts></Carousel>
        </div>
      </section>
      <!-- end post-main -->
      <section class="post-main" v-else>Else</section>
      <section class="side">
        <div class="side-ting">Side</div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  max-width: var(--max-page-width);
  margin: 0 auto;
  justify-content: center;
}
.post-main {
  padding: 0 4rem;
  width: 100%;
  display: flex;
}
.post-side {
  width: clamp(20rem, 25vw, 40rem);
  background-color: #636e72;
  height: 60rem;
}
.post {
  width: clamp(40rem, 75vw, 120rem);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: relative;
}
.post-title {
  font-size: 5.2rem;
}
.second-row {
  display: flex;
  gap: 2rem;
  align-items: center;
}
.centerdot {
  font-size: 2rem;
}
.post-author {
  font-size: 2rem;
}
.post-date {
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.6);
}
.post-tags {
  display: flex;
  gap: 1rem;
  font-size: 1.5rem;
}
.post-content {
  font-size: 1.5rem;
}
.post-img {
  height: 40rem;
  width: 60rem;
}
.post-side {
  width: clamp(20rem, 25vw, 40rem);
}
.comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.comment {
  display: flex;
  flex-direction: column;
}
.hover:hover {
  cursor: pointer;
  filter: brightness(0.5);
  /* border-bottom: 1px solid black */
}
.go-button {
  height: 2.2rem;
  width: 10rem;
  font-size: 1.5rem;
  padding: 0.2rem;
}

.post-content {
  font-size: unset !important;
  /* font-size: 2rem; */
}

.title{
  font-size: 3rem;
}

.subtitle{
  font-size: 2rem;
}
</style>
