<script setup>
import axios from 'axios'
import {ref} from 'vue'
const results = ref([])
const getResults = function(){
    axios.get("http://127.0.0.1:8000/api/posts/")
    .then(response => results.value = response.data)
}

</script>

<template>
    <div class="main">
        <p class="title">API TEST VIEW</p>
        <div class="results">
            <p>Currently being tested: Posts</p>
            <p>Data:</p>
            <ul>
                <li v-for="item in results" class="results-list">
                    <p>id: {{ item.id }}</p>
                    <p>tags: {{ item.tags }}</p>
                    <p>comments: {{ item.comments }}</p>
                    <p>title {{ item.title }}</p>
                    <p>date_posted: {{ item.date_posted }}</p>
                    <p>date_updated: {{ item.date_updated }}</p>
                    <p>content.slice(0,50): {{ item.content.slice(0,50) }}</p>
                    <img class="data-img" :src=item.img>
                </li>
            </ul>
            <button class="get-button" @click="getResults">GET RESULTS</button>
        </div>
        
    </div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}
.title{
    font-size: 4rem;
    border-bottom: 2px solid black;
}
.results{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
}
.results-list{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
    border-bottom: 2px dashed rgba(0,0,0,0.2);
}
.data-img{
    height: 10rem;
    aspect-ratio: 2/1;
    
}
</style>