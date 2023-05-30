<!-- Whole post view -->
<script setup>
import {usePostsStore} from "../stores/posts.js"
import { onMounted } from "vue";
import {useRouter, useRoute} from "vue-router"
import {ref} from "vue"
import { storeToRefs } from "pinia";

const route = useRoute()

const postsStore = usePostsStore();

const {posts} = storeToRefs(postsStore)
const post = posts.value[route.params.post_id-1]

onMounted(()=>{
  // const str = JSON.stringify(post)
  // console.log(`post: ${str}`)
  post.views +=1;
  console.log(post.views);
})


</script>

<template>
  <main>
    <section class="post-main">
      <div class="post">
        <p class="post-title">{{ post.title }}</p>
        <p class="post-author">{{ post.author }}</p>
        <p class="post-date">{{ post.date }}</p>
        <div class="post-tags">
          <p class="tag" v-for="(tag, tag_id) in post.tags">{{ tag }}</p>
        </div>
        <div class="post-contents">{{ post.contents }}</div>
        <img :src="post.img" class="post-img">
      </div>
      <div class="post-side">
      </div>
    </section>
    <section class="comments">
      <div class="comment">

      </div>
    </section>

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
}
.post-author{
}
.post-date{
}
.post-tags{
}
.post-contents{
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

</style>