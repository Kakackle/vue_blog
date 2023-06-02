<!-- Whole post view -->
<script setup>
import { onMounted } from "vue";
import {useRouter, useRoute, routerKey} from "vue-router"
import {ref} from "vue"
import { getDataFromLink, getDataWithSuccess } from "../composables/axiosComposables";
import GoBackButton from "../components/GoBackButton.vue"

const route = useRoute()
const router = useRouter()
const post_id = route.params.post_id;

const post = ref()
const postExists = ref(0);
const errorMsg = ref("");


const getPost = async function(){
  post.value = (await getDataFromLink(`http://127.0.0.1:8000/api/posts/${post_id}`)).value;
  // ({post.value, postExists.value, errorMsg.value} = getDataWithSuccess(`http://127.0.0.1:8000/api/posts/${post_id}`));   
  // let {post, postExists, errorMsg} = (await getDataWithSuccess(`http://127.0.0.1:8000/api/posts/${post_id}`)); 
  if(!post){
    postExists.value = 0;
    console.log("post not found");
    router.push({name: 'catchall', params: {post_id: post_id}});
  }
  postExists.value = 1;
}

getPost();

onMounted(()=>{
  // post.views +=1;
  // console.log(post.views);
})


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
            @click="router.push(`/user/${post.author.id}`)">{{ post.author.name }}</p>
            <p class="centerdot">&centerdot;</p>
            <p class="post-date">{{ post.date_posted }}</p>
          </div>
          
          <div class="post-tags">
            <p class="tag hover" v-for="(tag, tag_id) in post.tags">{{ tag.name }}</p>
          </div>
          
          <img :src="post.img" class="post-img">
          <div class="post-content">{{ post.content }}</div>
        </div>
      <div class="post-side">
      </div>
      <section class="comments">
        <div class="comment">
          
        </div>
      </section>
    </section>
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

}
.hover:hover{
  cursor: pointer;
  filter: brightness(0.5);
  /* border-bottom: 1px solid black */
}
</style>