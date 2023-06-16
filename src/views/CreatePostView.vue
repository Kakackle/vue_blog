<!-- 
    View do tworzenia lub patchowania postow
    wybierane z listy istniejacych
    TODO: markdown itd
    TODO: moze searchbar do wyboru postow z tej listy zamiast sama lista
 -->

<script setup>
import { ref } from 'vue';
import GoBackButton from '../components/GoBackButton.vue';
import axios from 'axios';
import { useRoute } from 'vue-router'
import { getDataFromLink } from '../composables/axiosComposables';

import {useToast} from "vue-toastification";

const toast = useToast();

const route = useRoute();
const param_slug = route.params.post_slug;

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
        author: parseInt(newAuthor.value.id)
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

</script>

<template>
    <div class="main">
    <GoBackButton></GoBackButton>
    <div class="columns">
        <section class="select-sect">
            <p class="title">SELECT A POST TO UPDATE:</p>
            <!-- <select class="post-selection" v-if="postsExist">
                <option v-for="post in posts" :value="post.id">{{ post.title }}</option>
            </select> -->
            <div class="post-selection" v-if="postsExist">
                <p v-for="post in posts"
                @click=selectPost(post)>{{ post.title }}</p>
            </div>
            <div class="pages">
                <p class="page" v-for="(page, page_id) in pages" 
                @click="getPostsByPage(page[0], page_id)"
                :class="(selectedPage === page_id)? 'selected' : 'normal'">{{ page[1] }}</p>
            </div>
            <p class="title">selected post:</p>
            <p class="title" v-if="selectedPost">{{selectedPost.title}}</p>
            <button class="submit-button hover" @click="confirmDel" v-if="selectedPost">DELETE POST</button>
            <div class="confirm-delete" v-if="confirmDelete">
                <p class="title">ARE YOU SURE?</p>
                <div class="buttons">
                    <button class="submit-button hover" @click="deletePost">YES</button>
                    <button class="submit-button hover" @click="cancelDel">NO</button>
                </div>
            </div>
        </section>

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

                <div class="form-label">
                    <label for="tags">tags:</label>
                    <select class="text-input" id="tags" v-model="newTags" multiple>
                        <option v-for="tag in tags" :value=tag.name>{{ tag.name }}</option>
                    </select>
                </div>
                
                <div class="form-label">
                    <label for="new_tag">new tag:</label>
                    <input type="text" id="new_tag" v-model="newTag">
                    <ion-icon class="tag-icon hover" name="add-outline"
                    @click="addToTags()"></ion-icon>
                </div>
                <p>tags to be sent: <p v-for="tag in newTags">{{tag}}</p> </p>
                <div class="form-label">
                    <label for="content">content:</label>
                    <textarea id="content" class="text-input" v-model="newContent"></textarea>
                </div>
                <div class="form-label">
                    <label for="img">img:</label>
                    <input type="text" class="text-input" id="img" v-model="newImg">
                </div>
            </div>
        </div>
        <div class="buttons">
            <button class="submit-button hover" @click="submitForm(`post`)">POST &rarr;</button>
            <button class="submit-button hover" @click="submitForm(`patch`)">PATCH &rarr;</button>
        </div>
        <p v-if="success" class="success">{{success}}</p>
        <p v-if="error" class="error">{{error}}</p>

        </section>
        <div class="useful">
            <p>USEFUL LINKS:</p>
            <a href="https://unsplash.com/"> IMAGES</a>
            <a href="https://getlorem.com/">LOREM</a>
        </div>
    </div>
</div>
</template>

<style scoped>
.columns{
    /* display: flex; */
    gap: 2rem;
    /* justify-content: center; */
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
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
    font-size: 2.5rem;
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
    font-size: 2rem;
    display: flex;
    gap: 1rem;
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
    font-size: 2rem;
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