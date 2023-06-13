<!-- 
    TODO: cleanup
 -->
<script setup>
import { useRoute, useRouter} from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import PreviewList from "../components/PreviewList.vue"
import GoBackButton from "../components/GoBackButton.vue"
import PostsPaginated from '../components/PostsPaginated.vue';

const route = useRoute();
const router = useRouter();
const tag_slug = route.params.tag_slug;
const tag = ref();
const tagExists = ref(0);
const errorMsg = ref("");

const getTagBySlug = function(){
    axios.get(`tags/${tag_slug}`)
    .then((response) => {
        tag.value = response.data;
        tagExists.value = 1;
        console.log("Success");
    })
    .then(() => {
        posts.value = [];
        getPostsByTag(`posts/?tag=${tag.value.id}`)
    })
    .catch((error) =>{
        tagExists.value = 0;
        errorMsg.value = error;
        console.log("Failure");
        router.push({name: 'catchall', params: {tag_slug: tag_slug}});
        
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

getTagBySlug();

const success = ref('');
const error = ref('');

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
    })
    .catch((err)=>{
        error.value += err;
    })
    .finally(()=>{
        newName.value = '';
        newDesc.value = '';
        getTagBySlug();
        beingEdited.value = 0;
    })
}

const deleteTag = async function(){
    axios.delete(`tags/${tag.value.slug}`)
    .then((res)=>{
        console.log(res);
        router.push({name: 'tags'});
    })
    .catch((err)=>{console.log(err)})
}

</script>


<template>
<div>
    <GoBackButton></GoBackButton>
    <div v-if="tagExists">
    <section class="tag-view" v-if="!beingEdited">
        <p class="tag-name">Name: {{tag.name}}</p>
        <p class="tag-desc">Desc: {{tag.description}}</p>
        <button class="submit-button hover" v-if="!beingEdited" @click="openEdit">EDIT TAG</button>
        <p class="posts" v-if="posts"> Posts:</p>
        <!-- <p v-if="posts.length">paginated posts should be showing...</p> -->
        <PostsPaginated v-if="posts.length" :type="'small'" :posts="posts" :pages="pages"></PostsPaginated>
        <p v-if="success" class="success">{{success}}</p>
        <p v-if="error" class="error">{{error}}</p>
    </section>
    <section class="tag-view" v-if="beingEdited">
        <label for="name" class="tag-name">Name:</label>
        <input type="text" id="name" class="tag-name" v-model="newName">
        <label for="desc" class="tag-name">Desc:</label>
        <textarea class="tag-desc-input" v-model="newDesc"></textarea>
        <button class="submit-button hover" v-if="beingEdited" @click="submitEdit(user_id)">CONFIRM</button>
        <button class="submit-button hover" @click="deleteTag">DELETE</button>
    </section>
    </div>
</div>
</template>

<style scoped>
.tag-view{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
.tag-name, .tag-desc, .tag-post{
    font-size: 2rem;
}
.tag-desc-input{
    font-size: 2rem;
    width: 24rem;
    height: 8rem;
}
.posts{
    font-size: 1.5rem;
    border-top: 2px dashed rgba(0,0,0,0.5);
}

.submit-button{
    width: 12rem;
    height: 3rem;
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
.success, .error{
    font-size: 2rem;
    font-weight: 500;
    color: green;
}
.error{
    color: red;
}
</style>