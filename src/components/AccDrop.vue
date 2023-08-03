<!-- 
    Component for displaying the dropdown of either login/acc or register
    forms depending on user loggedIn state
    [To be used or deleted]
 -->
<script setup>
import {ref} from "vue";
import { useRouter } from "vue-router";
const props = defineProps(['user']);
const user = ref(props.user);
const router = useRouter();

const emit = defineEmits(['logout']);

const emitLogout = () =>{
    emit('logout');
}

const goToProfile = () =>{
    router.push({name: 'user', params:{user_slug: user.value.slug}});
}

</script>

<template>
    <div class="acc-drop">
        <div class="top">
            <img class="av-img" :src=user.avatar>
            <div class="top-text">
                <p>{{ user.name }}</p>
                <p id="slug">{{ user.slug }}</p>
            </div>
        </div>
        <div class="bottom">
            <button class="gotoprof hover" @click="goToProfile">Go to profile
                <ion-icon class="arr-icon" name="arrow-forward-outline"></ion-icon>
            </button>
            <button class="logout hover" @click="emitLogout">LOG OUT</button>
        </div>
    </div>
</template>

<style scoped>
*{
  font-size: 62.5%;
}
.acc-drop{
    position: absolute;
    top: 40px;
    right: -20px;
    background-color: var(--almost-white);
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid var(--mid-gray);
    gap: 5px;
    /* font-size: 2rem; */
    width: 220px;
}
.av-img{
    height: 80px;
    width: 80px;
    border-radius: 50%;
    border: 2px solid var(--dark-gray)
}
.top{
    display: flex;
    justify-content: center;
    gap: 10px;
}
.top-text{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}
.top-text p{
    font-size: 2rem;
    color: var(--dark-gray);
}
#slug{
    font-size: 1.2rem;
}
.bottom{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    color: var(--dark-gray);
}
.bottom button{
    font-size: 1.8rem;
}
.arr-icon{
    font-size: 1.8rem;
}
.gotoprof{
    display: flex;
    align-items: center;
    gap: 6px;
}
.gotoprof:hover{
    border-bottom: 1px solid var(--dark-gray);
}
.logout{
    background-color: var(--dark-gray);
    padding: 2px 10px;
    color: var(--almost-white)
}
</style>