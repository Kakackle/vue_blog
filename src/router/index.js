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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/post/:post_id',
      name: 'post',
      component: PostView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePostView
    },
    {
      path: '/user/:user_id',
      name: 'user',
      component: UserView
    },
    {
      path: '/tag/:tag_id',
      name: 'tag',
      component: TagView
    },
    {
      path: '/tag/:afterTag(.*)',
      name: 'tag404',
      component: TagNotFoundView
    },
    {
      path: "/:pathMatch(.*)*",
      name: "catchall",
      component: NotFoundView
    }
  ]
})

export default router
