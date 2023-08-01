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
        <p>{{ user.name }}</p>
        <p>slug: {{ user.slug }}</p>
        <img class="av-img" :src=user.avatar>
        <button @click="goToProfile">GO TO PROFILE</button>
        <button @click="emitLogout">LOG OUT</button>
    </div>
</template>

<style scoped>
*{
  font-size: 62.5%;
}
.acc-drop{
    position: absolute;
    top: 3rem;
    right: -4rem;
    background-color: #636e72;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid white;
    gap: 0.5rem;

    font-size: 2rem;
    color: white;
}
.acc-drop button{
    font-size: 1rem;
}
.av-img{
    height: 10rem;
    width: 10rem;
}
</style>