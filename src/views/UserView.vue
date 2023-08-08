<!-- 
    User view reached by supplying [user_slug] in params
    allows for viewing and editing/patching
 -->
<script setup>
import { useRouter, useRoute, routerKey } from 'vue-router';
import { useUserStore } from '../stores/user';
import { ref } from 'vue';
// import PreviewList from '../components/PreviewList.vue'; 
import PostsPaginated from '../components/PostsPaginated.vue';
import GoBackButton from '../components/GoBackButton.vue';
import Tag from '../components/Tag.vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);

const route = useRoute();
const router = useRouter();
const user_slug = route.params.user_slug;
const query_string = `posts/?author=${user_slug}`;

const user = ref();
const userExists = ref(0);
const errorMsg = ref();
// const posts = ref([]);
// const pages = ref([]);

//for pagination
const PAGE_SIZES = [5, 10, 15];

//TODO:[Django] nowy img itd.. - najpierw w Django
const newName = ref('');
const newUsername = ref('');
const newMail = ref('');
const newBio = ref('');

const success = ref('');
const error = ref('');

const beingEdited = ref(0);
const openEdit = () =>{
    newName.value = user.value.name;
    newUsername.value = user.value.username;
    newMail.value = user.value.mail;
    newBio.value = user.value.bio;
    beingEdited.value = 1;
}

const submitEdit = async function(slug){
    const newPost = {
        name: newName.value,
        username: newUsername.value,
        mail: newMail.value,
        bio: newBio.value
    }
    axios.patch(`users/${slug}`, newPost)
    .then((res)=>{
        success.value += res.status + ' ' + res.statusText; 
    })
    .catch((err)=>{
        error.value += err;
    })
    .finally(()=>{
        newName.value = '';
        newUsername.value = '';
        newMail.value = '';
        newBio.value = '';
        getUser(user_slug);
        beingEdited.value = 0;
    })
}

const getUser = function(slug){
    axios.get(`users/${slug}`)
    .then((res)=>{
        user.value = res.data;
        userExists.value = 1;
    })
    // .then(()=>{
    //     getPosts(`posts/?author=${user_slug}`);
    // })
    .catch((error)=>{
        userExists.value = 0;
        errorMsg.value = error;
        router.push({name: 'catchall', params:{wrong_param: user_slug}});
    })
}

const deleteUser = async function(){
    axios.delete(`users/${user_slug}`)
    .then((res)=>{
        success.value += res.status + ' ' + res.statusText; 
    })
    .catch((err)=>{
        error.value += err.status + ' ' + res.statusText;
    })
}

// const getPosts = async function(link){
//     posts.value = [];
//     axios.get(link)
//     .then((res)=>{
//         posts.value = res.data.results;
//         pages.value = res.data.context.page_links;
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// }

getUser(user_slug);

</script>

