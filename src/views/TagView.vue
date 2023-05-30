<script setup>
import { useRoute, useRouter} from 'vue-router';
import { onBeforeMount, ref } from 'vue';
const route = useRoute();
const router = useRouter();
const tag_id = route.params.tag_id;
const tagExists = ref(1);
const testTags = [
    {name: "programming", desc:"All things programming, languages etc", posts:["aa","bb","cc"]},
    {name: "games", desc:"Videogames", posts:["dd","ee","ff"]},
    ]
onBeforeMount(() =>{
    if(!testTags[tag_id]){
        tagExists.value = 0;
        router.push({name: 'catchall', params: {tag_id: tag_id}});
    }
})
</script>


<template>
    <section class="tag-view" v-if="tagExists">
        <p class="tag-name">{{testTags[tag_id].name}}</p>
        <p class="tag-desc">{{testTags[tag_id].desc}}</p>
        <p v-for="post in testTags[tag_id].posts" class="tag-post">Post: {{post}}</p>
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