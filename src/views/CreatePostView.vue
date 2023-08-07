<!-- 
    View do tworzenia lub patchowania postow
    wybierane z listy istniejacych
 -->

<!-- TODO: generalne: przydaloby sie stworzyc oddzielne komponenty
    na wybieranie postu - i dosyc latwo by to chyba przekazywac
    
    oraz komponent na forme postu? i np zwraca obiekt emitem
    preview nwm czy potrzeba, ale teoretycznie to samo co w poscie realnym tylko mniejsze

    komponent na upload obrazkow i wyswietlanie ich?
    potencjalnie czemu nie, bo potem by przekazywal tekst to wklejenia w
    markdown postu czy cos tylko
-->

<script setup>
import { ref, computed, watch } from 'vue';
import GoBackButton from '../components/GoBackButton.vue';
import Footer from '../components/Footer.vue';
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

    if(method === "post"){
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
        uploadedImages.value = undefined;
        getUploadedImages();
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

// defacto teraz poza kopiowaniem do clipboardu dodaje tez do postu
const copyToClipboard = function(link, name){
    navigator.clipboard.writeText(link);

    // samo dodawanie obrazku
    // let md_str = `  ![${name}](${link} "${name}")`

    // dodawanie obrazku wycentrowanego
    let md_str = `\r\n` + `<p align="center">
    <img width="600" height="400" src="${link}" alt="${name}">
    </p>`;
    newContent.value += `  ${md_str}`;
}

// markdown editor controls

const addToMarkdown = function(add){
    newContent.value += '\r\n' + add + ' ';
}

const centerMarkdown = function(){
    newContent.value += '\r\n' + '<p align=center>{{your content here}}</p>' + ' ';
}

const boldMarkdown = ()=>{
    newContent.value += '\r\n' + `**{{your content here}}**` + ' ';
}

const italicsMarkdown = ()=>{
    newContent.value += '\r\n' + `*{{your content here}}*` + ' ';
}

const linkMarkdown = ()=>{
    newContent.value += '\r\n' + `[Link title here](hyperlink here)` + ' ';
}

const selectOpen = ref(0);

</script>

<template>
    <div class="main">
    <GoBackButton></GoBackButton>
    <!-- Select post from existing-->
    <div class="select-dropdown">
        <p>SELECT A POST TO UPDATE:</p>
        <ion-icon name="caret-down-outline" class="caret-icon hover"
        :class="{'select-open': selectOpen}"
        @click="selectOpen? selectOpen = 0: selectOpen = 1"
        ></ion-icon>
    </div>
    <section class="select-sect section-separator" v-if="selectOpen">
        <!-- wybor postu -->
        <!-- <p class="title">SELECT A POST TO UPDATE:</p> -->
        <!-- PrimeVue -->
        <div class="select-cont">
            <div class="select-left">
                <div class="filters">
                    <AutoComplete v-model="selectedPost" optionLabel="title"
                        :suggestions="filteredPosts" v-if="allPosts" @complete="search"
                        @item-select="selectPost(selectedPost)"
                        />
                    <!-- czy tylko wyswietlac posty zalogowanego -->
                    <div>
                        <input type="checkbox" id="ifLogged" v-model="ifLoggedIn">
                        <label for="ifLogged">Only list your posts </label>
                    </div>
                        <!-- @complete="selectPost(selectPost)"-->
                </div>
                <!-- reczna lista postow -->
                <div class="post-selection" v-if="postsExist">
                    <p v-for="post in posts"
                    @click=selectPost(post)>{{ post.title }}</p>
                </div>
                <!-- paginacja listy postow -->
                <div class="pages">
                    <p class="page hover" v-for="(page, page_id) in pages" 
                    @click="getPostsByPage(page[0], page_id)"
                    :class="(selectedPage === page_id)? 'selected' : 'normal'">{{ page[1] }}</p>
                </div>
            </div>
            <!-- wybrany post i przyciski potwierdzajace operacje -->
            <div class="select-right">
                <p class="sub-sub-title">SELECTED POST:</p>
                <p class="sub-title" v-if="selectedPost">{{selectedPost.title}}</p>
                <button class="submit-button hover" @click="confirmDel" v-if="selectedPost">DELETE POST</button>
                <div class="confirm-delete" v-if="confirmDelete">
                    <p class="title">ARE YOU SURE?</p>
                    <div class="buttons">
                        <button class="submit-button hover" @click="deletePost">YES</button>
                        <button class="submit-button hover" @click="cancelDel">NO</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="post-columns section-separator">
        <!-- Create /edit post -->
        <div class="post-form">
            <span class="title" v-if="selectedPost">UPDATE POST:</span>
            <span class="title" v-else>CREATE A NEW POST:</span>
            <!-- form -->
            <div class="input-form" v-if="tagsExist && usersExist">
                <div class="form-inputs">
                    <!-- tytul -->
                    <div class="form-label">
                        <label for="title">title:</label>
                        <input type="text" class="text-input" id="title" v-model="newTitle">
                    </div>
                    <!-- autor select -->
                    <div class="form-label">
                        <label for="author">author:</label>
                        <select class="text-input" id="author" v-model="newAuthor">
                            <option v-for="user in users" :value=user>{{ user.name }}</option>
                        </select>
                    </div>
                    <!-- tags select -->
                    <div class="form-label">
                        <label for="tags">tags:</label>
                        <select class="text-input multi-select" id="tags" v-model="newTags" multiple>
                            <option v-for="tag in tags" :value=tag.name>{{ tag.name }}</option>
                        </select>
                    </div>
                    <!-- add new tag -->
                    <div class="form-label">
                        <label for="new_tag">Add a new tag:</label>
                        <input type="text" id="new_tag" v-model="newTag">
                        <ion-icon class="tag-icon hover" name="add-outline"
                        @click="addToTags()"></ion-icon>
                    </div>
                    <!-- DEBUG -->
                    <!-- <p class="form-label">tags to be sent: <p v-for="tag in newTags">{{tag}}</p> </p> -->
                    <!-- content controls -->
                    <div class="md-controls">
                        <button class="md-button" @click="addToMarkdown(`#`)">H1</button>
                        <button class="md-button" @click="addToMarkdown(`##`)">H2</button>
                        <button class="md-button" @click="addToMarkdown(`###`)">H3</button>
                        <button class="md-button" @click="centerMarkdown">Center</button>
                        <button class="md-button" @click="boldMarkdown">B</button>
                        <button class="md-button" @click="italicsMarkdown">I</button>
                        <button class="md-button" @click="linkMarkdown">Link</button>
                    </div>
                    <!-- post content -->
                    <div class="form-label">
                        <label for="content">content:</label>
                        <textarea id="content" class="text-input" v-model="newContent"></textarea>
                    </div>
                    <!-- cover image -->
                    <p class="warn">WARNING: during editing you have to pick a value if you want it to have an image attached,
                        below is the previous image</p>
                    <!-- img input -->
                    <div class="form-label">
                        <label for="img-input">Cover Image:</label>
                        <input id="img-input" type="file" accept="image/jpeg, image/jpg,
                        image/png, image/gif" @change=uploadImage>
                        <!-- <input type="text" class="text-input" id="img" v-model="newImg"> -->
                    </div>
                    <!-- image label -->
                    <div class="form-label">
                        <p>Image preview:</p>
                        <img :src="previewImage" class="preview-img"/>
                    </div>
                    <!-- date picker -->
                    <div class="form-label">
                        <label>Date posted:</label>
                        <button class="submit-button date-button hover" @click="openDate=1">CHOOSE DATE</button>
                    </div>
                    
                    <VDatePicker v-model.string="newDate" :masks="masks" @click="openDate=0"
                        v-if="openDate"/>
                    <p class="date">Date chosen: {{ newDate }}</p>
                </div>
            </div>
            <!-- jesli autor postu edytowanego zgadza sie z zalogowanym -->
            <div v-if="newAuthor && loggedUser">
                <div class="buttons" v-if="loggedUser.slug === newAuthor.slug">
                    <button class="submit-button hover" @click="submitForm(`post`)">POST &rarr;</button>
                    <button class="submit-button hover" @click="submitForm(`patch`)">PATCH &rarr;</button>
                </div>
                <p class="sub-title error" v-else>You must be the post's author to send a POST/PATCH request with the post's values</p>
            </div>
            <!-- raport sukcesu dodania/edycji postu -->
            <p class="sub-title error" v-else>You must first log in to be able to send POST/PATCH requests</p>
            <p v-if="success" class="success">{{success}}</p>
            <p v-if="error" class="error">{{error}}</p>
        </div>

        <!-- Post preview -->
        <div class="post-preview">
            <p class="title">POST PREVIEW:</p>
            <div>
                <p v-if="newTitle" class="preview-title">{{ newTitle }}</p>
                <div class="preview-subdiv">
                    <p v-if="newAuthor">{{ newAuthor.name }}</p>
                    <p v-if="newDate">{{ newDate }}</p>
                </div>
            </div>
            <p class="sub-sub-title"></p>
            <div class="preview-text prose" v-html="compiledMarkdown" v-if="newContent">
            </div>
        </div>

    </section>
    <!-- image upload section -->
    <section class="upload-sect section-separator">
        <h1 class="title">IMAGE GRID</h1>
        <p class="title">Here you can upload images to put inside your post</p>
        <p class="sub-title">Just choose a file, a name for the image and click the submit button,
            for it to appear in the table below, from which you can copy the markdown format
            to put inside the post content just by clicking at the image's name</p>
        
        <div class="upload-grid">
            <!-- form -->
            <div class="img-name">
                <div class="img-name-left">
                    <!-- przesylanie obrazku -->
                    <div class="form-label">
                        <label for="up-img">Image:</label>
                        <input type="file" name="up-img" id="up-img" accept="image/jpeg, image/jpg,
                        image/png, image/gif" @change=changePostImage required>
                        <!-- <input type="text" class="text-input" id="img" v-model="newImg"> -->
                    </div>
                    <!-- nazwa -->
                    <div class="form-label">
                        <label for="up-name">Image name:</label>
                        <input type="text" name="up-name"
                        placeholder="name for img" v-model="newPostImgName" required>
                    </div>
                </div>
                <!-- submit -->
                <div class="img-name-right">
                    <button class="submit-button" v-if="newPostImgName" @click="uploadPostImage">SUBMIT</button>
                </div>
            </div>
            <!-- zwracany link i preview obrazku -->
            <p class="sub-sub-title">Internal image link: {{ newPostImgUrl }}</p>
            <img :src="newPostImgUrl" class="upload-preview" v-if="newPostImgUrl">
        </div>
    </section>

    <!-- choose from uploaded images  - tablica-->
    <section class="uploaded-images section-separator" v-if="uploadedImages">
        <p class="title">IMAGES UPLOADED TO POST:</p>
        <div class="uploaded-list">
            <div class="uploaded-list-item" v-for="(img, img_id) in uploadedImages">
                <p class="bolded">{{ img.name }}</p>
                <p class="add-hover hover" @click="copyToClipboard(img.image, img.name)">Add to post: {{ img.image }}</p>
                <img :src="img.image" class="upload-preview"/>
            </div>
        </div>
    </section>
    <!-- Under columns: useful links -->
    <section class="extras-section section-separator">
        <div class="cheatsheet">
            <p class="title">SHORT MARKDOWN CHEATSHEET:</p>
            <img src="../assets/images/markdown_cheatsheet.jpg">
        </div>
        <div class="useful">
                <p class="title">OTHER USEFUL LINKS:</p>
                <a href="https://unsplash.com/"> IMAGES</a>
                <a href="https://getlorem.com/">LOREM</a>
        </div>
    </section>
    <Footer></Footer>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    max-width: var(--max-page-width);
    margin: 0 auto;
}
/* -------------------------------------------------------------------------- */
/*                             select post section                            */
/* -------------------------------------------------------------------------- */
.select-sect{
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
    border-bottom: 8px solid var(--dark-gray);
}

