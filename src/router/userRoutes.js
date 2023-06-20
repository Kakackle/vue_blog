import RegisterView from '../views/RegisterView.vue'
import UserView from "../views/UserView.vue"
import UserListView from "../views/UserListView.vue"

export default [
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: {
        desc: 'View for registering users (POST form)',
        title: 'Register'}
      },
      {
        path: '/users/list',
        name: 'userlist',
        component: UserListView,
        meta: {
        desc: 'User list view with links by slug',
        title: 'User List'}
      },
      {
        path: '/users/:user_slug',
        name: 'user',
        component: UserView,
        meta: {
        desc: 'Single user info view specified by user_slug [for now]',
        title: 'User'}
      },
]