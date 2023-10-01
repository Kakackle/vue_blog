<!--
    User view reached by supplying [user_slug] in params
    allows for viewing and editing/patching
 -->

<script setup>
import { useRouter, useRoute, routerKey, onBeforeRouteUpdate } from 'vue-router';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import PostsPaginated from '../components/PostsPaginated.vue';
import GoBackButton from '../components/GoBackButton.vue';
import Tag from '../components/Tag.vue';

import axios from 'axios';
import { useToast } from "vue-toastification";


/* -------------------------------------------------------------------------- */
/*                                    setup                                   */
/* -------------------------------------------------------------------------- */

//odbieranie jaki uzytkownik ma byc wyswietlany z route w postaci str ze slugiem
const route = useRoute();
const router = useRouter();
const user_slug = ref(route.params.user_slug);
const query_string = ref(`posts/?author=${user_slug.value}`);

//for pagination
const PAGE_SIZES = [5, 10, 15];

//zwracanie informacji
const toast = useToast();
const success = ref('');
const error = ref('');

// uzytkownik zalogowany
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);

// uzytkownik odbierany z API
const user = ref();
const userExists = ref(0);
const errorMsg = ref();

const getUser = function(slug){
    axios.get(`users/${slug}`)
    .then((res)=>{
        user.value = res.data;
        userExists.value = 1;
    })
    .catch((error)=>{
        userExists.value = 0;
        errorMsg.value = error;
        router.push({name: 'catchall', params:{wrong_param: user_slug.value}});
    })
}

getUser(user_slug.value);

/* -------------------------------------------------------------------------- */
/*                                   editing                                  */
/* -------------------------------------------------------------------------- */

// editing input variables
const newName = ref('');
const newUsername = ref('');
const newMail = ref('');
const newBio = ref('');
const newAvatar = ref();

const beingEdited = ref(0);
const openEdit = () =>{
    newName.value = user.value.name;
    newUsername.value = user.value.username;
    newMail.value = user.value.mail;
    newBio.value = user.value.bio;
    beingEdited.value = 1;
}

const previewImage = ref();

const uploadNewImage = function(e){
    newAvatar.value = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(newAvatar.value);
    reader.onload = e =>{
                    previewImage.value = e.target.result;
                };
}

