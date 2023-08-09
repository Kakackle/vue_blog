<!-- 
    View do tworzenia lub patchowania postow
    wybierane z listy istniejacych
 -->

<script setup>
import { ref, computed, watch } from 'vue';
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
// slug przychodzacy z route, tzn jesli przekierowany do tej strony od postu
const param_slug = route.params.post_slug;

//maska do formatu daty z date pickera
const masks = ref({
    modelValue: 'YYYY-MM-DD',
});

//poczatkowa wartosc do date pickera
const newDate = ref('2023-06-19');
const openDate = ref(0);

const getToday = () =>{
    const today = new Date();
    newDate.value = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
}
getToday();

// nowe wartosci z inputow do przeslania
const newTitle = ref("")
const newAuthor = ref()
const newTags = ref([])
const newTag = ref('')
const newContent = ref("")
const newImg = ref()
const previewImage = ref()

//dane pobierane do selectow
const tags = ref([]);
const users = ref([]);
const posts = ref([]);
const pages = ref([]);
//potwierdzenia
const tagsExist = ref(0);
const usersExist = ref(0);
const postsExist = ref([]);

//status msg
const success = ref('');
const error = ref('');

//wybrany z listy lub route post
const selectedPost = ref();
//wybrana strona elementu paginacji
const selectedPage = ref(0);

//czy na pewno chcesz usunac
const confirmDelete = ref(0);

//query string generalny do filtrowania listy po autorze, lub innych
const query_string = ref('posts/');
//czy chcesz pokazywac tylko posty uzytkownika
const ifLoggedIn = ref(0);
if (ifLoggedIn.value === 1){
    if (loggedUser) query_string.value=`posts/?author=${loggedUser.value.slug}`;
    else query_string.value = `posts/`;
}

//jesli zmieni sie zalogowany uzytkownik
watch(loggedUser, ()=>{
    if(ifLoggedIn.value === 1){
    query_string.value=`posts/?author=${loggedUser.value.slug}`;
    }
    else{
        query_string.value = `posts/`;
    }
})

//jesli ustawione ze filtruj po uzytkowniku zalogowanym
watch(ifLoggedIn, ()=>{
    if(ifLoggedIn.value){
        if(loggedUser) getPosts(query_string.value);
    }
    else{
        query_string.value = `posts/`;
        getPosts(query_string.value);
    }
})

//czysci inputy i odswieza listy, z nowymi danymi (wywolywane po post lbu patch)
const cleanInputs = async function(){
    newTitle.value = undefined
    newAuthor.value = undefined
    newTags.value = [] // dla tablicy
    // newTags.value = undefined
    newContent.value = undefined
    newImg.value = undefined
    selectedPost.value = undefined
    previewImage.value = undefined
    getTags();
    getUsers();
    getPosts(query_string.value);
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
        router.push({name: 'postlist'});
    })
    .catch((err)=>{
        error.value += err;
    })
    .finally(()=>{
        cleanInputs();
        confirmDelete.value = 0;
        getPosts(query_string.value);
    })
}

const uploadImage = function(e){
    newImg.value = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(newImg.value);
    reader.onload = e =>{
                    previewImage.value = e.target.result;
                };
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
        //jesli przyszlismy z route od konkretnego postu, wybieraj od razu po uzyskaniu postow
        //konkretny post
        if(param_slug){
            const param_post = posts.value.filter((post)=>{return post.slug === param_slug})[0]
            selectPost(param_post);
        }
    })
    .catch((err)=>
    {
        postsExist.value = 0;
        console.log(`get posts err: ${err}`);
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
        const stag = tags.value.filter((ttag)=>{
            return ttag.name === tag})
        selectedTags.push(stag[0].name);
    })
    newTags.value = selectedTags;
    // newTags.value = undefined
    newContent.value = selectedPost.value.content
    // newImg.value = selectedPost.value.img
    // newImg.value = getFileFromUrl(selectedPost.value.img, selectedPost.value.slug)
    // getFileFromUrl()
    previewImage.value = selectedPost.value.img;
    getUploadedImages();
}

