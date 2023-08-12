import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BlogView from "../views/BlogView.vue";
import AboutView from "../views/AboutView.vue";
import NotFoundView from "../views/NotFoundView.vue";


import userRoutes from "./userRoutes";
import postRoutes from "./postRoutes";
import tagRoutes from "./tagRoutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: BlogView,
      meta: {
        desc: "Home view with a banner etc",
        title: "Home",
      },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        desc: "About author/project page + site map?",
        title: "About",
      },
    },
    // {
    //   path: "/blog",
    //   name: "blog",
    //   component: BlogView,
    //   meta: {
    //     desc: "Blog view with posts displayed in multiple forms and side filtering",
    //     title: "Blog",
    //   },
    // },
    ...userRoutes,
    ...postRoutes,
    ...tagRoutes,
    {
      path: "/:pathMatch(.*)*",
      // path: "/.*/?:wrong_param",
      name: "catchall",
      component: NotFoundView,
      meta: {
        desc: "Catchall for errors, will try to display input params",
        title: "Error",
      },
    },
  ],
  scrollBehavior(to, from, savedPosition){
    return {
      top: 0,
      behavior: 'smooth'
    };
  },
});

router.beforeEach((to, from, next) => {
  // Get the page title from the route meta data that we have defined
  // See further down below for how we setup this data
  const title = to.meta.title;
  // If the route has a title, set it as the page title of the document/page
  if (title) {
    document.title = title + " | Vue Blog";
  }
  // Continue resolving the route
  next();
});

export default router;
