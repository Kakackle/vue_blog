<!-- 
    View do tworzenia lub patchowania postow
    wybierane z listy istniejacych
 -->

<script setup>
import { ref, computed } from 'vue';
import GoBackButton from '../components/GoBackButton.vue';
import axios from 'axios';
import { useRoute } from 'vue-router'
import { getDataFromLink } from '../composables/axiosComposables';

import {useToast} from "vue-toastification";
const toast = useToast();

import {marked} from 'marked';

import { useUserStore } from '../stores/user';
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);

const route = useRoute();
const param_slug = route.params.post_slug;

const masks = ref({
    modelValue: 'YYYY-MM-DD',
});

const newDate = ref('2023-06-19');
const openDate = ref(0);

const getToday = () =>{
    const today = new Date();
    newDate.value = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
}
getToday();

const newTitle = ref("")
const newAuthor = ref()
const newTags = ref([])
const newTag = ref('')
const newContent = ref("")
const newImg = ref("")

const tags = ref([]);
const users = ref([]);
const posts = ref([]);
const pages = ref([]);
const tagsExist = ref(0);
const usersExist = ref(0);
const postsExist = ref([]);

const success = ref('');
const error = ref('');

const selectedPost = ref();
const selectedPage = ref(0);

const confirmDelete = ref(0)

const cleanInputs = async function(){
    newTitle.value = undefined
    newAuthor.value = undefined
    newTags.value = [] // dla tablicy
    // newTags.value = undefined
    newContent.value = undefined
    newImg.value = undefined
    selectedPost.value = undefined 
    getTags();
    getUsers();
    getPosts(`posts/`);
}

const confirmDel = ()=>{
    confirmDelete.value = 1;
}
const cancelDel = ()=>{
    confirmDelete.value = 0;
}

const deletePost = async function(){
    axios.delete(`posts/${selectedPost.value.id}`)
    .then((res)=>{
        success.value += res.status + ' ' + res.statusText; 
    })
    .catch((err)=>{
        error.value += err;
    })
    .finally(()=>{
        cleanInputs();
        confirmDelete.value = 0;
        getPosts(`posts/`);
    })
}

const addToTags = function(){
    newTags.value.push(newTag.value);
}

const getTags = async function(){
    tags.value = (await getDataFromLink(`tags/`)).value;
    tagsExist.value=1;
}

const getUsers = async function(){
    users.value = (await getDataFromLink(`users/`)).value;
    usersExist.value=1;
}

const getPosts = async function(link){
    posts.value = [];
    postsExist.value = 0;
    const data = axios.get(link)
    .then((res)=>{
        posts.value = res.data.results;
        pages.value = res.data.context.page_links;
        postsExist.value = 1;
        if(param_slug){
            console.log(`param_slug:${param_slug}`);
            const param_post = posts.value.filter((post)=>{return post.slug === param_slug})[0]
            // console.log(`param_post:${JSON.stringify(param_post)}`);
            selectPost(param_post);
        }
    })
    .catch((err)=>
    {
        postsExist.value = 0;
        console.log(err);
    })
}
const getPostsByPage = async function(link, page_id){
    getPosts(link);
    selectedPage.value = page_id;
}

const selectPost = function(post){
    selectedPost.value = post;
    newTitle.value = selectedPost.value.title
    newAuthor.value = users.value.filter(user => selectedPost.value.author === user.username)[0];
    let selectedTags = [];
    selectedPost.value.tags.forEach((tag)=>{
        // console.log(`tag: ${tag}`);
        const stag = tags.value.filter((ttag)=>{
            // console.log(`ttag.id: ${ttag.id}`)
            return ttag.name === tag})
        // console.log(`stag: ${JSON.stringify(stag)}`)
        selectedTags.push(stag[0].name);
    })
    newTags.value = selectedTags;
    // newTags.value = undefined
    newContent.value = selectedPost.value.content
    newImg.value = selectedPost.value.img
}