const submitEdit = async function(slug){
    let newPost = {
        name: newName.value,
        username: newUsername.value,
        mail: newMail.value,
        bio: newBio.value
    }
    if(newAvatar.value){
        newPost.avatar = newAvatar.value
    }
    axios.patch(`users/${slug}`, newPost,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((res)=>{
        success.value += 'updated user: ' + res.status + ' ' + res.statusText;
        toast.success(success.value);
    })
    .catch((err)=>{
        error.value += 'failed to update user: ' + err;
        toast.error(error.value);
    })
    .finally(()=>{
        newName.value = '';
        newUsername.value = '';
        newMail.value = '';
        newBio.value = '';
        newAvatar.value = undefined;
        getUser(user_slug.value);
        beingEdited.value = 0;
    })
}

/* -------------------------------------------------------------------------- */
/*                                  usuwanie                                  */
/* -------------------------------------------------------------------------- */

const deleteUser = async function(){
    axios.delete(`users/${user_slug.value}`)
    .then((res)=>{
        success.value += res.status + ' ' + res.statusText;
        toast.success('user deleted');
    })
    .catch((err)=>{
        error.value += err.status + ' ' + res.statusText;
        toast.error('failed to delete user');
    })
}


/* -------------------------------------------------------------------------- */
/*                            obsluga followowania                            */
/* -------------------------------------------------------------------------- */

// nazwy uzytkownikow followowanych
const followed_users = ref()
// pelne dane uzytkownikow
const followed_users_full = ref([]);

// funkcja odbierajaca nazwy a nastepnie pelne dane
const getFollowedUsers = function(){
    axios.get(`users/${user_slug.value}/followed`)
    .then((res)=>{
        followed_users.value = res.data.followed;
        console.log(`value: ${JSON.stringify(followed_users.value)}`)
    })
    .then((res)=>{
        followed_users.value.forEach((user)=>{
            axios.get(`users/${user}`)
            .then((res)=>{
                followed_users_full.value.push(res.data);
            })
        })
    })
    .catch((err)=>{
        console.log(err);
    })
}

getFollowedUsers();

// dodawanie i usuwanie - przesylaja w body zalogowanego uzytkownika
// do endpointu zwiazanego z wyswietlanym uzytkownikiem

// dodatkowo wywoluje pobranie na nowo uzytkownikow sledzonych -
// gdyz zmienia sie to na backendzie

const addToFollowers = function(){
    axios.post(`users/${user_slug.value}/follow`, {
        'new_follower': loggedUser.value.slug
    })
    .then((res)=>{
        console.log(res.data);
        toast.success(`added ${user_slug.value} to follows`);
        getLoggedFollows();
    })
    .catch((err)=>{
        console.log(err);
        toast.success(`failed to add ${user_slug.value} to follows`);
    })
}

const removeFromFollowers = function(){
    axios.post(`users/${user_slug.value}/unfollow`, {
        'follower': loggedUser.value.slug
    })
    .then((res)=>{
        console.log(res.data);
        toast.success(`removed ${user_slug.value} from follows`);
        getLoggedFollows();  
    })
    .catch((err)=>{
        console.log(err);
        toast.success(`failed to remove ${user_slug.value} from follows`);
    })
}


/* -------------------------------------------------------------------------- */
/*                   uzytkownicy sledzeni przez zalogowanego                  */
/* -------------------------------------------------------------------------- */

// list uzytkownikow followowanych
const loggedUserFollows = ref([]);

// czy uzytkownik wyswietlany nalezy do followowanych zalogowanego
const is_followed = ref(false);

const set_is_followed = function(){
    if(loggedUserFollows.value.includes(user_slug.value)){
        is_followed.value = true;
        console.log(`arr: ${loggedUserFollows.value}, is: ${is_followed.value}`);
    }
    else{
        is_followed.value = false;
    }
}

const getLoggedFollows = function(){
    axios.get(`users/${loggedUser.value.slug}/followed`)
    .then((res)=>{
        loggedUserFollows.value = res.data.followed;
        console.log(`loggedvalue: ${JSON.stringify(loggedUserFollows.value)}`)
    })
    .then(()=>{
        set_is_followed();
    })
    .catch((err)=>{
        console.log(err);
    })
}

/* -------------------------------------------------------------------------- */
/*                                obserwatorzy                                */
/* -------------------------------------------------------------------------- */

// jesli zmieni sie uzytkownik w route - pobierz dane nowego uzytkownika
watch(route, ()=>{
    user_slug.value = route.params.user_slug;
    query_string.value = `posts/?author=${user_slug.value}`;
    if(user_slug.value){
        getUser(user_slug.value);
    }
})

// jesli zmieni sie zalogowany uzytkownik - nowa lista followowanych
watch(loggedUser, ()=>{
    if(loggedUser.value){
        getLoggedFollows();
    }
})

</script>

<template>
    <main :key="user_slug">
        <GoBackButton></GoBackButton>
        <section class="main" v-if="userExists">
            <!-- basic view -->
            <div class="user-info" v-if="!beingEdited">
                <div class="user-left">
                    <img :src=user.avatar class="av-img">
                    <div v-if="loggedUser" :key="is_followed">
                        <button class="submit-button follow-button hover" 
                        @click="addToFollowers"
                        v-if="!is_followed && loggedUser.slug !== user_slug"
                        >FOLLOW USER</button>
                        <button class="submit-button follow-button hover" 
                        @click="removeFromFollowers" v-if="is_followed" >UNFOLLOW USER</button>
                    </div>
                </div>
                <div class="user-right">
                    <p class="name">{{ user.name }}</p>
                    <p class="username">{{ user.username }}</p>
                    <p class="mail">{{ user.mail }}</p>
                    <p class="role">User role</p>
                    <p class="bio">{{ user.bio }}</p>
                    <div class="user-stats">
                        <p>{{ user.post_count }} posts </p>
                        <p>{{ user.post_likes_received }} likes on posts </p>
                        <p>{{ user.comment_count }} comments </p>
                        <p>{{ user.comment_likes_received }} likes on comments</p>

                    </div>
                </div>
            </div>
            <!-- turn display into inputs for editing -->
            <div v-if="beingEdited" class="user-right user-editing">
                <div class="label-div">
                    <label for="av-img">profile pic.:</label>
                    <img :src="previewImage" class="av-img" id="av-img" v-if="previewImage">
                    <img :src=user.avatar class="av-img" id="av-img" v-else>
                </div>
                <div class="label-div">
                    <label for="av-input">Upload a new image</label>
                    <input type="file" id="av-input" class="hover" accept="image/jpeg, image/jpg,
                        image/png, image/gif" @change="uploadNewImage">
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
            <subsection class="followed">
                <p class="title">Users followed by {{ user.name }}: {{user.followed_count}}</p>
                <div class="followed-users" v-if="followed_users_full">
                    <img class="followed-user hover" v-for="(user, user_id) in followed_users_full"
                        :src="user.avatar"
                        @click="router.push({name: 'user', params: {'user_slug': user.slug}})">
                </div>
                <p class="title">Users following {{ user.name }}: {{user.followed_by_count}}</p>
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
    font-size: 2rem;
    color: var(--dark-gray);
}

.user-left{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
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

.user-stats{
    margin-top: 10px;
    display: flex;
    font-size: 1.8rem;
    gap: 10px;
    font-weight: 500;
    width: 20rem;
    flex-wrap: wrap;
}

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

.follow-button{
    font-size: 1.2rem;
    width: 12rem;
    padding: 0 10px;
    border-radius: 25px;

}

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
.user-data, .user-data-list{
    width: 100%;
    padding: 10px;    
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    font-size: 2rem;
}
.user-data{
    border-top: 4px dashed var(--dark-gray);
}

</style>