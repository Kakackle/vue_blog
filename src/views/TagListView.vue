<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/* -------------------------------------------------------------------------- */
/*                               retrieving tags                              */
/* -------------------------------------------------------------------------- */

const tags = ref([]);

const getTags = async function(){
    axios.get('tags/')
    .then((res)=>{
        tags.value = res.data;
    })
    .catch((err)=>
    {
        console.log(`get tags err: ${err}`);
    })
}

getTags();

/* -------------------------------------------------------------------------- */
/*                              adding a new tag                              */
/* -------------------------------------------------------------------------- */

const formOpen = ref(0);
const newName = ref('');
const newDesc = ref('');

const openForm = function(){
    formOpen.value = 1;
}

const submitTag = async function(){
    const newTag = {
        name: newName.value,
        description: newDesc.value
    }
    axios.post(`tags/`, newTag)
    .then((res)=>{
        console.log(`post new tag: ${res}`);
    })
    .catch((err)=>{
        console.log(`post new tag err: ${err}`);
    })
    .finally(()=>{
        newName.value='';
        newDesc.value=''
        formOpen.value = 0;
        getTags();
    })
}

</script>

<template>
<div class="main">
    <p class="title">TAG LIST VIEW:</p>

    <button class="submit-button hover"
    v-if="!formOpen"
    @click="openForm"
    >ADD A NEW TAG</button>
    <section class=tags v-if="formOpen">
        <label for="name" class="tag-name">Name:</label>
        <input type="text" id="name" class="tag-name" v-model="newName">
        <label for="desc" class="tag-name">Desc:</label>
        <textarea class="tag-desc-input" v-model="newDesc"></textarea>
        <button class="submit-button hover" @click="submitTag">SUBMIT</button>
    </section>
    <section class="tags" v-if="tags.length">
        <div class="tag" v-for="tag in tags">
            <p class="name">{{ tag.name }}</p>
            <p class="desc">{{ tag.description }}</p>
            <ion-icon name="arrow-forward-outline" class="icon hover"
            @click="router.push({name: 'tag', params: {tag_slug: tag.name}})"
            ></ion-icon>
        </div>
    </section>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
.title{
    font-size: 4rem;
}
.tags{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.tag{
    font-size: 2rem;
    position: relative;
}
.icon{
    position: absolute;
    right: 1rem;
}

.name{
    font-weight: 500;
    text-decoration: underline;
}

/* ========== add new tag ========== */
.submit-button{
    width: 14rem;
    height: 3rem;
    font-size: 1.5rem;
}
.tag-name{
    font-size:1.5rem;
}
.tag-desc-input{
    width: 24rem;
    height: 8rem;
    font-size: 1.5rem;
}
</style>