
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
      // {
    //   path: `/tag/:tag_id(//d+)`,
    //   name: 'tag_id',
    //   component: TagView
    //   meta: {desc: 'Makes no sense, would need a component that accepts both slug and id'}
    // }
]