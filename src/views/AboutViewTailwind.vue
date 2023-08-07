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

const REST_ROUTES = [
  "/admin - admin",
  "/api/posts - all posts retrieve paginated [params: ?page_size= , ?page= , ?page=last]",
  "/api/posts/all/ - all posts no pagination [last slash important]",
  "/api/posts/int:pk - single post get/put/delete",
  "/api/tags - all tags retrieve",
  "/api/tag/int:pk - tag by id",
  "/api/tag/slug:slug - tag by slug",
  "/api/users",
  "/api/users/int:pk - user by id",
  "/api/users/int:pk/post - create post belonging to user",
  "/api/comments",
  "/api/comments/int:pk",
];

const test_cards = [
  {
    title: "Title 1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Title 2",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Title 3",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];
</script>

<template>
  <main class="flex flex-col gap-6">
    <GoBackButton></GoBackButton>
    <p class="text-4xl">Something about the site idk, anyway here are all the available routes:</p>
    <!-- lists -->
    <div class="flex">
      <div class="flex flex-col">
        <p class="text-3xl">VUE ROUTES:</p>
        <ul class="flex flex-col gap-4">
          <li class="text-xl" v-for="route in routesSorted" :key="route.path">
            <RouterLink :to="route.path">{{ route.name }}</RouterLink> - {{ route.path }} -
            {{ route.meta.desc }}
          </li>
        </ul>
      </div>

      <div class="flex flex-col">
        <p class="text-3xl">DRF ROUTES: [base: http://127.0.0.1:8000]</p>
        <ul class="flex flex-col gap-4">
          <li class="text-xl" v-for="route in REST_ROUTES">{{ route }}</li>
        </ul>
      </div>
    </div>
    <!-- about user etc -->
    <section class="align-center flex w-full justify-center shadow-md">
      <div class="align-center relative flex w-4/5 justify-center gap-8 p-4 shadow-lg">
        <div class="flex h-48 w-40 flex-col gap-2 p-4 shadow-md" v-for="card in test_cards">
          <div class="h-8 w-8 rounded-full bg-slate-400"></div>
          <p class="text-xs">{{ card.content }}</p>
        </div>
        <span
          class="absolute right-0 top-1/2 translate-x-1/2 cursor-pointer rounded-full bg-white p-4 text-2xl font-bold shadow-lg hover:brightness-75"
          >&rarr;</span
        >
      </div>
    </section>
  </main>
</template>

<style scoped></style>
