<script setup>
import { storeToRefs } from 'pinia';
import { usePostsStore } from '../stores/posts';
import { onMounted } from 'vue';
const postsStore = usePostsStore();
const tags = postsStore.getTags();
// const {posts, getTags} = storeToRefs(postsStore)
onMounted(()=>{
    // const tags = postsStore.getTags()
    // console.log(tags)
}
)
</script>

<template>
    <div class="side-div">
        <p class="boxes-title">FILTER BY SEARCH</p>
        <input type="search" class="search" placeholder="title etc..">
        <p class="boxes-title">FILTER BY TAGS:</p>
        <div class="boxes">
            <div v-for="(tag, tag_id) in tags" class="box">    
                <input type="checkbox" :id=tag_id name="tag-box" class="tag-box hover">
                <label :for=tag_id>{{ tag }}</label>
            </div>         
        </div>
        <p class="boxes-title">FILTER BY DATE:</p>
        <p class="boxes-title">FILTER BY AUTHOR:</p>
        <p class="boxes-title">FILTER BY VIEWS or smth:</p>
    </div>

</template>

<style scoped>
.side-div{
    background-color: white;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.15);
    height: 95%;
    width: 95%;
    flex-direction: column;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.search{
    font-size: 1.5rem;
    width: 15rem;   
}
.boxes{
    width: 90%;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.15);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.box{
    display: flex;
    gap: 0.5rem;
    font-size: 1.5rem;
    align-items: center;
}
.tag-box{
    height: 1.5rem;
    width: 1.5rem;
}
.boxes-title{
    font-size: 1.5rem;
}
.hover:hover{
    cursor: pointer;
}
</style>