// FIXME: Lazy loading? Moze jesli initial load strony stanie sie dlugi
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BlogView from "../views/BlogView.vue";
import AboutView from "../views/AboutView.vue";
import AboutViewTailwind from "../views/AboutViewTailwind.vue";
import NotFoundView from "../views/NotFoundView.vue";
import MarkdownView from "../views/MarkdownView.vue";
import DatePickerView from "../views/DatePickerView.vue";
import TestView from "../views/TestView.vue";

import userRoutes from "./userRoutes";
import postRoutes from "./postRoutes";
import tagRoutes from "./tagRoutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
    {
      path: "/abouttail",
      name: "abouttail",
      component: AboutViewTailwind,
      meta: {
        desc: "About author/project page + site map?",
        title: "About Tail",
      },
    },
    {
      path: "/blog",
      name: "blog",
      component: BlogView,
      meta: {
        desc: "Blog view with posts displayed in multiple forms and side filtering",
        title: "Blog",
      },
    },
    ...userRoutes,
    ...postRoutes,
    ...tagRoutes,
    {
      path: "/test",
      name: "test",
      component: TestView,
      meta: {
        desc: "Test view",
        title: "Test",
      },
    },
    {
      path: "/markdown",
      name: "markdown",
      component: MarkdownView,
      meta: {
        desc: "Markdown",
        title: "Markdown",
      },
    },
    {
      path: "/datepicker",
      name: "datepicker",
      component: DatePickerView,
      meta: {
        desc: "date",
        title: "date",
      },
    },
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
