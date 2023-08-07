<!-- 
    View tymczasowo wyswietlajacy site map z vue routera
    Domyslnie wyswietlajacy takze informacje o stronie/autorze etc
    TODO: zrobic cos z tym sensownego, najpierw pewnie w Figmie
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
    <p class="title">Something about the site idk, anyway here are all the available routes:</p>
    <div class="lists">
      <div class="left">
        <p class="title">VUE ROUTES:</p>
        <ul class="route-list">
          <li class="route" v-for="route in routesSorted" :key="route.path">
            <RouterLink :to="route.path">{{ route.name }}</RouterLink> - {{ route.path }} -
            {{ route.meta.desc }}
          </li>
        </ul>
      </div>

      <div class="right">
        <p class="title">DRF ROUTES: [base: http://127.0.0.1:8000]</p>
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
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: 2rem;
}
.title {
  font-size: 2.5rem;
  /* border-bottom: 1px solid black; */
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
  font-size: 2rem;
}

.route a {
  font-size: 2rem;
}
</style>
