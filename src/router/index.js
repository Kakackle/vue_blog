import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import AboutView from '../views/AboutView.vue'
import PostView from '../views/PostView.vue'
import RegisterView from '../views/RegisterView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import UserView from "../views/UserView.vue"

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
    }
  ]
})

export default router