.select-cont{
    display: flex;
    /* gap: 50px; */
}

.select-left{
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 250px;
    max-width: 350px;
}

.filters{
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 2rem;
}
/* TODO: stylizacja tej listy wyboru - chociazby fontsize pls.. - jak to zrobic */
.filters .p-autocomplete-item{
    font-size: 20px;
}

.filters div{
    font-size: 2rem;
    display: flex;
    gap: 2px;
    align-items: center;
}

.post-selection{
    font-size: 1.8rem;
    /* max-width: 200px; */
    width: 100%;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 5px;
    color: var(--dark-gray);
    /* border: 2px dashed var(--mid-light); */
}
.post-selection p:nth-of-type(2n){
    background-color: var(--mid-lighter);
}
.post-selection p:hover{
    font-weight: 600;
    filter: brightness(0.7);
}
.pages{
    display: flex;
    justify-content: center;
    font-size: 2rem;
    gap: 1rem;
}

.page:hover{
    font-weight: 600;
    text-decoration: underline;
}

.select-right{
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    gap: 10px;
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
.select-dropdown{
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 3rem;
    color: var(--dark-gray);
    padding: 2px 10px;
    margin-top: 20px;
}

.select-open{
    visibility: visible;
    font-size: 2rem;
    /* color: var(--accent-yellow); */
    /* border-radius: 50%; */
    border-radius: 3px;
    border: 2px solid var(--dark-gray);
}

.caret-icon{
    font-size: 2rem;
    visibility: visible;
}

/* -------------------------------------------------------------------------- */
/*                           form + preview section                           */
/* -------------------------------------------------------------------------- */

.post-columns{
    /* max-width: var(--max-page-width); */
    /* margin: 0 auto; */
    display: flex;
    /* width: 100vw; */
    /* width: 780px; */
    /* border: 2px dashed var(--dark-gray); */
    flex-wrap: wrap;
}
.post-form{
    justify-self: flex-start;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    gap: 20px;
    padding: 20px;
    /* width: 760px;    */
    /* width: 60%; */
    position: relative;
    /* flex-shrink: 1; */
    width: clamp(400px, 100%, 650px);
    border-right: 6px solid var(--dark-gray);
}
.input-form{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}
.form-inputs{
    display: flex;
    flex-direction: column;
    /* justify-content: space-evenly; */
    gap: 10px;
    /* font-size: 2rem; */
    /* height: 1.5rem; */
    /* padding: 0; */
}
.form-label{
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 20px;
    min-height: 2rem;
}
.form-label label{
    width: 6rem;
    text-transform: capitalize;
}
.form-label input, select, textarea{
    width: 20rem;
    height: 2.5rem;
    padding: 0 4px;
    border: 2px solid var(--mid-lighter);
    border-radius: 3px;
    font-size: 1.5rem;
    color: var(--dark-gray);
}

.multi-select{
    height: 6rem;
}

.tag-icon{
    background-color: var(--dark-gray);
    color: var(--almost-white);
    border-radius: 50%;
    font-size: 1.5rem;
}

.form-label textarea{
    /* width: 100%; */
    font-size: 1.5rem;
    width: clamp(25rem, 100%, 50rem);
    height: 30rem;
}

.md-controls{
    display: flex;
    gap: 10px;
    transform: translateX(8rem);
}

.md-button{
    background-color: var(--dark-gray);
    border-radius: 3px;
    color: var(--almost-white);
    font-size: 1.5rem;
    /* width: 28px;
    height: 20px; */
    padding: 0 4px;
}

.warn{
    font-size: 1.2rem;
    color: #636e72;
}

#img-input{
    font-size: 1.5rem;
    color: var(--dark-gray);
    height: 35px;
    width: 50rem;
    /* size: 60px; */
}

