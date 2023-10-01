<script setup>
import {ref, computed} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
const router = useRouter();
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);
const props = defineProps(['comment']);
const comment = ref(props.comment);
const displayReply = ref(0);
const displayEdit = ref(0);

const emit = defineEmits(['refresh']);

// tworzenie nowego komentu
const newContent = ref('');

const addNewComment = async function(){
    if (!loggedUser.value) {
        console.log('log in to add a comment');
        return;
    }
    if (newContent.value.length > 500){
        toast.error("the lenght of the comment can't exceed 500 characters");
        return;
    }
    const newComm = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        content: newContent.value,
        post: comment.value.post,
        author: loggedUser.value.slug,
        parent: comment.value.id
    }
    axios.post('create_comment', newComm)
    .then((res)=>{
        console.log(`Add new comment POST: ${res.status}, ${res.statusText}`);
        newContent.value = '';
        displayReply.value = 0;
        emit('refresh');
    })
    .catch((err)=>{
        console.log(`Add new comment POST Error :${err}`);
    })
}

/* -------------------------------------------------------------------------- */
/*                               obsluga lajkow                               */
/* -------------------------------------------------------------------------- */

const comment_liked = computed(()=>{
    if(loggedUser.value && comment.value)
        return comment.value.liked_by.includes(loggedUser.value.slug);
    else return false;
})

/* -------------------------------------------------------------------------- */
/*          sprawdzanie zgodnosci zalogowanego uzytkownika z autorem          */
/* -------------------------------------------------------------------------- */

const is_author = computed(()=>{
    if(loggedUser.value && comment.value)
        return comment.value.author === loggedUser.value.slug;
    else return false;
})

const openEdit = () =>{
    displayEdit.value = 1;
    newContent.value = comment.value.content;
}

const editComment = async function(){
    if (!loggedUser.value) {
        console.log('log in to add a comment');
        return;
    }
    if(loggedUser.value.slug !== comment.value.author){
        toast.error(`you can't edit other user's posts`);
        return
    }
    const newComm = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        content: newContent.value,
    }
    axios.patch(`comments/${comment.value.id}`, newComm)
    .then((res)=>{
        console.log(`edit comment PATCH: ${res.status}, ${res.statusText}`);
        newContent.value = '';
        displayEdit.value = 0;
        emit('refresh');
    })
    .catch((err)=>{
        console.log(`edit comment error ${err}`);
    })
}

// lajkowanie
import {useToast} from "vue-toastification";
const toast = useToast();
//nowa wartosc jaka ma byc przeslana, troche useless tbh
const new_liked_by = ref();
const success = ref('');
const error = ref('')

// lajkowanie realizowane na backendzie, poprzez tylko wyslanie uzytkownika
// backend decyduje czy dodac lajk czy juz jest i odjac
const updateLikedNew = async function(){
    success.value='';
    error.value='';
    // jesli stan zalogowanego uzytkownika nie jest aktualny
    if(!loggedUser.value.slug){
        loggedUser.value = userStore.getUser();
    }
    // jesli uzytkownik mimo to nie zadawany
    if(!loggedUser.value){
        toast.error(`log in first before trying to like`);
        return
    }
    if(loggedUser.value.slug === comment.value.author){
        toast.error(`you can't like your own comments, silly`);
        return
    }
    axios.patch(`comments/${comment.value.id}/like`, {
        user: loggedUser.value.id
    })
    .then((res)=>{
        console.log(res.data.message);
        success.value = `updated likes, ${res.status}, ${res.statusText}`;
        toast.success(success.value);
        emit('refresh');
    })
    .catch((err)=>{
        console.log(err);
        error.value = `${err.status}, ${err.statusText}`;
        toast.error(error.value);
    })
}  

