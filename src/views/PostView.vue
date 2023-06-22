<!-- 
    Whole post view
    TODO: Upieknienie
    TODO: moze jesli jestes zalogowny to umozliw klikniecie "edytuj" in place, idk
-->
<script setup>
import { onMounted } from "vue";
import {useRouter, useRoute, routerKey} from "vue-router"
import {ref, computed} from "vue"
import { getDataFromLink, getDataWithSuccess } from "../composables/axiosComposables";
import GoBackButton from "../components/GoBackButton.vue"
import Comment from "../components/Comment.vue";
import axios from "axios";

import {useRouteStore} from '../stores/routeHistory'
import { storeToRefs } from 'pinia';
const routeStore = useRouteStore();
const {routeHistory} = storeToRefs(routeStore); 

const route = useRoute()
const router = useRouter()
const post_slug = route.params.post_slug;

routeStore.pushRoute(route);

const post = ref()
const postExists = ref(0);
const errorMsg = ref("");


const getPost = async function(){
  post.value = (await getDataFromLink(`http://127.0.0.1:8000/api/posts/${post_slug}`)).value;
  if(!post){
    postExists.value = 0;
    console.log("post not found");
    router.push({name: 'catchall', params: {wrong_param: post_slug}});
  }
  postExists.value = 1;
  axios.patch(`http://127.0.0.1:8000/api/posts/${post_slug}`, {
    views: post.value.views+1
  });
}

getPost();

import {marked} from 'marked';
const compiledMarkdown = computed(()=>{
  return marked.parse(post.value.content, {
        "mangle": false,
        "headerIds": false,
    })
})

// test komentow
const comments = ref(
  [
    {
    author: 'admin',
    date: '22/06/2023',
    likes: 1,
    content: 'Parent 1 Lorem ipsum dolor sit amet consectetur adipiscing elit ligula pharetra eros semper penatibus, libero turpis suspendisse nec purus tempor aenean potenti ullamcorper neque montes.',
    replies:[
      {
        author: 'rajj',
        date: '22/06/2023',
        likes: 0,
        content: 'Child 1 Lorem ipsum dolor sit amet consectetur adipiscing elit ligula pharetra eros semper penatibus, libero turpis suspendisse nec purus tempor aenean potenti ullamcorper neque montes.',
        replies: [],
      },
      {
        author: 'admin',
        date: '22/06/2023',
        likes: 2,
        content: 'Child 2 Lorem ipsum dolor sit amet consectetur adipiscing elit ligula pharetra eros semper penatibus, libero turpis suspendisse nec purus tempor aenean potenti ullamcorper neque montes.',
        replies: [
          {
            author: 'test',
            date: '22/06/2023',
            likes: 3,
            content: 'Child 2 of Child 2 Lorem ipsum dolor sit amet consectetur adipiscing elit ligula pharetra eros semper penatibus, libero turpis suspendisse nec purus tempor aenean potenti ullamcorper neque montes.',
            replies: []
          }
        ]
      }
    ]},
    {
      author: 'test',
      date: '22/06/2023',
      likes: 0,
      content: 'Parent 2 Lorem ipsum dolor sit amet consectetur adipiscing elit ligula pharetra eros semper penatibus, libero turpis suspendisse nec purus tempor aenean potenti ullamcorper neque montes.',
      replies: [
      {
            author: 'test',
            date: '22/06/2023',
            likes: 3,
            content: 'Parent 2 child Lorem ipsum dolor sit amet consectetur adipiscing elit ligula pharetra eros semper penatibus, libero turpis suspendisse nec purus tempor aenean potenti ullamcorper neque montes.',
            replies: []
          }
      ]
    }
  ]
)

</script>

<template>
  <div>
    <GoBackButton></GoBackButton>
    <main class="main">
      
      <section class="post-main" v-if="postExists">
        <div class="post">
          <p class="post-title">{{ post.title }}</p>
          <div class="second-row">
            <p class="post-author hover"
            @click="router.push({name: 'user', params:{user_slug: post.author}})">{{ post.author}}</p>
            <p class="centerdot">&centerdot;</p>
            <p class="post-date">{{ post.date_posted }}</p>
            <p class="centerdot">&centerdot;</p>
            <p class="post-date">views: {{ post.views }}</p>
            <p class="centerdot">&centerdot;</p>
            <button class="go-button hover"
              @click="router.push({name: 'create', params:{post_slug: post.slug}})">EDIT POST</button>
          </div>
          
          <div class="post-tags">
            <p class="tag hover" v-for="(tag, tag_id) in post.tags"
            @click="router.push({name: 'tag', params: {tag_slug: tag}})"
            >{{ tag }}</p>
          </div>
          
          <img :src="post.img" class="post-img">
          <!-- <div class="post-content">{{ post.content }}</div> -->
          <div class="post-content" v-html="compiledMarkdown"></div>
          
          <!-- comments -->
          <p class="title">COMMENTS ON POST:</p>
          <section class="comments">
            <div class="comment" v-for="(comm, comm_id) in comments">
              <p>{{ comm.date }}</p>
              <Comment :comment="comm"></Comment>
            </div>
            <!-- <Comment v-for="(comm, comm_id) in comments" :comment="comm"></Comment> -->
          </section>
        </div>
    </section> 
    <!-- end post-main -->
    <section class="post-main" v-else>
      Else
    </section>
    <section class="side">
      <div class="side-ting">Side</div>
    </section>   
    </main>
  </div>
</template>

<style scoped>
.main{
  display: flex;
}
.post-main{
  padding: 0 4rem;
  width: 100%;
  display: flex;
}
.post-side{
  width: clamp(20rem, 25vw, 40rem);
  background-color: #636e72;
  height: 60rem;
}
.post{
  width: clamp(40rem, 75vw, 120rem);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: relative;
}
.post-title{
  font-size: 5.2rem;
}
.second-row{
  display: flex;
  gap: 2rem;
  align-items: center;
}
.centerdot{
  font-size: 2rem;
}
.post-author{
  font-size: 2rem;
}
.post-date{
  font-size: 1.5rem;
  color: rgba(0,0,0,0.6);
}
.post-tags{
  display: flex;
  gap: 1rem;
  font-size: 1.5rem;
}
.post-content{
  font-size: 1.5rem;
}
.post-img{
  height: 40rem;
  width: 60rem;
}
.post-side{
  width: clamp(20rem, 25vw, 40rem);
}
.comments{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.comment{
  display: flex;
  flex-direction: column;
}
.hover:hover{
  cursor: pointer;
  filter: brightness(0.5);
  /* border-bottom: 1px solid black */
}
.go-button{
  height: 2.2rem;
  width: 10rem;
  font-size: 1.5rem;
  padding: 0.2rem;
}

.post-content{
  font-size: unset !important;
  /* font-size: 2rem; */
}
</style>