
import TagView from "../views/TagView.vue"
import TagListView from "../views/TagListView.vue"
export default [
    {
        path: '/tags/:tag_slug',
        name: 'tag',
        component: TagView,
        meta: {
        desc: 'Tag/category view specified by slug',
        title: 'Tag'}
      },
      {
        path: '/tags',
        name: 'tags',
        component: TagListView,
        meta: {
        desc: 'Tag/category list view',
        title: 'Tag List'}
      },
]