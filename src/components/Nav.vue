<!-- 
    Komponent realizujacy funkcję navbara z routerlinkami
    TODO: rozwiaz ten error z awatarem bo wnerwia
-->
<script setup>
import axios from "axios";
import { ref, watch } from "vue";
import LoginDrop from "../components/LoginDrop.vue";
import AccDrop from "../components/AccDrop.vue";
import { useToast } from "vue-toastification";
const toast = useToast();

import { useUserStore } from "../stores/user.js";
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore)

import { useRouter } from "vue-router";
const router = useRouter();

// import Dropdown from "primevue/dropdown";
import Dropdown from "./Dropdown.vue";

const dropdown_list_routes = [
    {
        title: "Users list",
        route: "userlist",
    },
    {
        title: "Tags list",
        route: "tags",
    },
    {
        title: "Posts list",
        route: "postlist",
    },
];
const selected_list = ref();

import { useRouteStore } from "../stores/routeHistory";
import { storeToRefs } from "pinia";
import Breadcrumb from "primevue/breadcrumb";

const routeStore = useRouteStore();
const { routeHistory, breadcrumbList } = storeToRefs(routeStore);
// const breadcrumbList = ref(routeHistory.value)

// const user = ref()
const loggedIn = ref(0);
const logInDrop = ref(0);
const accDrop = ref(0);

// dropdowns
const navDropOpen = ref(0); //is open?

const openNavDrop = function(){
  //flip the value on each click
  navDropOpen.value? navDropOpen.value = 0 : navDropOpen.value=1;
  console.log(`navDropOpen: ${navDropOpen.value}`);
  //if closed, will add border class and open drop
  //if open, will remove border class and close drop
};

// ustawianie zalogowanego uzytkownika
const getUser = function (user_slug) {
    axios
        .get(`users/${user_slug}`)
        .then((res) => {
            // user.value = res.data;
            userStore.setUser(res.data);
        })
        .catch((err) => {
            toast.error("Incorrect username or password!", {
                position: "top-center",
            });
            logout();
            console.log(`get user error: ${err}`);
        });
};

/**
 * Funkcje oblugujace widocznosc dropdownow login/logout/register
 */
const register = () => {
    logInDrop.value = 0;
    router.push("/register");
};
const login = (username) => {
    loggedIn.value = 1;
    logInDrop.value = 0;
    getUser(username);
};
const logout = () => {
    loggedIn.value = 0;
    accDrop.value = 0;
    userStore.setUser(undefined);
    // user.value = undefined;
};
</script>

<template>
    <div class="nav-main">
        <nav class="navbar">
            <div class="nav-left">
                <span class="logo">LOGO</span>
                <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.9403 13.8359L12.9104 20.9129C12.0106 21.3254 12.3131 22.6892 13.3031 22.6892H20.9688C21.0599 22.6892 21.1474 22.7254 21.2118 22.7899C21.2763 22.8544 21.3125 22.9418 21.3125 23.033V30.6969C21.3125 31.6869 22.6875 31.9859 23.0983 31.0887L30.1641 15.0597C30.2432 14.8884 30.2678 14.697 30.2347 14.5113C30.2016 14.3256 30.1123 14.1545 29.9789 14.0211C29.8455 13.8877 29.6744 13.7984 29.4887 13.7653C29.303 13.7322 29.1116 13.7568 28.9403 13.8359Z" fill="#EEEEEE"/>
                <path d="M38.5 22C38.5 12.8906 31.1094 5.5 22 5.5C12.8906 5.5 5.5 12.8906 5.5 22C5.5 31.1094 12.8906 38.5 22 38.5C31.1094 38.5 38.5 31.1094 38.5 22Z" stroke="#F1DD28" stroke-width="2.75" stroke-miterlimit="10"/>
                </svg>
            </div>
            <div class="nav-right">
                <div class="links links-horizontal">
                    <router-link class="hover" to="/">Home</router-link>
                    <RouterLink class="hover" to="/about">About</RouterLink>
                    <!-- <RouterLink class="hover" to="/blog">Blog</RouterLink> -->
                    <RouterLink class="hover" to="/create">New post</RouterLink>
                    <!-- <Dropdown
                        v-model="selected_list"
                        :options="dropdown_list_routes"
                        optionLabel="name"
                        placeholder="LISTS"
                        @change="router.push({ name: selected_list.path })"
                    >
                    </Dropdown> -->
                    <Dropdown :items="dropdown_list_routes" :title="'Lists'"></Dropdown>
                </div>
                
                <div class="nav-drop" :class="{'drop-open': navDropOpen}">
                    <ion-icon class="hover nav-burger" @click="openNavDrop" name="menu-sharp"></ion-icon>
                    <div v-if="navDropOpen" class="drop-links links">
                        <RouterLink class="hover" to="/">Home</RouterLink>
                        <RouterLink class="hover" to="/about">About</RouterLink>
                        <RouterLink class="hover" to="/blog">Blog</RouterLink>
                        <Dropdown
                            v-model="selected_list"
                            :options="dropdown_list_routes"
                            optionLabel="name"
                            placeholder="LISTS"
                            @change="router.push({ name: selected_list.path })"
                        >
                        <!-- <template #optiongroup="slotProps" @click="router.push({name: slotProps.option.path})">
                        <RouterLink class="hover" :to="{name: slotProps.option.path}">{{ slotProps.option.name }}</RouterLink>
                        </template> -->
                        </Dropdown>
                    </div>
                </div>
                
                <div class="nav-acc">
                    <span v-if="loggedIn" class="acc hover" @click="accDrop = !accDrop">
                        <!-- ACC <ion-icon name="heart"></ion-icon> -->
                        <img :src="loggedUser.avatar" class="nav-avatar"
                            :class="{'nav-avatar-open': accDrop}"
                            v-if="loggedUser">
                    </span>
                    <span v-else class="acc hover" @click="logInDrop = !logInDrop"
                        :class="{'nav-avatar-open': logInDrop}">Log in</span>
                </div>
                <LoginDrop
                    v-if="logInDrop"
                    :user="userStore.getUser()"
                    @login="login"
                    @register="register"
                ></LoginDrop>
                <AccDrop v-if="accDrop" :user="userStore.getUser()" @logout="logout"></AccDrop>
            </div>
        </nav>

        <!-- <div class="bread-disappear">
            <div class="bread">
                <Breadcrumb :model="routeHistory" class="bread" />
            </div>
        </div> -->
    </div>
    <p></p>
