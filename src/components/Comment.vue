<script setup>
import {ref} from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);
const props = defineProps(['comment']);
const comment = ref(props.comment);
const displayReply = ref(0);
const displayEdit = ref(0);

// dodac linki to autora etc
// i chyba tego czescia bedzie obsluga odpowiedzi i edycji i lajkow

const emit = defineEmits(['refresh']);

// tworzenie nowego komentu
const newContent = ref('');

const addNewComment = async function(){
    if (!loggedUser.value) {
        console.log('log in to add a comment');
        return;
    }
    const newComm = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        content: newContent.value,
        post: comment.value.post,
        author: loggedUser.value.slug,
        parent: comment.value.id
    }
    axios.post('http://127.0.0.1:8000/api/create_comment', newComm)
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

// TODO: usuwanie
// TODO: sprawdzenie roznych warunkow typu:
// - uzytkownik nie moze lajkowac swojego komenta
// - uzytkownik moze edytowac tylko wlasne komenty
// - tylko wlasne komenty usuwac
// TODO: wazne? chcialbym na komentach miec max ilosc znakow
// i musialbym o tym dawac znac uzytkownikowi podczas pisania ile mu zostalo jeszcze znakow
//  i jesli sie nie zgadza to nie wysylac requesta
// - cos tam jeszcze

const openEdit = () =>{
    displayEdit.value = 1;
    newContent.value = comment.value.content;
}

const editComment = async function(){
    if (!loggedUser.value) {
        console.log('log in to add a comment');
        return;
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


const updateLiked = async function(){
    success.value='';
    error.value='';
    if(!loggedUser.slug){
        loggedUser.value = userStore.getUser();
    }
    new_liked_by.value = loggedUser.value;
    if(!new_liked_by.value){
        toast.error(`log in first before trying to like`);
        return
    }
    if(comment.value.liked_by.filter((slug)=>{ return slug === loggedUser.value.slug}).length === 0){
        console.log(`logged user not in liked_by`);

        comment.value.liked_by.push(new_liked_by.value.slug);
        
        axios.patch(`comments/${comment.value.id}`, {
            liked_by: comment.value.liked_by,
            likes: comment.value.liked_by.length
        })
        .then((res)=>{
            success.value = `added to likes, ${res.status}, ${res.statusText}`;
            toast.success(success.value);
            new_liked_by.value=undefined;
            emit('refresh');
            
        })
        .catch((err)=>{
            error.value = `${err.status}, ${err.statusText}`;
            toast.error(error.value);
            console.log(`updating comment likes error: ${err}`);
        })
    }
    else{
        console.log('user in liked_by already');
        toast.error('user in liked_by already');
    }
}

const deleteComment = async function(){
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
                <p>{{ comment.author }}</p>
                <p>-</p>
                <p>{{ comment.date_posted }}</p>
                <p>-</p>
                <p>likes: {{ comment.likes }}</p>
                <p>-</p>
                <ion-icon class="like-icon hover" name="thumbs-up-sharp"
                    @click="updateLiked()"
                ></ion-icon>
                <ion-icon name="trash-outline" class="like-icon hover"
                    @click="deleteComment"></ion-icon>
            </div>
            <div class="top-rigt">
                <button class="like">LIKE</button>
            </div>
        </div>
        <div class="bottom">
            {{ comment.content }}
            <div class="controls">
                <button class="reply" @click="displayReply = 1">reply</button>
                <button class="edit" @click="openEdit">edit</button>
            </div>
        </div>
    </div>
    <!-- reply form -->
    <div class="reply-form" v-if=displayReply>
        <textarea class="reply-text" placeholder="write your response..."
        v-model="newContent"></textarea>
        <button class="close-reply" @click="addNewComment">submit</button>
    </div>
    <!-- edit -->
    <div class="reply-form" v-if=displayEdit>
        <textarea class="reply-text" v-model="newContent">{{ comment.content }}</textarea>
        <button class="close-reply" @click="editComment">submit</button>
    </div>
    <Comment v-for="(reply, reply_id) in comment.replies" :comment="reply"
    class="reply"></Comment>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    /* position: relative; */
    gap: 0.5rem;
}
.comment-main{
    display:flex;
    flex-direction: column;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.5);
    padding: 1rem;
}
.top{
    display: flex;
    /* gap: 1rem; */
    border-bottom: 1px solid rgba(0,0,0,0.8);
    margin-bottom: 1rem;
    justify-content: space-between;
}
.top-left{
    display: flex;
    gap: 1rem;
}
.reply-form{
    display: flex;
    flex-direction: column;
}
.reply-text{
    width: 100%;
    height: 50px;
}
.close-reply{
    width: 60px;
    align-self: end;
}
.controls{
    display: flex;
    gap: 1.5rem;
}
.reply{
    /* position: absolute;s */
    /* top: 20px; */
    /* left: 10px; */
    transform: translateX(20px);
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
</style>