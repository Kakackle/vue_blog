<!-- 
    Whole post view
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

import { useUserStore} from "../stores/user";
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);

const route = useRoute();
const router = useRouter();
const post_slug = route.params.post_slug;

routeStore.pushRoute(route);

const post = ref();
const postExists = ref(0);
const errorMsg = ref("");

const getPost = async function () {
  post.value = (await getDataFromLink(`posts/${post_slug}`)).value;
  if (!post) {
    postExists.value = 0;
    console.log("post not found");
    router.push({ name: "catchall", params: { wrong_param: post_slug } });
  }
  postExists.value = 1;
  getPostsByAuthor(post.value.author);
  getAuthor();
  // aktualizacja wyswietlen w database
  // axios.patch(
  //   `http://127.0.0.1:8000/api/posts/${post_slug}`,
  //   {
  //     views: post.value.views + 1,
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   }
  // );
  axios.patch(`posts/${post_slug}/view`);
};

getPost();

const author = ref();
// user do wyswietlania imienia zamiast sluga
const getAuthor = async function(){
  axios.get(`users/${post.value.author}`)
  .then((res)=>{
    author.value = res.data;
  })
  .catch((err)=>{
    console.log(err);
  })
}

import { marked } from "marked";
const compiledMarkdown = computed(() => {
  return DOMPurify.sanitize(marked.parse(post.value.content, {
    mangle: false,
    headerIds: false,
  }));
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

// + kwestia - getpostbyauthor moze byc tylko wywolywane w getpost
// bo music post istniec czy daloby sie inaczej?
// getPostsByAuthor(post.value.author);

import {useToast} from "vue-toastification";
const toast = useToast();

const success = ref('');
const error = ref('')

const updateLikedNew = async function(){
    success.value='';
    error.value='';
    // jesli stan zalogowanego uzytkownika nie jest aktualny
    if(!loggedUser.value.slug){
        loggedUser.value = userStore.getUser();
    }
    // jesli uzytkownik mimo to nie zadawany
    if(!loggedUser.value){
        toast.error(`log in first before trying to like`);
        return
    }
    if(loggedUser.value.slug === post.value.author){
        toast.error(`you can't like your own posts, silly`);
        return
    }
    axios.patch(`posts/${post.value.slug}/like`, {
        user: loggedUser.value.id
    })
    .then((res)=>{
        console.log(res.data.message);
        success.value = `updated likes, ${res.status}, ${res.statusText}`;
        toast.success(success.value);
        getPost();
        // comment.value.liked_by = res.data.liked_by;
    })
    .catch((err)=>{
        console.log(err);
        error.value = `${err.status}, ${err.statusText}`;
        toast.error(error.value);
    })
}  

// if post liked by logged user

const post_liked = computed(()=>{
    if(loggedUser.value && post.value)
        return post.value.liked_by.includes(loggedUser.value.slug);
    else return false;
})

</script>

<template>
  <div>
    <GoBackButton></GoBackButton>
    <main class="main">
      <section class="post-main section-separator" v-if="postExists">
        <div class="post section-separator">
          <div class="title-div">
            <p class="post-title">{{ post.title }}</p>
            <div v-if="loggedUser">
              <button
                class="go-button hover"
                @click="router.push({ name: 'create', params: { post_slug: post.slug } })"
                v-if="loggedUser.slug === post.author"
                >EDIT POST
              </button>
            </div>
          </div>
          <div class="second-row">
            <p
              class="post-author hover"
              v-if="author"
              @click="router.push({ name: 'user', params: { user_slug: post.author } })"
            >
              {{ author.name }}
            </p>
            <!-- <p class="centerdot">&centerdot;</p> -->
            <p class="post-date">{{ post.date_posted }}</p>
            <p class="edit-date">(last edited on {{ post.date_updated }})</p>
            <!-- <p class="centerdot">&centerdot;</p> -->

            <!-- <p class="centerdot">&centerdot;</p> -->
            <p class="likes">
                    <ion-icon class="like-icon hover" name="thumbs-up-sharp"
                    @click="updateLikedNew()"
                    :class="{'post-liked': post_liked}"></ion-icon>
                    <p>{{ post.likes }} likes </p>
            </p>
            <p class="post-date">{{ post.views }} views</p>
            <!-- <p class="post-date post-likes">{{ post.likes }} likes</p> -->
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
          <p class="author-signature" v-if="author">{{ author.name }}</p>
          
        </div>
      </section>
            <!-- end post-main -->
      <section class="section-bottom section-separator">
        <!-- comments -->
        <p class="subtitle">See what people had to say about this post [{{ post.comment_count }} comments]:</p>
          <CommentsPaginated :post="post" v-if="postExists"></CommentsPaginated>
          <!-- carousels -->
          <p class="subtitle">Check out these trending posts</p>
          <Carousel class="section-separator" v-if="trending_posts.length" :posts=trending_posts></Carousel>
          <p class="subtitle" v-if="author">More posts by {{ author.name }}</p>
          <Carousel class="section-separator" v-if="author_posts.length" :posts=author_posts></Carousel>
      </section>
      <Footer></Footer>

      <!-- <section class="post-main" v-else>Else</section> -->
    </main>
  </div>
</template>

<style scoped>
.main {

  display: flex;
  max-width: var(--max-page-width);
  margin: 0 auto;
  /* justify-content: center; */
  flex-direction: column;
  align-items: center;
  background-color: var(--almost-white);
}
.post-main {
  margin-top: 30px;
  /* padding: 0 4rem; */
  width: 100%;
  display: flex;
  border-bottom: 8px solid var(--accent-yellow);
}
/* unused */
/* .post-side {
  width: clamp(20rem, 25vw, 40rem);
  background-color: #636e72;
  height: 60rem;
} */
.post {
  /* width: clamp(40rem, 75vw, 120rem); */
  width: 100%;
  display: flex;
  flex-direction: column;
  /* gap: 5px; */
  position: relative;
  padding: 10px;
}
.title-div{
  display: flex;
  gap: 10px;
  align-items: center;
  line-height: 1;
}
.post-title {
  font-size: 4rem;
  color: var(--almost-black);
}
.go-button {
  color: var(--mid-gray);
  height: 2rem;
  width: 10rem;
  font-size: 1.5rem;
  padding: 0.2rem;
}
.go-button:hover{
  text-decoration: underline;
}
.second-row {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 0px 5px;
}
/* .centerdot {
  font-size: 2rem;
} */
.post-author {
  font-size: 1.5rem;
  color: var(--mid-gray);
  font-weight: 500;
}
.post-date {
  font-size: 1.5rem;
  color: var(--mid-gray);
}
.edit-date{
  font-size: 1.2rem;
  color: var(--mid-light);
  transform: translateX(-15px);
}
.post-likes{
  color: var(--mid-gray);
}
.post-tags {
  display: flex;
  gap: 1rem;
  font-size: 1.5rem;
  margin-bottom: 10px;
}
.post-content {
  font-size: 1.5rem;
}
.post-img {
  /* width: 120%; */
  height: 500px;
  object-fit: cover;
  margin-bottom: 10px;
}

.post-content {
  /* font-size: unset !important; */
  font-size: 2rem;
  color: var(--dark-gray);
  /* line-height: 1; */
  display: flex;
  flex-direction: column;
  /* width: 100%; */
  /* min-width: 1200px; */
  min-width: 100%;
  /* justify-content: center; */
  /* padding: 10px; */
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

.author-signature{
  font-size: 2rem;
  color: var(--dark-gray);
  font-weight: 600;
}

.title{
  font-size: 3rem;
}

.subtitle{
  font-size: 2rem;
  font-weight: 500;
  color: var(--almost-black);
  margin-bottom: 10px;
}

.section-bottom{
  display: flex;
  flex-direction: column;
  /* width: 100%; */
  max-width: var(--max-page-width);
  margin: 0 auto;
  /* flex-shrink: 1; */
  align-items: flex-start;
}


.likes{
    /* color:var(--dark-gray); */
    display: flex;
    align-items: center;
    font-size: 2.5rem;
    gap: 10px;
    color: var(--mid-gray);
}
.like-icon{
    font-size: 2rem;
    /* color: var(--dark-gray); */
    /* right: 3rem; */
    visibility: visible;
}

.post-liked{
    color: var(--accent-yellow);
    visibility: visible;
}

</style>