const deleteComment = async function(){
    if(loggedUser.value.slug !== comment.value.author){
        toast.error(`you can't delete other user's comments`);
        return
    }
    axios.delete(`comments/${comment.value.id}`)
    .then((res)=>{console.log(`delete comment success: ${res}`);
    emit('refresh')})
    .catch((err)=>{console.log(`delete comment error: ${err}`)})
}

</script>

<template>
<div class="main">
    <div class="comment-main">
        <div class="top">
            <div class="top-left">
                <p class="author" @click="router.push({name: 'user', params: {user_slug: comment.author}})"
                >{{ comment.author }}</p>
                <p class="date">{{ comment.date_posted }}</p>
            </div>
            <div class="top-right">
                <div class="likes">
                    <ion-icon class="like-icon hover" name="thumbs-up-sharp"
                    @click="updateLikedNew()"
                    :class="{'comment-liked': comment_liked}"
                    ></ion-icon>
                    <p>{{ comment.likes }}</p>
                </div>
                <ion-icon name="trash-outline" class="like-icon hover"
                    @click="deleteComment"
                    v-if="is_author"></ion-icon>
            </div>
        </div>
        <div class="bottom">
            <p>{{ comment.content }}</p>
            <div class="controls">
                <button class="reply-button hover-underline"
                    @click="displayReply = 1"
                    v-if="!is_author">reply</button>
                <button class="edit hover-underline" @click="openEdit"
                    v-if="is_author">edit</button>
            </div>
        </div>
    </div>
    <!-- reply form -->
    <div class="reply-form" v-if=displayReply>
        <textarea class="reply-text" placeholder="write your response..."
        v-model="newContent"></textarea>
        <div class="reply-bottom">
            <p class="characters">{{ 500 - newContent.length  }} characters left</p>
            <button class="close-reply" @click="addNewComment">submit</button>
        </div>
    </div>
    <!-- edit -->
    <div class="reply-form" v-if=displayEdit>
        <textarea class="reply-text" v-model="newContent">{{ comment.content }}</textarea>
        <button class="close-reply hover" @click="editComment">submit</button>
    </div>
    <Comment @refresh="emit('refresh')" v-for="(reply, reply_id) in comment.replies" :comment="reply"
    class="reply"></Comment>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    flex-shrink: 1;
    gap: 5px;
    width: clamp(400px, 90vw, 1000px);
    flex-wrap: wrap;
}
.comment-main{
    display:flex;
    flex-direction: column;
    border-radius: 3px;
    border: 2px solid var(--mid-gray);
    padding: 1rem;
    flex-shrink: 1;
    width: 100%;
    flex-wrap: wrap;
}
.top{
    display: flex;
    border-bottom: 2px solid var(--dark-gray);
    margin-bottom: 10px;
    justify-content: space-between;
    gap: 50px;
}
.top-left, .top-right{
    display: flex;
    gap: 20px;
    font-size: 2rem;
    color: var(--dark-gray);
    align-items: center;
    padding: 2px;
}
.top-right{
    justify-self: flex-end;
}
.likes{
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 2rem;
}
.author{
    font-weight: 600;
}
.date{
    color: var(--mid-light);
}
.bottom{
    font-size: 2rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
}
.controls{
    display: flex;
    align-self: flex-end;
    gap: 10px;
}

.like-icon{
    color: var(--mid-gray);
    visibility: visible;
}

.comment-liked{
    color: var(--accent-yellow);
    visibility: visible;
}

.reply-form{
    display: flex;
    flex-direction: column;
    transform: translateX(20px);
    border: 2px dashed var(--mid-light);
    color: var(--dark-gray);
    font-size: 1.2rem;
    padding: 5px;
}
.reply-text{
    width: 100%;
    height: 50px;
}
.close-reply{
    background-color: var(--mid-gray);
    font-weight: 600;
    color: var(--almost-white);
    padding: 2px 10px;
    align-self: end;
}
.close-reply:hover{
    filter: brightness(0.5);
}
.reply{
    transform: translateX(20px);
}

.reply-bottom{
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    font-size: 1.5rem;
}
</style>