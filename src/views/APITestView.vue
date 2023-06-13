<!-- 
    View for testing purposes, currently slightly outdated?
    TODO: To be deleted? doesn't ntroduce anything new
 -->
<script setup>
import axios from 'axios'
import {ref} from 'vue'
import GoBackButton from '../components/GoBackButton.vue';

const results = ref([])
const gotData = ref(0);

const getResults = function(){
    gotData.value = 0;
    axios.get("posts/")
    .then(response => {
        results.value = response.data.results
        gotData.value = 1;
    })
    .catch(err=>{
        console.log(err);
        gotData.value = 0;
    })
}

</script>

<template>
    <div class="main">
        <GoBackButton></GoBackButton>
        <p class="title">API TEST VIEW</p>
        <div class="results">
            <p>Currently being tested: Posts</p>
            <p>Data:</p>
            <ul v-if="gotData">
                <li v-for="item in results" class="results-list">
                    <p>id: {{ item.id }}</p>
                    <p>tags: {{ item.tags }}</p>
                    <p>comments: {{ item.comments }}</p>
                    <p>title {{ item.title }}</p>
                    <p>date_posted: {{ item.date_posted }}</p>
                    <p>date_updated: {{ item.date_updated }}</p>
                    <!-- <p>content.slice(0,50): {{ item.content.slice(0,5) }}</p> -->
                    <p>content: {{ item.content }}</p>
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