<template>
    <main>
        <GoBackButton></GoBackButton>
        <section class="main" v-if="userExists">
            <!-- basic view -->
            <div class="user-info" v-if="!beingEdited">
                <img :src=user.avatar class="av-img">
                    <div class="user-right">
                    <p class="name">{{ user.name }}</p>
                    <p class="username">{{ user.username }}</p>
                    <p class="mail">{{ user.mail }}</p>
                    <p class="role">User role</p>
                    <p class="bio">{{ user.bio }}</p>
                </div>
            </div>
            <!-- turn display into inputs for editing -->
            <div v-if="beingEdited" class="user-right user-editing">
                <div class="label-div">
                    <label for="av-img">profile pic.:</label>    
                    <img :src=user.avatar class="av-img" id="av-img">
                </div>
                <div class="label-div">
                    <label for="name">name:</label>
                    <input type="text" id="name" v-model="newName">
                </div>
                <div class="label-div">
                    <label for="username">username:</label>
                    <input type="text" id="username" v-model="newUsername">
                </div>
                <div class="label-div">
                    <label for="mail">mail:</label>
                    <input type="email" id="mail" v-model="newMail">
                </div>
                <div class="label-div">
                    <label for="bio">bio:</label>
                    <textarea id="bio" class="bio-input" v-model="newBio"></textarea>
                </div>
            </div>
            <!-- if logged user matches viewed -->
            <div v-if="user && loggedUser">
                <div class="controls">
                    <div v-if="loggedUser.slug === user.slug" class="controls">
                    <button class="submit-button hover" v-if="!beingEdited" @click="openEdit">EDIT USER</button>
                    <button class="submit-button hover" @click="deleteUser">DELETE USER</button>
                </div>
                    <button class="submit-button hover" v-if="beingEdited" @click="submitEdit(user_slug)">CONFIRM CHANGES</button>
                </div>
            </div>
            
            <p v-if="success" class="success">{{success}}</p>
            <p v-if="error" class="error">{{error}}</p>
            <!-- posty etc -->
            <subsection class="post-sect">
                <p class="title"> {{ user.name }}'s posts:</p>
                <div class="posts">
                    <PostsPaginated :type="'large'" :page_sizes="PAGE_SIZES"
                        :query_string="query_string"></PostsPaginated>
                </div>
            </subsection>
            <subsection class="tags">
                <p class="title">{{ user.name }}'s most popular tags</p>
                <div class="tags-div">
                    <Tag :tag="'programming'"></Tag>
                    <Tag :tag="'games'"></Tag>
                    <Tag :tag="'howto'"></Tag>
                    <Tag :tag="'hobby'"></Tag>
                    <Tag :tag="'diy'"></Tag>
                </div>
            </subsection>
            <!-- TODO:[Django] po funkcjonalnosci followowancyh w django tu udynamicznic -->
            <subsection class="followed">
                <p class="title">Users followed by {{ user.name }}</p>
                <div class="followed-users">
                    <img class="followed-user" src="http://localhost:8000/media/images/avatars/21.jpg">
                    <img class="followed-user" src="http://localhost:8000/media/images/avatars/31.jpg">
                    <img class="followed-user" src="http://localhost:8000/media/images/avatars/32.jpg">
                </div>
            </subsection>
        </section>
    </main>
</template>

<style scoped>
.main{
    background-color: var(--almost-white);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    /* margin-top: 50px; */
    margin: 50px auto;
    max-width: var(--max-page-width);
}

.user-info{
    display: flex;
    gap: 20px;
}

.av-img{
    height: 180px;
    width: 180px;
    border-radius: 50%;
    border: 6px solid var(--mid-gray);
}

.user-right{
    display: flex;
    flex-direction: column;
    /* gap: 5px; */
    font-size: 2rem;
    color: var(--dark-gray);
}

.name{
    font-size: 2.5rem;
    text-decoration: underline;
    text-underline-offset: 4px;
}

.role{
    font-weight: 500;
    color: var(--mid-light);
}

.bio{
    margin-top: 10px;
    width: 40rem;
}

/* .user-info, .user-posts{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-direction: column;
    font-size: 2rem;
} */

/* -------------------------------------------------------------------------- */
/*                               during editing                               */
/* -------------------------------------------------------------------------- */

.user-editing{
    gap: 10px;
    align-items: flex-start;
}

.label-div{
    display: flex;
    align-items: center;
    gap: 1rem;
    text-transform: capitalize;
    /* font-size: 1.5rem; */
}

.label-div label{
    font-size: 1.5rem;
    width: 8rem;
}

.label-div input, textarea{
    border: 2px solid var(--mid-light);
    border-radius: 3px;
    padding: 2px 6px;
}

.bio-input{
    width: 24rem;
    height: 8rem;
}
.controls{
    display: flex;
    gap: 10px;
}
.submit-button{
    width: 12rem;
    height: 6rem;
    font-size: 2rem;
    background-color: var(--dark-gray);
    color: var(--almost-white);
    border-radius: 3px;
}

/* .submit-button:hover{
    text-decoration: underline;
} */

.success, .error{
    font-size: 2rem;
    font-weight: 500;
    color: green;
}
.error{
    color: red;
}


.post-sect{
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title{
    align-self: flex-start;
    font-size: 2rem;
}

.posts{
    max-width: 900px;
}

.tags, .followed{
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 0 10px;
}

.tags-div{
    display: flex;
    gap: 5px;
}
.followed-users{
    display: flex;
    gap: 5px;
}
.followed-user{
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: 4px solid var(--dark-gray);
}

</style>