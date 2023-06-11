<!--
TODO: filtracja po searchu, ale co chcialbym moc umozliwic tam wpisywac?

bo:
- po autorze latwo, nowe query do django, tam juz mam obsluge
- po nazwie postu? powinno byc mozliwe tak samo jak po autorze
- po tagach? i tu sa schody? moze nie, bo searchbar mam w koponencie sidefilter,
  ktory pobiera wszystkie tagi, wiec moze przez nie przejsc i sparowac wpisana przez uzytnika nazwe tagu z id

ale problem: okej, mam wartosc w tym searchbarze, ale w view w django musi ta wartosc byc
przypisana do jakiegos query, ale jesli nie wiem co uzytnik chcial wpisac to jak mam wybrac to query?
moze na start niech bedzie tylko po tytule
a potem jakos sie zamieni to query na lepszy system filtracji/searchu, bo na pewno są, aktualnie jest dosyc kaleki

-->
<script setup>
// import PostView from './PostView.vue';
import FilterSide from '../components/FilterSide.vue';
import PreviewListLarge from '../components/PreviewListLarge.vue';
import GoBackButton from '../components/GoBackButton.vue';
import { RouterLink, RouterView } from 'vue-router'
import { ref, render } from 'vue';
import axios from 'axios';
// import { getDataFromLink } from '../composables/axiosComposables';

const posts = ref([]);
const renderPosts = ref(posts);
const pages = ref([]);
//list of checkboxes from side filter comp
const checked = ref([]);
//query term for post title from side filter comp
const queryTerm = ref('');

const filterByBoxes = function(checkedTags){
  // console.log(`checkedTags: ${checkedTags}`)
  // renderPosts.value = posts.value.filterByTags(checkedTags);
  checked.value = checkedTags;
  renderPosts.value=[];
  posts.value=[];
  getPostsByFilters(checked.value, selectedPage.value, queryTerm.value);
}

const filterByTerm = function(query){
  queryTerm.value = query;
  renderPosts.value=[];
  posts.value=[];
  getPostsByFilters(checked.value, selectedPage.value, queryTerm.value);
}

const getPostsByFilters = async function(tags, page, search){
  // let query_string='posts/';
  // let isFirst = 1;
  // tags.forEach((tag)=>{
  //   if(isFirst){
  //     query_string += `?tag=${tag}`;
  //     isFirst = 0;
  //   }
  //   query_string += `&tag=${tag}`;
  // })
  // if (page){
  //   if(tags.length || search) query_string += `&page=${page}`;
  //   else query_string += `?page=${page}`;
  // }
  // if(search){
  //   query_string += `&title=${search}`
  // }
  let query_string='posts/?';
  // let isFirst = 1;
  tags.forEach((tag)=>{
    // if(isFirst){
      // query_string += `?tag=${tag}`;
      // isFirst = 0;
    // }
    query_string += `&tag=${tag}`;
  })
  if (page){
    // if(tags.length || search) query_string += `&page=${page}`;
    // else query_string += `?page=${page}`;
    query_string += `&page=${page}`;
  }
  if(search){
    query_string += `&title=${search}`
  }
  console.log(`resulting query: ${query_string}`);
  // console.log(`posts before: ${JSON.stringify(posts.value)}`)
  axios.get(query_string)
  .then((res)=>{
    posts.value = res.data.results;
    renderPosts.value = posts.value;
    pages.value = res.data.context.page_links;
    // console.log(`posts after: ${JSON.stringify(posts.value)}`)
  })
  .catch((err)=>
  {
    console.log(err);
  })
}

const selectedPage = ref(1);

const getPostsByPage = async function(page_id){
  renderPosts.value=[];
  posts.value=[];
  selectedPage.value = page_id;
  getPostsByFilters(checked.value, page_id, queryTerm.value);
}

const getPosts = async function(){
  // posts.value = (await getDataFromLink(`http://127.0.0.1:8000/api/posts/`)).value;
  axios.get('posts/')
  .then((res)=>
  {
    renderPosts.value=[];
    posts.value = res.data.results;
    renderPosts.value = posts.value;
    pages.value = res.data.context.page_links;
    // console.log(`pages: ${pages}`)
  })
  .catch((err)=>{
    console.log(err);
  })
}

getPosts();

</script>

<template>
  <main>
    <GoBackButton></GoBackButton>
    <!-- <PostView v-for="(post, post_id) in postsStore.posts" :post_id="post_id"></PostView> -->
    <!-- <RouterLink v-for="(post, post_id) in postsStore.posts" :to="`/post/${post_id}`">Post {{ post_id }}</RouterLink> -->
    <p class="blog-title">BLOG TITLE</p>
    <section class="blog-sect">
      <div class="posts-sect" v-if="renderPosts.length">
        <div class="blog-list">
          <PreviewListLarge v-for="(post, post_id) in renderPosts" :post="post"></PreviewListLarge>
        </div>
        <div class="pages" v-if="pages">
              <p class="page" v-for="page in pages"
              @click="getPostsByPage(page[1])"
              :class="(selectedPage === page[1])? 'selected' : 'normal'">{{ page[1] }}</p>
        </div>
      </div>
      <div class="side">
        <FilterSide @filterBox="filterByBoxes" @filterTerm="filterByTerm"></FilterSide>
      </div>
    </section>
  </main>
</template>

<style scoped>
.blog-title{
  font-size: 6rem;
  font-weight: 500;
  padding: 0 4rem;
}
.blog-sect{
  width: 100%;
  padding: 0 2rem;
  display: flex
}
.posts-sect{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.blog-list{
  width: clamp(40rem, 75vw, 100rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}
.side{
  width: clamp(20rem, 25vw, 40rem);
  height: 40rem;
  /* background-color: #636e72; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.pages{
    display: flex;
    justify-content: center;
    font-size: 2.5rem;
    gap: 1rem;
}

.page:hover{
    font-weight: 600;
    cursor: pointer;
}
.selected{
    font-weight: 700;
}
</style>