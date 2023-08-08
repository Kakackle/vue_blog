<!-- 
    View tymczasowo wyswietlajacy site map z vue routera
    Domyslnie wyswietlajacy takze informacje o stronie/autorze etc
 -->
<script setup>
import GoBackButton from "../components/GoBackButton.vue";
import { useRouter, useRoute } from "vue-router";
import { useRouteStore } from "../stores/routeHistory";
import { storeToRefs } from "pinia";

const routeStore = useRouteStore();
const { routeHistory } = storeToRefs(routeStore);

const route = useRoute();
const router = useRouter();
const routes = router.getRoutes();

// routeHistory.value.push(route.path);

routeStore.pushRoute(route);
/**
 * sort routes from vue router alphabetically, return in array form
 */
const routesSorted = routes.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});
</script>

<template>
  <main class="main">
    <GoBackButton></GoBackButton>
    <p class="title">[WORK IN PROGRESS]</p>

    <section class="about-author">
      <p class="subtitle">About the author of this blog</p>
      <div class="author-div">
        <img class="author-img">
        <div class="author-details">
          <p class="author-name">Kakackle</p>
          <div class="bio">Yeah this is my blog I am a dev this is a very simple temporary bio I hope you don't notice</div>
          <div class="mail">markowskimaciej98@gmail.com</div>
          <div class="socials">
            <div class="soc-icon"></div>
            <div class="soc-icon"></div>
            <div class="soc-icon"></div>
            <div class="soc-icon"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-blog">
      <p class="subtitle">About the blog</p>
      <p class="subsubtitle">Notable features</p>
      <ul class="blog-list">
        <li>Markdown</li>
        <li>Posting</li>
        <li>Accounts</li>
        <li>Liking</li>
        <li>Commenting</li>
      </ul>
    </section>

    <section class="lists-sect">
      <p class="subtitle">Lists of available endpoints/routes on front and backend</p>
      <div class="lists">
        <div class="left">
          <p class="subtitle">VUE ROUTES:</p>
          <ul class="route-list">
            <li class="route" v-for="route in routesSorted" :key="route.path">
              <RouterLink :to="route.path">{{ route.name }}</RouterLink> - {{ route.path }} -
              {{ route.meta.desc }}
            </li>
          </ul>
        </div>

        <div class="right">
          <p class="subtitle">DRF ROUTES: [base: http://127.0.0.1:8000]</p>
          <ul class="route-list">
            <li class="route">/admin - admin</li>
            <li class="route">
              /api/posts - all posts retrieve paginated [params: ?page_size= , ?page= , ?page=last]
            </li>
            <li class="route">/api/posts/all/ - all posts no pagination [last slash important]</li>
            <li class="route">/api/posts/int:pk - single post get/put/delete</li>
            <li class="route">/api/tags - all tags retrieve</li>
            <li class="route">/api/tag/int:pk - tag by id</li>
            <li class="route">/api/tag/slug:slug - tag by slug</li>
            <li class="route">/api/users</li>
            <li class="route">/api/users/int:pk - user by id</li>
            <li class="route">/api/users/int:pk/post - create post belonging to user</li>
            <li class="route">/api/comments</li>
            <li class="route">/api/comments/int:pk</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: 20px;
  color: var(--dark-gray);
}
.title {
  font-size: 3rem;
  /* border-bottom: 1px solid black; */
}

.subtitle{
  font-size: 2rem;
  /* text-decoration: underline; */
  font-weight: 500;
}

.subsubtitle{
  font-size: 1.5rem;
}

.lists {
  display: flex;
}
.right {
  border-left: 1px dashed black;
  padding-left: 1rem;
}
.route-list {
  /* font-size: 2rem; */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.route {
  font-size: 1.5rem;
}

.route a {
  font-size: 1.5rem;
}

.about-author, .about-blog, .lists-sect{
  display: flex;
  flex-direction: column;
  width: var(--max-page-width);
  align-items: center;
  gap: 10px;
  width: 100vw;
  padding: 10px;
  margin: 0 auto;
}

.author-div{
  display: flex;
  gap: 50px;
  /* width: 100%; */
  /* margin: 0 auto; */
}

.author-img{
  height: 200px;
  width: 200px;
  border-radius: 50%;
  background-color: var(--dark-gray);
}

.author-details{
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.author-name{
  font-size: 48px;
}

.bio, .mail{
  font-size: 1.5rem;
}
.socials{
  display: flex;
  gap: 5px;
}
.soc-icon{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--mid-gray);
}

.blog-list{
  font-size: 1.5rem;
}

</style>
