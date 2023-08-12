<script setup>
import { useRoute, useRouter} from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import PreviewList from "../components/PreviewList.vue"
import GoBackButton from "../components/GoBackButton.vue"
import PostsPaginated from '../components/PostsPaginated.vue';

import {useToast} from "vue-toastification";
const toast = useToast();
const success = ref('');
const error = ref('')

const route = useRoute();
const router = useRouter();
const tag_slug = route.params.tag_slug;
const tag = ref();
const tagExists = ref(0);
const errorMsg = ref("");

//if tag doesn't exist, get some tags to list them
const tags = ref([]);
const getTags = async function(){
    axios.get(`tags/`)
    .then((res)=>{
        tags.value = res.data;
    })
    .catch((err)=>{
        console.log(` get tags/ err: ${err}`);
    })
}
getTags();

//reset site by going to existing tag - on wrong query tag name
const resetSite = function(tag){
    getTagBySlug(tag.slug);
    // router.push({name: 'tag', params:{tag_slug: tag.slug}});

}

const getTagBySlug = async function(tag_slug){
    axios.get(`tags/${tag_slug}`)
    .then((response) => {
        tag.value = response.data;
        tagExists.value = 1;
        console.log("tag by slug Success");
    })
    .then(() => {
        posts.value = [];
        getPostsByTag(`posts/?tag=${tag.value.id}`)
    })
    .catch((error) =>{
        tagExists.value = 0;
        errorMsg.value = error;
        console.log("tag by slug Failure");
    })
}
const posts = ref([]);
const pages = ref([]);

const getPostsByTag = async function(link){
    await axios.get(link)
    .then((res)=>{
        posts.value = res.data.results;
        pages.value = res.data.context.page_links;
    })
}

getTagBySlug(tag_slug);

const newName = ref('');
const newDesc = ref('');

const beingEdited = ref(0);
const openEdit = () =>{
    newName.value = tag.value.name;
    newDesc.value = tag.value.description;
    beingEdited.value = 1;
}

const submitEdit = async function(){
    const newTag = {
        name: newName.value,
        description: newDesc.value,
    }
    axios.patch(`tags/${tag.value.id}`, newTag)
    .then((res)=>{
        success.value += res.status + ' ' + res.statusText;
        toast.success(success.value);
    })
    .catch((err)=>{
        error.value +='an error ocurred: ' + err;
        toast.error(error.value);
    })
    .finally(()=>{
        newName.value = '';
        newDesc.value = '';
        getTagBySlug(tag_slug);
        beingEdited.value = 0;
    })
}

const deleteTag = async function(){
    axios.delete(`tags/${tag.value.slug}`)
    .then((res)=>{
        console.log(`delete tag succes: ${res}`);
        router.push({name: 'tags'});
    })
    .catch((err)=>{console.log(`delete tag err ${err}`)})
}

</script>

<template>
<div>
    <GoBackButton></GoBackButton>
    <!-- jesli poprawny response z API -->
    <div v-if="tagExists" class="main">
        <!-- domyslny podglad -->
        <section class="tag-view" v-if="!beingEdited">
            <div class="nameandedit">
                <p class="tag-name">{{tag.name}}:</p>
                <button class="edit-button hover" v-if="!beingEdited" @click="openEdit">EDIT TAG</button>
            </div>
            <p class="tag-desc">{{tag.description}}</p>
            <p class="title" v-if="posts">Posts with tag {{ tag.name }} [{{ tag.post_count }}]:</p>
            <PostsPaginated v-if="posts.length" :type="'large'"
                :posts="posts" :pages="pages" class="posts-paginated"></PostsPaginated>
            <p v-if="success" class="success">{{success}}</p>
            <p v-if="error" class="error">{{error}}</p>
        </section>
        <!-- jesli tag jest edytowany -->
        <section class="tag-view edit-view" v-if="beingEdited">
            <div class="label-div">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="newName">
            </div>
            <div class="label-div">
                <label for="desc">Desc:</label>
                <textarea class="tag-desc-input" v-model="newDesc"></textarea>
            </div>
            <button class="submit-button hover" v-if="beingEdited" @click="submitEdit(user_id)">CONFIRM</button>
            <button class="submit-button hover" @click="deleteTag">DELETE TAG</button>
        </section>
    </div>
    <!-- bad request etc -->
    <div v-else class="else">
        <p>Server response: {{ errorMsg }}</p>
        <p>The tag "{{ route.params.tag_slug }}" doesn't exist!</p>
        <div class="suggested" v-if="tags">
            <p>Some suggested tags instead:</p>
            <ul class="tag-links">
                <li v-for="tag in tags.slice(0,5)"
                    @click="resetSite(tag)"
                    class="hover"
                    >{{ tag.name }}</li>
            </ul>
        </div>
    </div>
</div>
</template>

<style scoped>
.main{
    max-width: var(--max-page-width);
    margin: 0 auto;
    margin-top: 50px;
}
.tag-view{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
}

.nameandedit{
    display: flex;
    align-items: center;
    gap: 50px;
}

.tag-name{
    color: var(--dark-gray);
    font-size: 3rem;
    text-decoration: underline;
    text-underline-offset: 8px;
}

.edit-button{
    font-size: 1.5rem;
    color: var(--mid-light);
}

.tag-desc{
    color: var(--dark-gray);
    font-size: 1.5rem;
    width: 40rem;
}

.title{
    font-size: 2rem;
}

.posts-paginated{
    align-self: center;
    max-width: 1000px;
}


.edit-view{
    
}

.label-div{
    display: flex;
    font-size: 1.5rem;
}

.label-div label{
    font-size: 1.5rem;
    width: 8rem;
}

.label-div input, textarea{
    border: 3px solid var(--mid-light);
    border-radius: 3px;
}

.tag-desc-input{
    font-size: 1.5rem;
    width: 40rem;
    height: 10rem;
}

.submit-button{
    width: 15rem;
    height: 3rem;
    font-size: 2rem;
    background-color: var(--dark-gray);
    color: var(--almost-white);
    border-radius: 3px;
}
/* .hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
} */

.success, .error{
    font-size: 2rem;
    font-weight: 500;
    color: green;
}
.error{
    color: red;
}
.else{
    display: flex;
    flex-direction: column;
    font-size: 2.5rem;
}
.suggested{

}
.suggested p{
    font-size: 2rem;
}
.tag-links{
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
}
</style>