<!-- Whole post view -->
<script setup>
import {usePostsStore} from "../stores/posts.js"
import { onMounted } from "vue";
import {useRouter, useRoute} from "vue-router"
import {ref} from "vue"
import { storeToRefs } from "pinia";
import axios from 'axios';

const route = useRoute();
const post_id = route.params.post_id;

// const postsStore = usePostsStore();
// const {posts} = storeToRefs(postsStore)
// const post = posts.value[route.params.post_id-1]
const post = ref();
const isPost = ref(0);
const errorMsg = ref("");

const getPostById = function(){
    axios.get(`http://127.0.0.1:8000/api/posts/${post_id}`).
    then((response) => {
        isPost.value = 1;
        post.value = response.data;
        console.log("Success");
    })
    .then(()=>{
        post.value.tags.forEach(tag=>{
        getTagByHyperlink(tag);
    })
    }
    )
    .catch((error)=>{
        isPost.value = 0;
        errorMsg.value = error;
        console.log("Failure");
    })
}
const tags = ref([]);
const getTagByHyperlink = function(link){
    axios.get(link)
    .then((res)=>{
        tags.value.push(res.data.name);
    })
}

onMounted(()=>{

  getPostById();
    
})


</script>

<template>
  <main>
    <section v-if="isPost" class="post-main">
      <div class="post">
        <p class="post-title">{{ post.title }}</p>
        <p class="post-author">{{ post.author }}</p>
        <p class="post-date">{{ post.date }}</p>
        <div class="post-tags">
          <p class="tag" v-for="(tag, tag_id) in tags">{{ tag }}</p>
        </div>
        <div class="post-contents">{{ post.contents }}</div>
        <img :src="post.img" class="post-img">
      </div>
      <div class="post-side">
      </div>

      <section class="comments">
        <div class="comment">
        </div>
      </section>

    </section>
    <p v-else class="error">Error: {{ errorMsg }}</p>
  </main>
</template>

<style scoped>
.post-main{
  width: 100%;
  display: flex;
}
.post{
  width: clamp(40rem, 75vw, 120rem);
}
.post-title{
    font-size: 2.5rem;
}
.post-author{
    font-size: 1.5rem;
}
.post-date{
    font-size: 1.5rem;
}
.post-tags{
    font-size: 1.2rem;
}
.post-contents{
    font-size: 1.5rem;
}
.post-img{
  height: 30rem;
  width: 50rem;
}
.post-side{
  width: clamp(20rem, 25vw, 40rem);
}
.comments{

}

.error{
    font-size: 2rem;
}

</style>