import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([
    {
      id: 1,
      title: "First blog post",
      author: "John Darksouls",
      date: "26/05/2023",
      contents: "I am a very long blog post",
      img: "https://images.unsplash.com/photo-1684868623430-aa353b5da28d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1228&q=80"
    },
    {
      id: 2,
      title: "Green is mean",
      author: "Rajj Patel",
      date: "26/05/2023",
      contents: "Even longer blog post",
      img: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
  ])
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return { posts}
})
