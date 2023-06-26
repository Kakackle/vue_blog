<!-- 
    View tworzenia nowych uzytkownikow
 -->
<script setup>
import { ref } from 'vue';
import {useToast} from "vue-toastification";

const toast = useToast();

const newUser = ref("")
const newName = ref("")
const newPassword = ref("")
const newMail = ref("")
const newBio = ref("")
const newAvatar = ref()
const previewImage = ref()
import GoBackButton from '../components/GoBackButton.vue';
import axios from 'axios';
// import router from '../router';
import { useRouter } from 'vue-router';
const router = useRouter()

// funkcja do odczytania obrazka z inputu
// oraz przekonwertowania go na URL w celu wyswietlenia preview dla uzytkownika
// jaki obrazek zamierza wyslac
const uploadImage = function(e){
    newAvatar.value = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(newAvatar.value);
    reader.onload = e =>{
                    previewImage.value = e.target.result;
                };

}

const submitForm = function(){
    const newUserObj = {
        csrfmiddlewaretoken: 'Y5460zBRZdCSK3n3MOJYVssZBcBtYtgvUoVn0nltSrBGOBvIXAYmESEFuvHijfrZ',
        username: newUser.value,
        name: newName.value,
        password: newPassword.value,
        mail: newMail.value,
        bio: newBio.value,
        avatar: newAvatar.value
    }
    console.log(`data sent: ${JSON.stringify(newUserObj)}`)

    axios.post(`users/`, newUserObj, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((res)=>{
        toast.success(`${res.status} ${res.statusText}`);
        cleanInputs();
        router.push({name: 'home'});
    })
    .catch((err)=>{
        toast.error(`${err}`);
    })

}

const cleanInputs = async function(){
    newUser.value = undefined
    newName.value = undefined
    newPassword.value = undefined
    newMail.value = undefined
    newBio.value = undefined
    newAvatar.value = undefined
    previewImage.value = undefined
}

</script>

<template>
    <section class="create">
        <GoBackButton></GoBackButton>
    <span class="title">REGISTER A NEW USER</span>
    <div class="input-form">
        <div class="form-inputs">
            <div class="label-format">
                <label for="username">username:</label>
                <input type="text" class="text-input" id="username" v-model="newUser">
            </div>
            <div class="label-format">
                <label for="name">name:</label>
                <input type="text" class="text-input" id="name" v-model="newName">
            </div>
            <div class="label-format">
                <label for="password">password:</label>
                <input type="text" class="text-input" id="password" v-model="newPassword">
            </div>
            <div class="label-format">
                <label for="mail">mail:</label>
                <input type="text" class="text-input" id="mail" v-model="newMail">
            </div>
            <div class="label-format">
                <label for="bio">bio:</label>
                <input type="text" class="text-input" id="bio" v-model="newBio">
            </div>
            <div class="label-format">
                <label for="avatar">avatar:</label>
                <input type="file" accept="image/jpeg, image/jpg,
                image/png, image/gif" @change=uploadImage>
                <!-- <input type="text" class="text-input" id="avatar" v-model="newAvatar"> -->
            </div>
            <div class="label-format">
                <p>IMAGE PREVIEW:</p>
                <img :src="previewImage" class="preview-img"/>
            </div>
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
.form-inputs{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 2rem;
    /* height: 1.5rem; */
    padding: 0;
}
.label-format{
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 2rem;
}
.submit-button{
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter: brightness(0.7);
}
</style>