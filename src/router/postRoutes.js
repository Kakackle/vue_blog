
import PostView from '../views/PostView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import PostListView from "../views/PostListView.vue"

export default [
    {
        path: '/posts/:post_slug',
        name: 'post',
        component: PostView,
        meta: {
        desc: 'Single post view specified by post_slug slug [for now]',
        title: 'Post'}
      },
      {
        path: '/create/:post_slug?',
        name: 'create',
        component: CreatePostView,
        meta: {
        desc: 'View for creating a post instance (POST form)',
        title: 'Create post'}
      },
      {
        path: '/posts/list',
        name: 'postlist',
        component: PostListView,
        meta: {
        desc: 'Post list view with links by slug',
        title: 'Post List'}
      },
]