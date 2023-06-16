<!-- 
    TODO: dodac co jesli wrong param w url do usera i postu
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

//if tag doesn't exist, get some tags to list them
const tags = ref([]);
const getTags = async function(){
    axios.get(`tags/`)
    .then((res)=>{
        tags.value = res.data;
    })
    .catch((err)=>{
        console.log(`tags/: ${err}`);
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
        getTagBySlug(tag_slug);
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
    <!-- jesli poprawny response z API -->
    <div v-if="tagExists">
        <!-- domyslny podglad -->
        <section class="tag-view" v-if="!beingEdited">
            <p class="tag-name">Name: {{tag.name}}</p>
            <p class="tag-desc">Desc: {{tag.description}}</p>
            <button class="submit-button hover" v-if="!beingEdited" @click="openEdit">EDIT TAG</button>
            <p class="posts" v-if="posts"> Posts:</p>
            <PostsPaginated v-if="posts.length" :type="'small'" :posts="posts" :pages="pages"></PostsPaginated>
            <p v-if="success" class="success">{{success}}</p>
            <p v-if="error" class="error">{{error}}</p>
        </section>
        <!-- jesli tag jest edytowany -->
        <section class="tag-view" v-if="beingEdited">
            <label for="name" class="tag-name">Name:</label>
            <input type="text" id="name" class="tag-name" v-model="newName">
            <label for="desc" class="tag-name">Desc:</label>
            <textarea class="tag-desc-input" v-model="newDesc"></textarea>
            <button class="submit-button hover" v-if="beingEdited" @click="submitEdit(user_id)">CONFIRM</button>
            <button class="submit-button hover" @click="deleteTag">DELETE</button>
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