<!-- 
    renderowanie jest czescia wlasnie komponentu postu i musi sprawdzac
    np. czy author.slug = loggedUser.slug
 -->
<script setup>

import { useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

import Tag from './Tag.vue';

import {useUserStore} from '../stores/user.js';
const userStore = useUserStore();
const loggedUser = ref(userStore.getUser());

import {useToast} from "vue-toastification";
const toast = useToast();

//nowa wartosc jaka ma byc przeslana, troche useless tbh
const new_liked_by = ref();
const success = ref('');
const error = ref('')

const router = useRouter();

const props = defineProps(['post'])
const post = ref(props.post);

const user = ref();
user.value = post.value.author;

const getAuthor = async function(){
    axios.get(`users/${user.value}`)
    .then((res)=>{
        user.value = res.data;
    })
    .catch((err)=>{
        console.log(`get author err: ${err}`);
    })
}

getAuthor();

// FIXME: poki co zrobie tak ze we froncie sprawdzane czy juz polajkowane
// i w zaleznosci od tego wyslij liste z nowym uzytnikiem albo bez jak juz byl
// ale potem lepiej by to robic w django, bo to taka racej backendowa operacja
// a frontent powinien byc glownie od wyswietlania a nie trzymania stanu

// FIXME: potencjalny problem kompozycji - poprzez lajkowanie albo cokolwiek
// aktualizujemy stan postu, ale post pobierany i przesylany jest z zewnatrz
// jako prop - moze rozwiazac to zamieniajac prop na ref i watchujac?
// okej, ale i tak trzeba pobrac od nowa z database z nowa iloscia, lista itd

const emit = defineEmits(['refresh']);

const updateLiked = async function(){
    // aktualne liked_by
    console.log(`old liked_by: ${post.value.liked_by}`);
    success.value='';
    error.value='';
    // jesli zalogowany user jest aktualny, a jesli bylo zalogowanie nie wykryte
    //to upewnij sie
    if(!loggedUser.slug){
        loggedUser.value = userStore.getUser();
    }
    // przypisz nowego uzytkownika do zmiennej new_liked_by
    // FIXME: - wlasciwie useless
    new_liked_by.value = loggedUser.value;
    // jesli nie ma zalogowanego uzytkownika to powroc
    if(!new_liked_by.value){
        toast.error(`log in first before trying to like`);
        return
    }
    // jesli zalogowany uzytkownik NIE JEST w liscie lajkujacych post
    if(post.value.liked_by.filter((slug)=>{ return slug === loggedUser.value.slug}).length === 0){
        console.log(`logged user not in liked_by`);
        // dodaj uzytkownika do lajkujacych
        post.value.liked_by.push(new_liked_by.value.slug);
    }
    // jesli JEST juz na liscie
    else{
        const user_index = post.value.liked_by.indexOf(new_liked_by.value.slug)
        post.value.liked_by.splice(user_index, 1);
        console.log('user in liked_by already');
        if (post.value.liked_by.length === 0){
            post.value.liked_by = [];
        }
        // toast.error('user in liked_by already');
    }
    //po dodaniu albo usunieciu
    console.log(`new liked_by: ${post.value.liked_by},
     type: ${typeof post.value.liked_by},
     len: ${post.value.liked_by.length}`);
    
    // przeslij nowy stan
    axios.patch(`posts/${post.value.slug}`, {
        liked_by: post.value.liked_by,
        likes: post.value.liked_by.length
    },
    {
            headers: {
                "Content-Type": "multipart/form-data",
            },
    })
    .then((res)=>{
        // console.log(`data sent: ${post.liked_by}`)
        success.value = `changed post likes, ${res.status}, ${res.statusText}`;
        toast.success(success.value);
        console.log(success.value);
        new_liked_by.value=undefined;
        emit('refresh');
    })
    .catch((err)=>{
        error.value = `${err.status}, ${err.statusText}`;
        toast.error(error.value);
        console.log(`update like err: ${err}`);
    })
}


// if post liked by logged user

const post_liked = computed(()=>{
    if(loggedUser.value && post.value)
        return post.value.liked_by.includes(loggedUser.value.slug);
    else return false;
})

// const post_liked = ()=>{
//     if(loggedUser.value && user.value)
//     return loggedUser.value.slug === user.value.slug;
//     else return false;
// }


// Try using markdown in preview
import { marked } from "marked";
const compiledMarkdown = computed(() => {
  return DOMPurify.sanitize(marked.parse(post.value.content.slice(0,250), {
    mangle: false,
    headerIds: false,
  }));
});


</script>

<template>
<div class="list-preview unified-shadow">
    <div class="left">
        <img :src=post.img class="img">
    </div>

    <div class="right">
        <div class="top">
            <div class="top-left">
                <p class="title">{{ post.title }}</p>
                <p v-if=post_liked>Post liked</p>
            </div>
            <div class="top-right">
                <!-- <p class="post_id">id: {{ post.id }}</p> -->
                <p class="likes">
                    <ion-icon class="like-icon hover" name="thumbs-up-sharp"
                    @click="updateLiked()"
                    :class="{'post-liked': post_liked}"></ion-icon>
                    <p>{{ post.likes }}</p>
                </p>
                <p class="views"><ion-icon class="like-icon" name="eye">
                    </ion-icon>
                    <p>{{ post.views }}</p>
                </p>
                <p class="date">{{ post.date_posted }}</p>
            </div>
        </div>
        <div class="bottom">
            <div class="tags">
                <Tag v-for="tag in post.tags" class="tag hover"
                @click="router.push({name: 'tag', params: {tag_slug: tag}})"
                :tag="tag"></Tag>
            </div>
            
            <p class="author hover" v-if="user.name"
                @click="router.push({name: 'user', params: {user_slug: user.slug}})"
            >{{ user.name }}</p>
            <div class="content prose" v-html="compiledMarkdown"></div>
            <!-- <p class="content">{{ post.content.slice(0,250) }}...</p> -->
        </div>
    </div>

    <ion-icon class="arr-icon hover" name="arrow-forward-outline"
        @click="router.push({name: 'post', params:{post_slug: post.slug}})"
    ></ion-icon>
    
</div>
</template>

<style scoped>
.list-preview{
    /* width: 900px; */
    width: clamp(500px, 100%, 900px);
    /* height: 10rem; */
    height: 220px;
    padding: 1rem;
    /* box-shadow: 0px 5px 12px rgba(0,0,0,0.15); */
    /* border-radius: 0.5rem; */
    display: flex;
    position: relative;
    border-bottom: 8px solid var(--dark-gray);
    margin-bottom: 20px;
    overflow: hidden;
}

.left{
    display: flex;
    /* align-items: center; */
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
}

.img{
    height: 120px;
    width: 180px;
}

.right{
    padding: 0 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    /* padding-bottom: 20px; */
    overflow: hidden;
}

.right:after {
  content: '';
  position: absolute;
  left: 0px;
  right: 0px;
  height: 20%;
  bottom: 0px;
  background: linear-gradient(180deg, rgba(139,167,32,0) 0%, rgba(255,255,255,1) 100%);
  pointer-events: none;
}

.top{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.top-right{
    display: flex;
    align-items: center;
    gap: 10px;
}

.post_id, .date{
    font-size: 1.5rem;
    color:var(--mid-gray);
}
.likes, .views{
    color:var(--dark-gray);
    display: flex;
    align-items: top;
    font-size: 2rem;
    gap: 5px;
}
.like-icon{
    font-size: 1.5rem;
    color: var(--dark-gray);
    /* right: 3rem; */
}

.post-liked{
    color: var(--accent-yellow);
}

.arr-icon{
    position: absolute;
    font-size: 1.5rem;
    bottom: 1rem;
    right: 1rem;
}

.title{
    font-size: 2.4rem;
    border-bottom: 2px solid black;
    /* width: 100%; */
}
.author{
    font-size: 1.5rem;
}
.tags{
    display: flex;
    color: #636e72cc;
    font-size: 1.2rem;
    gap: 1rem;
}

.content{
    font-size: 1.2rem;
}

</style>