.preview-img{
    /* max-height: 400px; */
    /* max-width: 600px; */
    width: clamp(300px, 100%, 500px);
}

.submit-button{
    background-color: var(--dark-gray);
    color: var(--almost-white);
    padding: 2px 10px;
    border-radius: 3px;
    font-size: 2rem;
}

.date-button{
    width: 20rem;
}

.date{
    font-size: 1.5rem;
}

/* ============== PREVIEW ============ */

.post-preview{
    padding: 10px;
    /* position: absolute;
    transform: translateX(780px); */
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    max-width: var(--max-page-width);
}

.post-preview div{
    align-self: flex-start;
}


.preview-subdiv{
    align-self: flex-start;
    display: flex;
    gap: 10px;
    font-size: 1.2rem;
    color: var(--mid-light);
}

.preview-title{
    align-self: start;
    font-size: 4rem;
}

.preview-text{
    font-size: 1.2rem;
    /* align-self: flex-start; */
}

/* -------------------------------------------------------------------------- */
/*                            upload image section                            */
/* -------------------------------------------------------------------------- */

.upload-sect{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-top: 2px dashed var(--dark-gray);
}
.upload-grid{
    /* display: grid;
    grid-template-columns: 1fr 3fr 1fr; */
    align-self: flex-start;
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    /* align-items: center; */
}

