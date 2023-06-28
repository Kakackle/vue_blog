<!-- 
    Komponent realizujacy funkcję navbara z routerlinkami
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

import { useRouter } from "vue-router";
const router = useRouter();

import Dropdown from "primevue/dropdown";

const dropdown_list_routes = [
    {
        name: "Users list",
        path: "userlist",
    },
    {
        name: "Tags list",
        path: "tags",
    },
    {
        name: "Posts list",
        path: "postlist",
    },
];
const selected_list = ref();

import { useRouteStore } from "../stores/routeHistory";
import { storeToRefs } from "pinia";
import Breadcrumb from "primevue/breadcrumb";

const routeStore = useRouteStore();
const { routeHistory, breadcrumbList } = storeToRefs(routeStore);
// const breadcrumbList = ref(routeHistory.value)

// FIXME: this watch never happens, what the fuck
// watch(routeHistory, ()=>{
//     console.log(routeHistory.value.length);
//     if(routeHistory.value.length < 10)
//         breadcrumbList.value = routeHistory.value;
//     else
//         breadcrumbList.value = routeHistory.value.slice(-10);
//     console.log(`bread: ${breadcrumbList.value}`);
// });

// konkretnie:
// TODO: jakos przekazywanie z Nava do komponentow zalogowanego uzytkownika

// const user = ref()
const loggedIn = ref(0);
const logInDrop = ref(0);
const accDrop = ref(0);

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
            <span class="logo">LOGO</span>
            <div class="nav-right">
                <div class="links">
                    <router-link class="hover" to="/">Home</router-link>
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
                <div>
                    <span v-if="loggedIn" class="acc hover" @click="accDrop = !accDrop"
                        >ACC <ion-icon name="heart"></ion-icon
                    ></span>
                    <span v-else class="acc hover" @click="logInDrop = !logInDrop">Log in</span>
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

        <div class="bread-disappear">
            <div class="bread">
                <Breadcrumb :model="routeHistory" class="bread" />
            </div>
        </div>
    </div>
    <p></p>
</template>

<style scoped>
.navbar {
    height: 4rem;
    width: 100%;
    background-color: #636e72;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
}
.logo {
    font-size: 4rem;
    color: whitesmoke;
}
.links {
    list-style-type: none;
    display: flex;
    gap: 2rem;
}
.nav-right {
    display: flex;
    gap: 8rem;
    position: relative;
}

.login-drop,
.acc-drop {
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
    color: tomato;
}

.hover:hover {
    filter: brightness(0.7);
    cursor: pointer;
}

.active {
    color: tomato;
}

.acc {
    color: whitesmoke;
    font-size: 2rem;
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
</style>
