<script setup>
import { useRoute, useRouter} from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import PreviewList from "../components/PreviewList.vue"
import GoBackButton from "../components/GoBackButton.vue"

const route = useRoute();
const router = useRouter();
const tag_slug = route.params.tag_slug;
const tag = ref();
const tagExists = ref(0);
const errorMsg = ref("");

const getTagById = function(){
    axios.get(`tags/${tag_slug}`)
    .then((response) => {
        tag.value = response.data;
        tagExists.value = 1;
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
        router.push({name: 'catchall', params: {tag_slug: tag_slug}});
        
    })
}
const posts = ref([]);
const getPostByHyperlink = async function(link){
    await axios.get(link)
    .then((res)=>{
        posts.value.push(res.data)
    })
}

getTagById();
</script>


<template>
    <div>
        <GoBackButton></GoBackButton>
    
    <section class="tag-view" v-if="tagExists">
        <p class="tag-name">Name: {{tag.name}}</p>
        <p class="tag-desc">Desc: {{tag.description}}</p>
        <p class="posts"> Posts:</p>
        <PreviewList v-for="post in posts.slice(0,3)" class="tag-post hover" :post="post"></PreviewList>
    </section>
</div>
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
.posts{
    font-size: 1.5rem;
    border-top: 2px dashed rgba(0,0,0,0.5);
}
</style>