#up-img{
    font-size: 1.5rem;
    color: var(--dark-gray);
    height: 35px;
    width: 25rem;
    /* size: 60px; */
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
    /* border: 1px dashed rgba(0,0,0,0.5); */
    padding: 10px;
}
.uploaded-list{
    display: flex;
    flex-direction: column;
    width: 100%;
}
.uploaded-list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-size: 2rem;
    border-bottom: 1px solid var(--dark-gray);
}
.uploaded-list-item:nth-of-type(2n){
    background-color: var(--very-light);
}

.add-hover:hover{
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
}

/* -------------------------------------------------------------------------- */
/*                            extras/useful                                   */
/* -------------------------------------------------------------------------- */

.extras-section{
    display: flex;
    flex-direction: column;
    padding: 20px;
    align-items: center;
}

.useful{
    /* position: absolute; */
    display: flex;
    flex-direction: column;
    gap: 5px;
    /* right: 2rem; */
    font-size: 2rem;
}
.cheatsheet{
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* -------------------------------------------------------------------------- */
/*                                 general use                                */
/* -------------------------------------------------------------------------- */

.title{
    font-size: 2rem;
}

.sub-title{
    font-size: 1.5rem;
}

.sub-sub-title{
    font-size: 1.2rem;
}

.bolded{
    font-weight: 600;
}

.success, .error{
    font-size: 2rem;
    font-weight: 500;
    color: green;
}
.error{
    color: red;
}

/* -------------------------------------------------------------------------- */
/*                                   useful                                   */
/* -------------------------------------------------------------------------- */
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

</style>