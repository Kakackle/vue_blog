<!-- 
    Komponent realizujacy funkcję navbara z routerlinkami
 -->
<script setup>
import axios from 'axios';
import {ref} from 'vue'
import LoginDrop from "../components/LoginDrop.vue"
import AccDrop from "../components/AccDrop.vue"
import {useToast} from "vue-toastification";
const toast = useToast();

import {useRouter} from 'vue-router'
const router = useRouter();

// TODO: pobieranie np. w Nav (bo jest globalny) usera z API wedlug wpisanego
// np w dropie username / slug
// na start moze byc przechowywane w Navie, potem localstorage
// i na podstawie tego wyswietlanie zalogowanego w dropach
// i potem mozna by na podstawie tej informacje wykonywac funkcjonalnosci typu
// automatyczne ustawianie uzytkownika przy filtrowaniu,
// umozliwianie edycji uzytkownika tylko jesli zgadza sie z zalogowanym itd..
// czyli kluczowe operacje dla strony obslugujacej konta, a taka wlasnie strone chcemy
// przy czym zwaz, ze to co robisz w ten sposob nachodzi na to co powinien robic
// twoj backed, czyli obsluga authentication, persmissions itd

// konkretnie:
// TODO: jakos przekazywanie z Nava do komponentow zalogowanego uzytkownika

const user = ref()
const loggedIn = ref(0);
const logInDrop = ref(0);
const accDrop = ref(0);

const getUser = function(user_slug){
    axios.get(`users/${user_slug}`)
    .then((res)=>{
        user.value = res.data;
    })
    .catch((err)=>{

        toast.error('Incorrect username or password!',{
            position: "top-center"
        });
        logout();
        console.log(err);
    })
}

/**
 * Funkcje oblugujace widocznosc dropdownow login/logout/register
 */
const register = ()=>{
    logInDrop.value = 0;
    router.push('/register')
}
const login = (username)=>{
    loggedIn.value = 1;
    logInDrop.value = 0;
    getUser(username);
}
const logout =() =>{
    loggedIn.value = 0;
    accDrop.value = 0;
    user.value = undefined;
}
</script>

<template>
<nav class="navbar">
    <span class="logo">LOGO</span>
    <div class="nav-right">
        <div class="links">
            <router-link class="hover" to="/">Home</router-link>
            <RouterLink class="hover" to="/about">About</RouterLink>
            <RouterLink class="hover" to="/blog">Blog</RouterLink>
        </div>
        <div>   
            <span v-if="loggedIn" class="acc hover" @click="accDrop = !accDrop">ACC <ion-icon name="heart"></ion-icon></span>   
            <span v-else class="acc hover" @click="logInDrop = !logInDrop">Log in</span>
        </div>
        <LoginDrop v-if="logInDrop" :user="user"
            @login="login"
            @register="register"></LoginDrop>
        <!-- <div v-if="logInDrop" class="login-drop">
            <span class="login-text">username:</span>
            <input type="text" placeholder="admin" class="login-input">
            <span class="login-text line-top">password:</span>
            <input type="password" placeholder="adminadmin" class="login-input">
            <div class="login-buttons">
                <button class="login-button" @click="login">LOG IN</button>
                <span class="or">OR</span>
                <button class="login-button" @click="register">REGISTER &rarr;</button>
            </div>
        </div> -->
        <AccDrop v-if="accDrop" :user="user"
            @logout="logout"></AccDrop>
        <!-- <div v-if="accDrop" class="acc-drop">
            <p>{{ user.name }}</p>
            <img :src=user.avatar>
            <button @click="logout">LOG OUT</button>
        </div> -->
    </div>
</nav>
</template>

<style scoped>
.navbar{
    height: 4rem;
    width: 100%;
    background-color: #636e72;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
}
.logo{
    font-size: 4rem;
    color: whitesmoke;
}
.links{
    list-style-type: none;
    display: flex;
    gap: 2rem;
}
.nav-right{
    display: flex;
    gap: 8rem;
    position: relative;
}

.login-drop, .acc-drop{
    position: absolute;
    top: 3rem;
    right: -4rem;
    background-color: #636e72;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid white;
    gap: 0.5rem;
}

.login-text{
    font-size: 1.2rem;
    color: white;
}
.login-input{
    font-size: 1.2rem;
}
.line-top{
    border-top: 1px solid rgba(255,255,255,0.2);
}
.login-buttons{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 1.5rem;
    gap: 1rem;
}

.links a{
    color: white;
    font-size: 2rem;
    text-decoration: none;
    text-transform: capitalize;
}

.links a.router-link-active{
    color: tomato;
}

.hover:hover{
    filter: brightness(0.7);
    cursor: pointer;
}

.active{
    color: tomato;
}

.acc{
    color: whitesmoke;
    font-size: 2rem;
}
/* #636e72 */
</style>