const submitForm = function(method){
    success.value = '';
    error.value = '';
    
    const newPost = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        title: newTitle.value,
        tags: newTags.value,
        content: newContent.value,
        img: newImg.value,
        author: parseInt(newAuthor.value.id),
        date_posted: newDate.value
    }

    console.log(`data sent: ${JSON.stringify(newPost)}`)
    
    let met_url = '';

    if(method === "post"){
        met_url = `users/${newAuthor.value.id}/post`;
    }
    else{
        met_url = `posts/${selectedPost.value.id}`;
    }

    axios({
        method: method,
        url: met_url,
        data: newPost
    })
    .then((res)=>{
        success.value += res.status + ' ' + res.statusText; 
        toast.success(success.value);
    })
    .catch((err)=>{
        error.value += err;
        toast.error(error.value);
    })
    .finally(cleanInputs)
}

getTags();
getUsers();
getPosts(`posts/`);

// const if_param_slug = async function(){
//     await getPosts(`posts/`);
//     selectedPost.value = posts.value.filter((post)=>{post.slug === param_slug})[0]
// }

// if (param_slug){
//     if_param_slug();    
// }
// else{
//     getPosts('posts/');
// }

const compiledMarkdown = computed(()=>{
    return marked.parse(newContent.value, {
        "mangle": false,
        "headerIds": false,
    })
})

// FIXME: jak to ma niby dzialac????
// import autoComplete from "@tarekraafat/autocomplete.js";
// const autoCompleteJS = new autoComplete({
//     selector: "#autoComplete",
//     placeHolder: "search posts",
//     data:{
//         src: posts.value,
//         keys: ['title']
//     },
//     resultItem: {
//         highlight: true
//     }
//  });

import AutoComplete from 'primevue/autocomplete';
import { storeToRefs } from 'pinia';

//FIXME: troche chujowe takie pobieranie all postow
//gdyby bylo ich bardzo duzo to duzy hit dla performance moze byc
//ale jak inaczej to zrobic? bo chcialbym szukajac miec dostep do wszystkiego
//zeby moglo wszystko sugerowac
const filteredPosts = ref();
const allPosts = ref();
const getAllPosts = async function(){
    axios.get(`posts/all/`)
    .then((res)=>
    {
        allPosts.value = res.data;
    })
    .catch((err)=>{
        console.log(err);
    })
}
getAllPosts();

