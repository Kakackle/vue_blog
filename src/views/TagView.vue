<script setup>
import { useRoute, useRouter} from 'vue-router';
import { onBeforeMount, onMounted, ref } from 'vue';
import axios from 'axios';
import PreviewList from "../components/PreviewList.vue"
const route = useRoute();
const router = useRouter();
const tag_id = route.params.tag_id;
const tag = ref();
const tagExists = ref(1);
const errorMsg = ref("");

const getTagById = function(){
    axios.get(`http://127.0.0.1:8000/api/tags/${tag_id}`)
    .then((response) => {
        tagExists.value = 1;
        tag.value = response.data;
        console.log("Success");
    })
    .then(() => {
        tag.value.posts.forEach(post=>{
            getPostByHyperlink(post);
        })
    })
    .catch((error) =>{
        tagExists.value = 0;
        errorMsg.value = error;
        console.log("Failure");
        tagExists.value = 0;
        router.push({name: 'catchall', params: {tag_id: tag_id}});
        
    })
}
const posts = ref([]);
const getPostByHyperlink = function(link){
    axios.get(link)
    .then((res)=>{
        posts.value.push(res.data)
    })
}
onBeforeMount(() => {
    getTagById();
})
</script>


<template>
    <section class="tag-view" v-if="tagExists">
        <p class="tag-name">Name: {{tag.name}}</p>
        <p class="tag-desc">Desc: {{tag.description}}</p>
        <p> Posts:</p>
        <PreviewList v-for="post in posts.slice(0,3)" class="tag-post hover" :post="post"></PreviewList>
    </section>
</template>

<style scoped>
.tag-view{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
.tag-name, .tag-desc, .tag-post{
    font-size: 2rem;
}
</style>