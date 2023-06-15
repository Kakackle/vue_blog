<script setup>
import {nextTick, ref} from "vue";
const props = defineProps(['user']);
const user = ref(props.user);

const username = ref('');

const emit = defineEmits(['login', 'register']);

const emitLogin = async () =>{
    await nextTick(()=>{
        emit('login', username.value);
    });
    
}

const emitRegister = () =>{
    emit('register');
}
</script>

<template>
    <div class="login-drop">
        <span class="login-text">username:</span>
        <input type="text" placeholder="admin" class="login-input"
            v-model="username">
        <span class="login-text line-top">password:</span>
        <input type="password" placeholder="adminadmin" class="login-input">
        <div class="login-buttons">
            <button class="login-button" @click="emitLogin">LOG IN</button>
            <span class="or">OR</span>
            <button class="login-button" @click="emitRegister">REGISTER &rarr;</button>
        </div>
    </div>
</template>

<style scoped>
.login-drop{
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
    font-size: 1.5rem;
    color: white;
}
.login-input{
    font-size: 1.5rem;
}
.line-top{
    border-top: 1px solid rgba(255,255,255,0.2);
}
.login-buttons{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 2rem;
    gap: 1rem;
}
.or{
    color: white;
}
.hover:hover{
    filter: brightness(0.7);
    cursor: pointer;
}
</style>