import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import AboutView from '../views/AboutView.vue'
import PostView from '../views/PostView.vue'
import RegisterView from '../views/RegisterView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import UserView from "../views/UserView.vue"
import TagView from "../views/TagView.vue"
import NotFoundView from "../views/NotFoundView.vue"
import TagNotFoundView from "../views/TagNotFoundView.vue"
import APITestView from "../views/APITestView.vue"
import PostViewRest from "../views/PostViewRest.vue"
import FilterView from "../views/FilterView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {desc: 'Home view with a banner etc'}
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {desc: 'About author/project page + site map?'}
    },
    {
      path: '/post/:post_id',
      name: 'post',
      component: PostView,
      meta: {desc: 'Single post view specified by post_id id [for now]'}
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
      meta: {desc: 'Blog view with posts displayed in multiple forms and side filtering'}
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {desc: 'View for registering users (POST form)'}
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePostView,
      meta: {desc: 'View for creating a post instance (POST form)'}
    },
    {
      path: '/user/:user_id',
      name: 'user',
      component: UserView,
      meta: {desc: 'Single user info view specified by user_id [for now]'}
    },
    {
      path: '/tag/:tag_slug',
      name: 'tag',
      component: TagView,
      meta: {desc: 'Tag/category view specified by Id'}
    },
    {
      path: '/apitest',
      name: 'apitest',
      component: APITestView,
      meta: {desc: 'View for testing the API requests [currently testing viewing posts]'}
    },
    {
      path: '/apipost/:post_id',
      name: 'apipost',
      component: PostViewRest,
      meta: {desc: 'Some testing idk - to be trashed?'}
    },
    {
      path: "/posts_search",
      name: "posts_search",
      component: FilterView,
      meta: {desc: 'Test filtering/querying from db and in website'}
    },
    {
      path: '/tag/:afterTag(.*)',
      name: 'tag404',
      component: TagNotFoundView,
      meta: {desc: 'Page if specified tag was not found - trash?'}
    },
    {
      path: "/:pathMatch(.*)*",
      name: "catchall",
      component: NotFoundView,
      meta: {desc: 'Catchall for errors, will try to display input params'}
    }
  ]
})

export default router
