<!-- 
    Component for displaying the dropdown of either login/acc or register
    forms depending on user loggedIn state
    [To be used or deleted]
 -->
<script setup>
import {ref} from "vue";
const props = defineProps(['user']);
const user = ref(props.user);

const emit = defineEmits(['logout']);

const emitLogout = () =>{
    emit('logout');
}
</script>

<template>
    <div class="acc-drop">
        <p>{{ user.name }}</p>
        <p>slug: {{ user.slug }}</p>
        <img :src=user.avatar>
        <button @click="emitLogout">LOG OUT</button>
    </div>
</template>

<style scoped>
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
</style>