const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredPosts.value = [...allPosts.value];
        } else {
            filteredPosts.value = allPosts.value.filter((post) => {
                return post.title.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}
</script>

<template>
    <div class="main">
    <GoBackButton></GoBackButton>
    <div class="columns">
        <!-- Select post from existing-->
        <section class="select-sect">
            <p class="title">SELECT A POST TO UPDATE:</p>
            <!-- PrimeVue -->
            <AutoComplete v-model="selectedPost" optionLabel="title"
                :suggestions="filteredPosts" v-if="allPosts" @complete="search"
                @item-select="selectPost(selectedPost)"
                />
                <!-- @complete="selectPost(selectPost)"-->
            <!-- reczna lista postow -->
            <div class="post-selection" v-if="postsExist">
                <p v-for="post in posts"
                @click=selectPost(post)>{{ post.title }}</p>
            </div>
            <!-- paginacja listy postow -->
            <div class="pages">
                <p class="page" v-for="(page, page_id) in pages" 
                @click="getPostsByPage(page[0], page_id)"
                :class="(selectedPage === page_id)? 'selected' : 'normal'">{{ page[1] }}</p>
            </div>
            <!-- przyciski potwierdzajace -->
            <p class="sub-title">selected post:</p>
            <p class="sub-title" v-if="selectedPost">{{selectedPost.title}}</p>
            <button class="submit-button hover" @click="confirmDel" v-if="selectedPost">DELETE POST</button>
            <div class="confirm-delete" v-if="confirmDelete">
                <p class="title">ARE YOU SURE?</p>
                <div class="buttons">
                    <button class="submit-button hover" @click="deletePost">YES</button>
                    <button class="submit-button hover" @click="cancelDel">NO</button>
                </div>
            </div>
        </section>
        <!-- Create /edit post -->
        <section class="post-sect">
        <span class="title">CREATE A NEW POST:</span>
        <div class="input-form" v-if="tagsExist && usersExist">
            <div class="form-inputs">
                <div class="form-label">
                    <label for="title">title:</label>
                    <input type="text" class="text-input" id="title" v-model="newTitle">
                </div>
                <div class="form-label">
                    <label for="author">author:</label>
                    <select class="text-input" id="author" v-model="newAuthor">
                        <option v-for="user in users" :value=user>{{ user.name }}</option>
                    </select>
                </div>
                <!-- tags select -->
                <div class="form-label">
                    <label for="tags">tags:</label>
                    <select class="text-input" id="tags" v-model="newTags" multiple>
                        <option v-for="tag in tags" :value=tag.name>{{ tag.name }}</option>
                    </select>
                </div>
                <!-- add new tag -->
                <div class="form-label">
                    <label for="new_tag">new tag:</label>
                    <input type="text" id="new_tag" v-model="newTag">
                    <ion-icon class="tag-icon hover" name="add-outline"
                    @click="addToTags()"></ion-icon>
                </div>
                <p class="form-label">tags to be sent: <p v-for="tag in newTags">{{tag}}</p> </p>
                <div class="form-label">
                    <label for="content">content:</label>
                    <textarea id="content" class="text-input" v-model="newContent"></textarea>
                </div>
                <div class="form-label">
                    <label for="img">img:</label>
                    <input type="text" class="text-input" id="img" v-model="newImg">
                </div>
                <button class="submit-button hover" @click="openDate=1">CHOOSE DATE</button>
                <VDatePicker v-model.string="newDate" :masks="masks" @click="openDate=0"
                    v-if="openDate"/>
                    <p class="date">Date: {{ newDate }}</p>
            </div>
        </div>
        <div v-if="newAuthor && loggedUser">
        <div class="buttons" v-if="loggedUser.slug === newAuthor.slug">
            <button class="submit-button hover" @click="submitForm(`post`)">POST &rarr;</button>
            <button class="submit-button hover" @click="submitForm(`patch`)">PATCH &rarr;</button>
        </div>
        </div>
        <p v-if="success" class="success">{{success}}</p>
        <p v-if="error" class="error">{{error}}</p>
        </section>
        <!-- Post preview -->
        <section class="post-preview" v-html="compiledMarkdown" v-if="newContent">
        </section>


    </div>
    <!-- Under columns: useful links -->
    <div class="useful">
            <p>USEFUL LINKS:</p>
            <a href="https://unsplash.com/"> IMAGES</a>
            <a href="https://getlorem.com/">LOREM</a>
    </div>
</div>
</template>

<style scoped>
.columns{
    /* display: flex; */
    gap: 1rem;
    /* justify-content: center; */
    display: grid;
    grid-template-columns: 1fr 3fr 3fr;
    padding: 2rem;
}
.post-sect, .select-sect{
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    gap: 2rem;
    padding: 2rem;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.15);
    /* width: 60%; */
    position: relative;
}
.input-form{
    display: flex;
    gap: 1rem;
}
.title{
    font-size: 2rem;
}
.sub-title{
    font-size: 1.5rem;
}
.form-inputs{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1rem;
    font-size: 2rem;
    /* height: 1.5rem; */
    padding: 0;
}
.form-label{
    font-size: 1.5rem;
    display: flex;
    gap: 2rem;
    min-height: 2rem;
}
.form-label label{
    width: 4rem;
}
.form-label input{
    width: 20rem;
    height: 2rem;
}
.form-label select{
    height: 6rem;
    width: 20rem;
}
.form-label textarea{
    /* width: 100%; */
    width: 40rem;
    height: 20rem;
}
.submit-button{
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
.useful{
    /* position: absolute; */
    display: flex;
    flex-direction: column;
    /* right: 2rem; */
    font-size: 2rem;
}
.success, .error{
    font-size: 2rem;
    font-weight: 500;
    color: green;
}
.error{
    color: red;
}

.post-selection{
    font-size: 1.2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.post-selection p:nth-of-type(2n){
    background-color: rgba(0,0,0,0.1);
}
.post-selection p:hover{
    font-weight: 600;
    filter: brightness(0.7);
}
.pages{
    display: flex;
    font-size: 1.5rem;
    gap: 1rem;
}

.page:hover{
    font-weight: 600;
    cursor: pointer;
}
.selected{
    font-weight: 700;
}
.buttons{
    display: flex;
    gap: 1rem;
    justify-content: center;
}
.confirm-delete{
    display: flex;
    flex-direction: column;
}
</style>