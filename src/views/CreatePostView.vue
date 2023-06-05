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
const newContent = ref("")
const newImg = ref("")

const tags = ref([]);
const users = ref([]);
const tagsExist = ref(0);
const usersExist = ref(0);

const getTags = async function(){
    tags.value = (await getDataFromLink(`http://127.0.0.1:8000/api/tags/`)).value;
    tagsExist.value=1;
}

const getUsers = async function(){
    users.value = (await getDataFromLink(`http://127.0.0.1:8000/api/users/`)).value;
    usersExist.value=1;
}

const submitForm = function(){
    const newPost = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        title: newTitle.value,
        tags: [newTags.value],
        content: newContent.value,
        img: newImg.value,
        views: 0,
        author: newAuthor.value.id
    }
    // console.log(`newAuthor.value.id: ${newAuthor.value.id}`)
    console.log(`object sent: ${JSON.stringify(newPost)}`)
    axios.post(`http://127.0.0.1:8000/api/users/${newAuthor.value.id}/post`, 
        newPost
    )
    .then((res)=>{
        console.log(`res:${res}`);
    })
    .catch((err)=>{
        console.log(`err: ${err}`);
    })
}

getTags();
getUsers();

</script>

<template>
    <section class="reg">
    <GoBackButton></GoBackButton>
    <span class="title">CREATE A NEW POST:</span>
    <div class="input-form" v-if="tagsExist && usersExist">
        <div class="form-labels">
            <label for="title">title:</label>
            <label for="author">author:</label>
            <!-- <label for="date">date:</label> -->
            <label for="tags">tags:</label>
            <label for="content">content:</label>
            <label for="img">img:</label>
        </div>
        <div class="form-inputs">
            <input type="text" class="text-input" id="title" v-model="newTitle">
            <select class="text-input" id="author" v-model="newAuthor">
                <option v-for="user in users" :value=user>{{ user.name }}</option>
            </select>
            <!-- <input type="text" class="text-input" id="date" v-model="newDate"> -->
            <select class="text-input" id="tags" v-model="newTags" multiple>
                <option v-for="tag in tags" :value=tag>{{ tag.name }}</option>
            </select>
            <input type="text" class="text-input" id="content" v-model="newContent">
            <input type="text" class="text-input" id="img" v-model="newImg">
        </div>
    </div>
    <button class="submit-button hover" @click="submitForm">POST &rarr;</button>
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
}
.input-form{
    display: flex;
    gap: 1rem;
}
.title{
    font-size: 2.5rem;
}
.form-labels, .form-inputs{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1rem;
    font-size: 2rem;
    /* height: 1.5rem; */
    padding: 0;
}
.submit-button{
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
</style>