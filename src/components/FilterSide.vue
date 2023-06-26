<!-- 
    Komponent majacy pelnic funkcje umieszczalnego z boku strony dodajacy funkcje filtracji
    postow po query lub wyborze checkboxow
    poki co glownie zajmuje sie wyswietlaniem ich oraz oblusga wpisywania,

    TODO: potem jakos sie zamieni to query na lepszy system filtracji/searchu,
    bo na pewno są, aktualnie jest dosyc kaleki [Django]
 -->

<script setup>
import axios from 'axios';
import { nextTick, onMounted } from 'vue';
import { ref, reactive } from 'vue';

//wszystkie tagi
const tags = ref([]);
//zaznaczone tagi
const checkedTags = ref([]);
//post title query term
const search = ref();
//finalized query string
const query_string = ref('');
//wszyscy userzy
const users = ref([]);
//zaznaczeni userzy
const checkedUsers = ref([]);

/**
 * Funckja odbierajaca wszystkie tagi z API
 * do wyswietlenia checkboxow
 */
const getTags = async function(){
    axios.get('tags/')
    .then((res)=>{
        tags.value = res.data;
    })
    .catch((err)=>{
        console.log(`get tags err: ${err}`);
    })
}

getTags();

const getUsers = async function(){
    axios.get('users/')
    .then((res)=>{
        users.value = res.data;
    })
    .catch((err)=>{
        console.log(`get users err: ${err}`);
    })
}

getUsers();

/**
 * Dokonuje filtracji poprzez wykonanie query do API
 * z wybranymi tagami, query term
 * przeksztalcanymi w query_string dodawany do adresu endpointu
 * @param {*} tags 
 * @param {*} search 
 */
const get_query_string = function(tags, users, search){
    //base
    let query_string ='posts/?';
    //dla kazdego z wybranych z checkboxow tagow
    tags.forEach((tag)=>{
        query_string += `&tag=${tag}`;
    })
    users.forEach((user)=>{
        query_string += `&author=${user}`;
    })
    //jesli query term po tytulach postow
    if(search){
        query_string += `&title=${search}`;
    }
    console.log(`resulting filter query: ${query_string}`);
    return query_string
}

// emity

// const emit = defineEmits(['filterBox', 'filterTerm'])
const emit = defineEmits(['filterQuery'])

const emitQuery = async () =>{
    query_string.value = get_query_string(checkedTags.value, checkedUsers.value, search.value)
    await nextTick(()=>{
        emit('filterQuery', query_string.value);
    });
}

</script>

<template>
    <div class="side-div">
        <p class="boxes-title">FILTER BY SEARCH</p>

        <input type="search" class="search" placeholder="post title"
            v-model="search" @keyup.enter="emitQuery">

        <p class="boxes-title">FILTER BY TAGS:</p>
        <div class="boxes" v-if="tags.length">
            <div v-for="(tag, tag_id) in tags" class="box">    
                <input type="checkbox" :id=tag_id name="tag-box"
                    class="tag-box hover"
                    :value=tag.id v-model="checkedTags"
                    @change="emitQuery">
                <label :for=tag_id>{{ tag.name }}</label>
            </div>         
        </div>
        <p class="boxes-title">FILTER BY DATE:</p>
        <p class="boxes-title">FILTER BY AUTHOR:</p>
        <div class="boxes" v-if="tags.length">
            <div v-for="(user, user_id) in users" class="box">    
                <input type="checkbox" :id=user_id name="user-box"
                    class="tag-box hover"
                    :value=user.slug v-model="checkedUsers"
                    @change="emitQuery">
                <label :for=user_id>{{ user.name }}</label>
            </div>         
        </div>
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
    padding: 2rem;
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