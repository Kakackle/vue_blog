<script setup>
import { usePostsStore } from '../stores/posts';
import { ref } from 'vue';
const postsStore = usePostsStore();


const newTitle = ref("")
const newAuthor = ref(0)
const newDate = ref("22/05/1999")
const newTag = ref("")
const newContent = ref("")
const newImg = ref("")

const submitForm = function(){
    const newPost = {
        id: 4,
        title: newTitle,
        author: newAuthor,
        date: newDate,
        tags: [newTag],
        contents: newContent,
        img: newImg
    }
    postsStore.addPost(newPost);
    console.log(postsStore.posts);
}

</script>

<template>
    <section class="reg">
    <span class="title">CREATE A NEW POST:</span>
    <div class="input-form">
        <div class="form-labels">
            <label for="title">title:</label>
            <label for="author">author:</label>
            <label for="date">date:</label>
            <label for="tag">tag:</label>
            <label for="content">content:</label>
            <label for="img">img:</label>
        </div>
        <div class="form-inputs">
            <input type="text" class="text-input" id="title" v-model="newTitle">
            <input type="text" class="text-input" id="author" v-model="newAuthor">
            <input type="text" class="text-input" id="date" v-model="newDate">
            <input type="text" class="text-input" id="tag" v-model="newTag">
            <input type="text" class="text-input" id="content" v-model="newContent">
            <input type="text" class="text-input" id="img" v-model="newImg">
        </div>
    </div>
    <button class="submit-button hover" @click="submitForm">POST &rarr;</button>
    </section>
</template>

<style scoped>
.reg{
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