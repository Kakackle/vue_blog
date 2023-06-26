/**
 * TODO: [OUTDATED, UNUSED, TO BE DELETED] or modified to fit different needs
 */
import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([
    {
      id: 1,
      title: "First blog post",
      author: 0,
      date: "26/05/2023",
      views: 0,
      tags: ["programming", "progress", "howto"],
      contents: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident",
      img: "https://images.unsplash.com/photo-1684868623430-aa353b5da28d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1228&q=80"
    },
    {
      id: 2,
      title: "Green is mean",
      author: 1,
      date: "26/05/2023",
      views: 0,
      tags: ["games", "hobby","guide"],
      contents: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      img: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      title: "Yellow is Mellow",
      author: 1,
      date: "26/05/2023",
      views: 0,
      tags: ["games", "hobby"],
      contents: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      img: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
  ])
  const getTags = function(){
    let tags = [];
    this.posts.forEach(post =>{
      {
        post.tags.forEach(tag =>{
          if(!tags.includes(tag)) tags.push(tag)
        });
      }
    }
    );
    return tags;
  }
  const getPostsByAuthor = function(author_id){
    let a_posts = [];
    this.posts.forEach(post =>{
      if(post.author === parseInt(author_id)){
        a_posts.push(post);
      }
    })
    return a_posts;
  }
  const filterByTags = function(tags){
    let f_posts = [];
    if (tags.length === 0){
      f_posts = posts.value;
      return f_posts;
    }
    tags.forEach(tag=>{
      this.posts.forEach(post=>{
        if (post.tags.includes(tag)){
          if (!f_posts.includes(post)){
            f_posts.push(post);
          }
        }
      })
    })
    return f_posts;
  }

  const addPost = (newPost) =>{
      posts.value.push(newPost);
  }
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return { posts, getTags, addPost, getPostsByAuthor, filterByTags}
})
