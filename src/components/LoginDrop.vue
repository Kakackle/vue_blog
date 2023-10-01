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
        <div class="login-div">
            <span class="login-text">Log into your account</span>
            <div class="input-div">
                <ion-icon name="person-outline" class="login-icon"></ion-icon>
                <input type="text" placeholder="admin" class="login-input"
                v-model="username">
            </div>
            <div class="input-div">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon login-icon" viewBox="0 0 512 512"><path d="M218.1 167.17c0 13 0 25.6 4.1 37.4-43.1 50.6-156.9 184.3-167.5 194.5a20.17 20.17 0 00-6.7 15c0 8.5 5.2 16.7 9.6 21.3 6.6 6.9 34.8 33 40 28 15.4-15 18.5-19 24.8-25.2 9.5-9.3-1-28.3 2.3-36s6.8-9.2 12.5-10.4 15.8 2.9 23.7 3c8.3.1 12.8-3.4 19-9.2 5-4.6 8.6-8.9 8.7-15.6.2-9-12.8-20.9-3.1-30.4s23.7 6.2 34 5 22.8-15.5 24.1-21.6-11.7-21.8-9.7-30.7c.7-3 6.8-10 11.4-11s25 6.9 29.6 5.9c5.6-1.2 12.1-7.1 17.4-10.4 15.5 6.7 29.6 9.4 47.7 9.4 68.5 0 124-53.4 124-119.2S408.5 48 340 48s-121.9 53.37-121.9 119.17zM400 144a32 32 0 11-32-32 32 32 0 0132 32z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/></svg>
                <input type="password" placeholder="adminadmin" class="login-input">
            </div>
            <div class="login-buttons">
                <button class="login-button hover" @click="emitLogin">LOG IN</button>
                <button class="register-button hover" @click="emitRegister">or sign up for a new account;</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-drop{
    position: absolute;
    top: 40px;
    right: -40px;
    background-color: var(--almost-white); 
    padding: 10px 20px;
    border: 1px solid var(--mid-gray);
    width: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-div{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    width: 200px;
}
.login-text{
    font-size: 1rem;
    color: var(--dark-gray);
    align-self: start;
}
.input-div{
    display: flex;
    align-items: center;
    gap: 10px;
}
.login-icon{
    /* font-size: 2rem; */
    width: 20px;
    height: 20px;
    color: var(--dark-gray);
    z-index: 3;
}
.login-input{
    font-size: 1.2rem;
    width: 140px;
    padding: 4px 10px;
    border: 1px solid var(--dark-gray);
    border-radius: 5px;
}
.line-top{
    border-top: 1px solid rgba(255,255,255,0.2);
}
.login-buttons{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 0.5rem;
    width: 100%;
    font-size: 2rem;
}
.login-button{
    background-color: var(--dark-gray);
    color: var(--almost-white);
    width: 90%;
    align-self: center;
}
.register-button{
    font-size: 1rem;
    align-items: end;
}
.register-button:hover{
    border-bottom: 1px solid var(--dark-gray);
}
</style>