async function getFileFromUrl(url, defaultType = 'image/jpg') {
    // trzeba jakos odebrac albo link albo z endpointu img (przy edycji postu)
    // i jakos to przeksztalcic na pelnoprawny img
    // i potem wyslac
    // ale nie mam pojecia jak

//   const response = await fetch(url)
//   const data = await response.blob() 
//   return new File([data], name, {
//     type: data.type || defaultType,
//   })
//   axios.get(url)
//   .then((res)=>{
//     data = res.data.blob()
//     newImg.value = new File([data], name, {
//     type: data.type || defaultType,
//     })
//     console.log(`data: ${data}`)
//   })
//   .catch((err)=>{
//     console.log(err);
//   })
//   axios.get(`image/${selectedPost.value.slug}`)
//   .then((res)=>{
//     // console.log(res.data);
//     newImg.value = res.data;
//   })
//   .catch((err)=>{
//     console.log(err);
//   })

// fetch(`image/${selectedPost.value.slug}`)
// .then(res => res.blob())
// .then(blob=>{
//     var reader = new FileReader();
//     reader.readAsDataURL(blob); 
//     reader.onloadend = function() {
//     var base64data = reader.result;
//     newImg.value = base64data;                
//     console.log(base64data);
//     }
// })

}

const submitForm = function(method){
    success.value = '';
    error.value = '';
    
    let newPost = {
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

    // jesli byl podany nowy obrazek - przeslij, jesli nie to nie
    if(newImg.value){
        newPost.img = newImg.value;
    }

    if(method === "post"){
        // jesli post, to ustaw date na podana, jesli patch to nie
        newPost.date_posted = newDate.value;
        // osobny endpoint na postowanie, poniewaz customowy
        met_url = `users/${newAuthor.value.id}/post`;
    }
    else{
        met_url = `posts/${selectedPost.value.slug}`;
    }

    axios({
        method: method,
        url: met_url,
        data: newPost,
        headers: {
            "Content-Type": "multipart/form-data",
        },
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
getPosts(query_string.value);

const compiledMarkdown = computed(()=>{
    return marked.parse(newContent.value, {
        "mangle": false,
        "headerIds": false,
    })
})

import AutoComplete from 'primevue/autocomplete';
import { storeToRefs } from 'pinia';
import router from '../router';

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
        console.log(`get all posts err: ${err}`);
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

//obrazki uploadowane do postu i mozliwe do dodania do markdown
const newPostImg = ref();
const newPostImgName = ref('');
const newPostImgUrl = ref();

const changePostImage = async function(e){
    newPostImg.value = e.target.files[0];
}

const uploadPostImage = async function(){
    axios.post(`posts/${selectedPost.value.slug}/images`,{
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        image: newPostImg.value,
        name: newPostImgName.value,
        post: selectedPost.value.slug
    },
    {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((res)=>{
        return axios.get(`posts/${selectedPost.value.slug}/images/${newPostImgName.value}`)
    })
    .then((res)=>{
        newPostImgUrl.value = res.data.image;
    })
    .catch((err)=>{
        console.log(`fail ${err}`);
    })

}

// lista obrazkow zuploadowanych do postu, wyswietlana by uzytkownik mial poglad

const uploadedImages = ref();

const getUploadedImages = async function(){
    console.log(`query: posts/${selectedPost.value.slug}/images`);
    axios.get(`posts/${selectedPost.value.slug}/images`)
    .then((res)=>{
        uploadedImages.value = res.data;
        console.log(`GET uploaded images success ${res.status}`)
    })
    .catch((err)=>{
        console.log(`GET uploaded images failure ${err}`)
    })
}

const copyToClipboard = function(link, name){
    navigator.clipboard.writeText(link);
    let md_str = `  ![${name}](${link} "${name}")`
    newContent.value += `  ${md_str}`;
}

// markdown editor controls

const addToMarkdown = function(add){
    newContent.value += add;
}

</script>

<template>
    <div class="main p-2">
    <GoBackButton></GoBackButton>
    <!-- post select section -->
    <section class="flex flex-col align-center justify-center p-4 shadow-lg">
            <p class="text-4xl justify-self-center">SELECT A POST TO UPDATE:</p>
            <!-- post select 3 col grid -->
            <div class="grid grid-cols-3 gap-4 p-4 ">

                <div class="flex flex-col gap-2">
                <!-- PrimeVue -->
                <AutoComplete v-model="selectedPost" optionLabel="title"
                    :suggestions="filteredPosts" v-if="allPosts" @complete="search"
                    @item-select="selectPost(selectedPost)"
                    placeholder="post title"
                />
                <!-- @complete="selectPost(selectPost)"-->
                <!-- is user logged in -->
                    <div class="flex gap-2 text-lg">
                        <label for="ifLogged">ONLY SELECT FROM LOGGED USER'S POSTS: </label>
                        <input type="checkbox" id="ifLogged" v-model="ifLoggedIn">
                    </div>
                </div>

                <!-- reczna lista postow -->
                <div class="flex flex-col gap-2 text-2xl">
                    <div class="flex flex-col" v-if="postsExist">
                        <p v-for="post in posts" class=" even:bg-gray-300 cursor-pointer"
                        @click=selectPost(post)>{{ post.title }}</p>
                    </div>
                    <!-- paginacja listy postow -->  
                    <div class="flex justify-center gap-2 text-2xl">
                        <p class="cursor-pointer" v-for="(page, page_id) in pages" 
                        @click="getPostsByPage(page[0], page_id)"
                        :class="(selectedPage === page_id)? 'selected' : 'normal'">{{ page[1] }}</p>
                    </div>
                </div>
 
                <!-- przyciski potwierdzajace -->
                <div>
                    <p class="text-xl">selected post:</p>
                    <p class="text-xl" v-if="selectedPost">{{selectedPost.title}}</p>
                    <button class="btn-basic" @click="confirmDel" v-if="selectedPost">DELETE POST</button>
                    <div class="flex gap-2 flex-col" v-if="confirmDelete">
                        <p class="text-xl">ARE YOU SURE?</p>
                        <div class="flex gap-2">
                            <button class="btn-basic" @click="deletePost">YES</button>
                            <button class="btn-basic" @click="cancelDel">NO</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    <div class="grid grid-cols-2">
        <!-- Select post from existing-->
        
        <!-- Create /edit post -->
        <section class="flex flex-col p-4 w-100 shadow-md items-center">
        <span class="title">CREATE A NEW POST:</span>
        <div class="flex flex-col" v-if="tagsExist && usersExist">
            <div class="flex flex-col gap-2">
                <div class="input-label-aligned">
                    <label for="title" class="w-16">title:</label>
                    <input type="text" class="form-text-input" id="title" v-model="newTitle">
                </div>
                <div class="input-label-aligned">
                    <label for="author" class="w-16">author:</label>
                    <select class="form-text-input" id="author" v-model="newAuthor">
                        <option v-for="user in users" :value=user>{{ user.name }}</option>
                    </select>
                </div>
                <!-- tags select -->
                <div class="input-label-aligned">
                    <label for="tags">tags:</label>
                    <select class="form-text-input" id="tags" v-model="newTags" multiple>
                        <option v-for="tag in tags" :value=tag.name>{{ tag.name }}</option>
                    </select>
                </div>
                <!-- add new tag -->
                <div class="form-label">
                    <label for="new_tag">new tag:</label>
                    <input type="text" id="new_tag" v-model="newTag" class="border-2 rounded w-auto">
                    <ion-icon class="tag-icon hover" name="add-outline"
                    @click="addToTags()"></ion-icon>
                </div>
                <p class="form-label">tags to be sent: <p v-for="tag in newTags">{{tag}}</p> </p>
                <div class="form-label">
                    <label for="content">content:</label>
                    <textarea id="content" class="border-2 rounded w-100" v-model="newContent"></textarea>
                </div>
                <div class="flex gap-2">
                    <button class="bg-gray-300 border rounded" @click="addToMarkdown(`#`)">H1</button>
                    <button class="bg-gray-300 border rounded" @click="addToMarkdown(`##`)">H2</button>
                    <button class="bg-gray-300 border rounded" @click="addToMarkdown(`###`)">H3</button>
                </div>
                <!-- img -->
                <p class="warn">WARNING: during editing you have to pick a value if you want it to have an image attached,
                    below is the previous image</p>
                <div class="form-label">
                    <label for="img">img:</label>
                    <input type="file" accept="image/jpeg, image/jpg,
                    image/png, image/gif" @change=uploadImage>
                    <!-- <input type="text" class="text-input" id="img" v-model="newImg"> -->
                </div>
                <div class="label-format">
                    <p>IMAGE PREVIEW:</p>
                    <img :src="previewImage" class="preview-img"/>
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
            <p v-else>You must be the post's author to send a POST/PATCH request with the post's values</p>
        </div>
        <p v-else>You must first log in to be able to send POST/PATCH requests</p>
        <p v-if="success" class="success">{{success}}</p>
        <p v-if="error" class="error">{{error}}</p>
        </section>
        <!-- Post preview -->
        <section class="post-preview prose" v-html="compiledMarkdown" v-if="newContent">
        </section>


    </div>
    <!-- image upload section -->
    <div class="upload-sect">
        <div class="img-name">
            <div class="img-name-left">
                <div class="form-label">
                    <label for="up-img">img:</label>
                    <input type="file" name="up-img" accept="image/jpeg, image/jpg,
                    image/png, image/gif" @change=changePostImage required>
                    <!-- <input type="text" class="text-input" id="img" v-model="newImg"> -->
                </div>
                <div class="form-label">
                    <label for="up-name">name:</label>
                    <input type="text" name="up-name"
                    placeholder="name for img" v-model="newPostImgName" required>
                </div>
            </div>
            <div class="img-name-right">
                <button class="submit-button" @click="uploadPostImage">SUBMIT</button>
            </div>
        </div>
        <p>IMG LINK: {{ newPostImgUrl }}</p>
        <img :src="newPostImgUrl" class="upload-preview" v-if="newPostImgUrl">
    </div>

    <!-- choose from uploaded images -->
    <section class="uploaded-images" v-if="uploadedImages">
        <p>IMAGES UPLOADED TO POST:</p>
        <div class="uploaded-list">
            <div class="uploaded-list-item" v-for="(img, img_id) in uploadedImages">
                <p>{{ img.name }}</p>
                <p class="hover" @click="copyToClipboard(img.image, img.name)">ADD TO MD: {{ img.image }}</p>
                <img :src="img.image" class="upload-preview"/>
            </div>
        </div>
    </section>
    <!-- Under columns: useful links -->
    <div class="useful">
            <p>USEFUL LINKS:</p>
            <a href="https://unsplash.com/"> IMAGES</a>
            <a href="https://getlorem.com/">LOREM</a>
    </div>
    <div class="cheatsheet">
        <p>SHORT MARKDOWN CHEATSHEET:</p>
        <img src="../assets/images/markdown_cheatsheet.jpg">
    </div>
</div>
</template>

<style scoped>
.columns{
    /* display: flex; */
    gap: 1rem;
    /* justify-content: center; */
    display: grid;
    grid-template-columns: 1fr 1fr;
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
.cheatsheet{
    display: flex;
    flex-direction: column;
    align-items: center;
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
.warn{
    font-size: 1rem;
    color: #636e72;
}
.upload-sect{
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    justify-items: center;
    align-items: center;
}
.upload-preview{
    height: 200px;
    width: 320px;
}
.img-name{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 2rem;
}
.img-name-left{
    display: flex;
    flex-direction: column;
}
.img-name-right{
 
}
.uploaded-images{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px dashed rgba(0,0,0,0.5);
    padding: 1rem;
}
.uploaded-list{
    display: flex;
    flex-direction: column;
    width: 90%;
    
}
.uploaded-list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(0,0,0,0.5);
}
.uploaded-list-item:nth-of-type(2n){
    background-color: rgba(0,0,0,0.1);
}
</style>