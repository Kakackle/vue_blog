import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import AboutView from '../views/AboutView.vue'
import PostView from '../views/PostView.vue'
import RegisterView from '../views/RegisterView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import UserView from "../views/UserView.vue"
import TagView from "../views/TagView.vue"
import TagListView from "../views/TagListView.vue"
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
      path: '/posts/:post_slug',
      name: 'post',
      component: PostView,
      meta: {desc: 'Single post view specified by post_slug slug [for now]'}
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
      meta: {desc: 'Blog view with posts displayed in multiple forms and side filtering',
            title: 'blog'}
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
      path: '/users/:user_slug',
      name: 'user',
      component: UserView,
      meta: {desc: 'Single user info view specified by user_slug [for now]'}
    },
    // {
    //   path: `/tag/:tag_id(//d+)`,
    //   name: 'tag_id',
    //   component: TagView
    //   meta: {desc: 'Makes no sense, would need a component that accepts both slug and id'}
    // }
    {
      path: '/tags/:tag_slug',
      name: 'tag',
      component: TagView,
      meta: {desc: 'Tag/category view specified by slug'}
    },
    {
      path: '/tags',
      name: 'tags',
      component: TagListView,
      meta: {desc: 'Tag/category list view'}
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
      path: '/tags/:afterTag(.*)',
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

router.beforeEach((to, from, next) => {
  // Get the page title from the route meta data that we have defined
  // See further down below for how we setup this data
  const title = to.meta.title
// If the route has a title, set it as the page title of the document/page
  if (title) {
    document.title = title
  }
  // Continue resolving the route
  next()
})

export default router
