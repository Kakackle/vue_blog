<!-- 
    Komponent majacy pelnic funkcje umieszczalnego z boku strony dodajacy funkcje filtracji
    postow po query lub wyborze checkboxow
    poki co glownie zajmuje sie wyswietlaniem ich oraz oblusga wpisywania,
 -->

<script setup>
import axios from 'axios';
import { nextTick, onMounted } from 'vue';
import { ref, reactive } from 'vue';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const {loggedUser} = storeToRefs(userStore);

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

//wybrane specjalne tryby

// tylko polubione posty
const liked_by = ref(false);
// tylko wlasne posty
const own = ref(false);
// followed
const followed = ref();
// commented
const commented = ref();

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
    console.log(`own.value: ${own.value}`);
    if(own.value){
        // console.log(`own logged: ${loggedUser.value.slug}`);
        if(loggedUser.value){
            query_string += `&own=${loggedUser.value.slug}`;
        }
    }
    if(liked_by.value){
        // console.log(`liked logged: ${loggedUser.value.slug}`);
        if(loggedUser.value){
            query_string += `&liked_by=${loggedUser.value.slug}`;
        }
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

const dates = [
    'Today',
    'Last 3 days',
    'Last week',
    'Last month',
    'Last year',
    'Older than a year'
];
//specjalne tryby stale ale dodanie ich funkcjonalnosci
const specials = [
    'Only show posts by followed authors',
    'Only show liked posts',
    'Only show posts you commented on',
    'Only show your own posts'
]

</script>

<template>
    <div class="side-div unified-shadow" :key="loggedUser">
        <p class="boxes-title">FILTER BY SEARCH</p>
        <!-- input search term tytulow -->
        <input type="search" class="search" placeholder="post title"
            v-model="search" @keyup.enter="emitQuery">
        <!-- wybor checkboxow tagow, przekazywanych przez checkedTag -->
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
        <!-- po dacie -->
        <p class="boxes-title">FILTER BY DATE:</p>
        <div class="boxes" v-if="dates.length">
            <div v-for="(date, date_id) in dates" class="box">    
                <input type="checkbox" :id=date_id name="tag-box"
                    class="tag-box hover"
                    :value=date>
                <label :for=date_id>{{ date }}</label>
            </div>         
        </div>
        <!-- po autorze -->
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
        <!-- specjalne -->
        <div class="boxes boxes-special" v-if="specials.length">
            <!-- <div v-for="(spec, spec_id) in specials" class="box">    
                <input type="checkbox" :id=spec_id name="tag-box"
                    class="tag-box hover"
                    :value=spec v-model="checkedSpecial"
                    @change="emitQuery">
                <label :for=spec_id>{{ spec }}</label>
            </div>  -->
            <div class="box">
                <input type="checkbox" id="liked_by" class="tag-box hover"
                    v-model="liked_by"
                    @change="emitQuery">
                <label for="liked_by">Only show posts liked by you</label>
            </div>
            <div class="box">
                <input type="checkbox" id="own" class="tag-box hover"
                    v-model="own"
                    @change="emitQuery">
                <label for="own">Only show your own posts</label>
            </div>
        </div>
    </div>

</template>

<style scoped>
.side-div{
    background-color: var(--almost-white);
    /* box-shadow: 0px 5px 10px rgba(0,0,0,0.15); */
    height: 100%;
    width: 100%;
    flex-direction: column;
    border-radius: 0.5rem;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.search{
    font-size: 1.4rem;
    padding: 2px 4px;
    border: 2px solid var(--mid-gray);
    border-radius: 5px;
    width: 90%;   
}
.boxes{
    width: 90%;
    /* box-shadow: 0px 5px 10px rgba(0,0,0,0.15); */
    /* padding: 1rem; */
    height: 120px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 5px;
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

.boxes-special{
    padding-top: 10px;
    border-top: 6px solid var(--accent-yellow);
}
</style>