</template>

<style scoped>
/* *{
  font-size: 62.5% !important;
}
.nav-main{
    font-size: 62.5% !important;
} */
.navbar {
    height: 40px;
    width: 100%;
    background-color: var(--dark-gray);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
    position: fixed;
    top: 0;
    z-index: 5;
    margin-bottom: 4px;
    border-bottom: 4px solid var(--accent-yellow);
}
.nav-left{
    display: flex;
    gap: 10px;
    align-items: center;
}
.logo {
    font-size: 2.5rem;
    font-weight: 600;
    color: whitesmoke;
}
.links {
    list-style-type: none;
    display: flex;
    gap: 4rem;
}
.nav-right {
    display: flex;
    gap: 8rem;
    position: relative;
}

.login-drop,
.acc-drop {
    /* position: absolute;
    top: 3rem;
    right: -4rem;
    background-color: #636e72;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid white;
    gap: 0.5rem; */
    z-index: 2;
}

.login-text {
    font-size: 1.2rem;
    color: white;
}
.login-input {
    font-size: 1.2rem;
}
.line-top {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.login-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 1.5rem;
    gap: 1rem;
}

.links a {
    color: white;
    font-size: 2rem;
    text-decoration: none;
    text-transform: capitalize;
}

.links a.router-link-active {
    color: var(--accent-yellow);
    text-decoration: underline;
    /* text-decoration-line: underline; */
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
}

.hover:hover {
    filter: brightness(0.7);
    cursor: pointer;
}

.active {
    color: var(--accent-yellow);
}

.acc {
    color: whitesmoke;
    font-size: 2rem;
    font-weight: 500;
}
/* #636e72 */
.bread {
    display: flex;
    flex-direction: row-reverse;
    overflow-x: auto;
    /* justify-content: center; */
    /* justify-self: start; */
    /* transform: translate(-50%); */
}
.nav-main {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.bread-disappear {
    width: 100%;
    /* transform: translate(-50%); */
    display: flex;
    justify-content: flex-start;
}

.nav-avatar{
    height: 34px;
    width: 34px;
    border-radius: 50%;
}

.nav-avatar-open{
    padding: 2px;
    border: 2px solid var(--almost-white);
}

.nav-drop{
  display: none;
  position: relative;
  height: 4rem;
  z-index: 2;
}
.nav-burger{
  /* height: 4rem;
  width: 4rem; */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: var(--almost-white);
}

.drop-links{
  position: absolute;
  top: 40px;
  right: 0px;
  width: 100px;
  z-index: 2;
  flex-direction: column;
  gap: 20px;
  background-color: var(--dark-gray);
  padding: 20px 10px;
}

.drop-links > * {
    border-bottom: 2px solid var(--almost-white);
}

.drop-open{
  border-radius: 5px;
  border: 2px solid var(--almost-white);
  /* color: var(--accent-yellow); */
}

@media (max-width: 768px){
  .nav-drop{
    display: flex;
  }
  .links-horizontal{
    display: none;
  }
  .side{

  }
}

</style>
