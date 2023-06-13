<!-- 
    View tworzenia nowych uzytkownikow
    TODO: gdzies przechodzenie tutaj, najlepiej od "register" w dropdownie w Nav.vue
 -->
<script setup>
import { ref } from 'vue';
const newUser = ref("")
const newName = ref("")
const newPassword = ref("")
const newMail = ref("")
const newBio = ref("")
const newAvatar = ref("")
import GoBackButton from '../components/GoBackButton.vue';
const submitForm = function(){
//TODO: tak samo jak create post
}

</script>

<template>
    <section class="create">
        <GoBackButton></GoBackButton>
    <span class="title">REGISTER A NEW USER</span>
    <div class="input-form">
        <div class="form-labels">
            <label for="username">username:</label>
            <label for="name">name:</label>
            <label for="password">password:</label>
            <label for="mail">mail:</label>
            <label for="bio">bio:</label>
            <label for="avatar">avatar:</label>
        </div>
        <div class="form-inputs">
            <input type="text" class="text-input" id="username" v-model="newUser">
            <input type="text" class="text-input" id="name" v-model="newName">
            <input type="text" class="text-input" id="password" v-model="newPassword">
            <input type="text" class="text-input" id="mail" v-model="newMail">
            <input type="text" class="text-input" id="bio" v-model="newBio">
            <input type="text" class="text-input" id="avatar" v-model="newAvatar">
        </div>
    </div>
    <button class="submit-button hover" @click="submitForm">REGISTER &rarr;</button>
    </section>
</template>

<style scoped>
.create{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.15);
    /* width: 60%; */
}
.input-form{
    display: flex;
    gap: 1rem;
}
.title{
    font-size: 2.5rem;
}
.form-labels, .form-inputs{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 2rem;
    /* height: 1.5rem; */
    padding: 0;
}
.submit-button{
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
</style>