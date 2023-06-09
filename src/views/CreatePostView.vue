<script setup>
import { ref } from 'vue';
import GoBackButton from '../components/GoBackButton.vue';
import axios from 'axios';
import { useRoute } from 'vue-router'
import { getDataFromLink } from '../composables/axiosComposables';
const route = useRoute();

const newTitle = ref("")
const newAuthor = ref()
const newDate = ref("22/05/1999")
const newTags = ref([])
const newTag = ref('')
const newContent = ref("")
const newImg = ref("")

const tags = ref([]);
const users = ref([]);
const tagsExist = ref(0);
const usersExist = ref(0);

const success = ref('');
const error = ref('');

const addToTags = function(){
    newTags.value.push(newTag.value);
}

const getTags = async function(){
    tags.value = (await getDataFromLink(`http://127.0.0.1:8000/api/tags/`)).value;
    tagsExist.value=1;
}

const getUsers = async function(){
    users.value = (await getDataFromLink(`http://127.0.0.1:8000/api/users/`)).value;
    usersExist.value=1;
}

const submitForm = function(){
    success.value = '';
    error.value = '';
    
    const newPost = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        title: newTitle.value,
        tags: [newTags.value],
        content: newContent.value,
        img: newImg.value,
        views: 0,
        author: newAuthor.value.id
    }
    axios.post(`http://127.0.0.1:8000/api/users/${newAuthor.value.id}/post`, 
        newPost
    )
    .then((res)=>{
        // console.log(`res:${res.status}`);
        success.value += res.status + ' ' + res.statusText; 
    })
    .catch((err)=>{
        // console.log(`err: ${err}`);
        error.value += err;
    })
    .finally(()=>{
        newTitle.value = undefined
        newAuthor.value = undefined
        newTags.value = [] // dla tablicy
        // newTags.value = undefined
        newContent.value = undefined
        newImg.value = undefined
        getTags();
        getUsers();
    }
    )
}

getTags();
getUsers();

</script>

<template>
    <section class="reg">
    <GoBackButton></GoBackButton>
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
    <button class="submit-button hover" @click="submitForm">POST &rarr;</button>
    <p v-if="success" class="success">{{success}}</p>
    <p v-if="error" class="error">{{error}}</p>
    <div class="useful">
        <p>USEFUL LINKS:</p>
        <a href="https://unsplash.com/"> IMAGES</a>
        <a href="https://getlorem.com/">LOREM</a>
    </div>
    </section>
</template>

<style scoped>
.reg{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
.form-label select, .form-label textarea{
    height: 6rem;
    width: 20rem;
}
.submit-button{
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
.useful{
    position: absolute;
    display: flex;
    flex-direction: column;
    right: 2rem;
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
</style>