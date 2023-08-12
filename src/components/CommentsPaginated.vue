<script setup>
import { nextTick, ref } from 'vue';
import Comment from './Comment.vue';
import axios from 'axios';
const props = defineProps(['post']);
const post = props.post;
const post_slug = post.slug;

const comments = ref();
const pages = ref();

const selected_page = ref(0);

const query_string = `comments/?post=${post_slug}`;

const getComments = async function(link){
    axios.get(link)
    .then((res)=>{
        comments.value = res.data.results;
        pages.value = res.data.context.page_links;
        console.log(`get comments success: ${res}`);
    })
    .catch((err)=>{
        console.log(`get comments error: ${err}`);
    })
}

const getCommentsByPage = async function(link, page_id){
    comments.value=[];
    pages.value=[];
    await nextTick();
    getComments(link);
    selected_page.value = page_id;
}

getComments(query_string);

// funkcja do refreshowania wyswietlanego stanu, tzn zarowno tutaj gdy dodawany nowy komentarz
// jak i emitowany na zewnatrz jako event "refresh" by i tam zaktualizowal sie caly
// stan wizualny
const refresh = function(){
    console.log(`refresh got called`);
    comments.value=[];
    pages.value=[];
    getComments(query_string);
}

const newContent = ref('');
const displayReply = ref(0);
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);

const addNewComment = async function(){
    if (!loggedUser.value) {
        console.log('log in to add a comment');
        return;
    }
    const newComm = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        content: newContent.value,
        post: post_slug,
        author: loggedUser.value.slug,
        parent: 'no_parent'
    }
    axios.post('http://127.0.0.1:8000/api/create_comment', newComm)
    .then((res)=>{
        console.log(`add comment POST success: ${res.status}, ${res.statusText}`);
        newContent.value = '';
        displayReply.value = 0;
        refresh();
    })
    .catch((err)=>{
        console.log(`add comment error: ${err}`);
    })
}

</script>

<template>
<div class="comments-main">
    <div class="comments-list" v-if="comments">
        <button class="submit-button hover" @click="displayReply=1">ADD A NEW COMMENT</button>
        <!-- reply form -->
        <div class="reply-form" v-if=displayReply>
            <textarea class="reply-text" placeholder="write your comment..."
            v-model="newContent"></textarea>
            <div class="reply-bottom">
                <p class="characters">{{ 500 - newContent.length  }} characters left</p>
                <button class="close-reply hover" @click="addNewComment">submit</button>
            </div>
        </div>
        <!-- comments -->
        <div class="comment" v-for="(comm, comm_id) in comments" v-if="comments.length">
            <p>{{ comm.date }}</p>
            <Comment :comment="comm" @refresh="refresh"
            v-if="!comm.parent"></Comment>
        </div>
        <!-- <Comment v-for="(comm, comm_id) in comments" :comment="comm"></Comment> -->
        <!-- pages -->
        <div class="pages" v-if="pages">
            <p class="page" v-for="(page, page_id) in pages"
                @click="getCommentsByPage(page[0], page_id)"
                :class="(selected_page === page_id)? 'selected' : 'normal'"
                >{{ page[1] }}</p>
        </div>
    </div>
</div>

</template>

<style scoped>
.comments-main{
    padding: 0px 10px;
    max-width: var(--max-page-width);
    /* margin: 0 auto; */
    /* width: 100%; */
    /* width: 100vw; */
    flex-shrink: 1;
    display: flex;
}
.submit-button{
    font-size: 2rem;
    color: var(--dark-gray);
}
.submit-button:hover{
    text-decoration: underline;
}
.comments-list{
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    flex-shrink: 1;
}
.pages{
    display: flex;
    justify-content: center;
    font-size: 2.5rem;
    gap: 1rem;
}
.page:hover{
    font-weight: 600;
    cursor: pointer;
}
.selected{
    font-weight: 700;
}
.reply-form{
    display: flex;
    flex-direction: column;
    border: 2px solid var(--mid-light);
    border-bottom: 4px solid var(--mid-gray);
    margin-bottom: 10px;
    border-radius: 3px;
}
.reply-text{
    width: 100%;
    height: 50px;
    font-size: 1.2rem;
    padding: 5px;
}
.close-reply{
    width: 60px;
    align-self: end;
    background-color: var(--mid-gray);
    color: var(--almost-white);
    font-weight: 500;
    padding: 2px;
}

.reply-bottom{
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    font-size: 1.5rem;
    padding: 5px;
}
</style>