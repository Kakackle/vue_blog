<!-- 
    Komponent majacy pelnic funkcje umieszczalnego z boku strony dodajacy funkcje filtracji
    postow po query lub wyborze checkboxow
    poki co glownie zajmuje sie wyswietlaniem ich oraz oblusga wpisywania,
    TODO: fajnie gdyby jednak zawieral tez funkcje filtracji i to on decydowal
    jakie zestawy sa renderowane na stronie ktora go zawiera
    pytanie jaki to ma sens, czy moze by trzeba sparowac z uzywanym razem zawsze z tym
    komponentem jakims plikiem mixinow
 -->

<script setup>
import axios from 'axios';
import { nextTick, onMounted } from 'vue';
import { ref, reactive } from 'vue';
import { getCurrentInstance } from 'vue';


const tags = ref([]);

/**
 * Funckja odbierajaca wszystkie tagi z API
 */
const getTags = async function(){
    axios.get('tags/')
    .then((res)=>{
        tags.value = res.data;
    })
    .catch((err)=>{
        console.log(err);
    })
}

getTags();

const checkedTags = ref([]);

const emit = defineEmits(['filterBox', 'filterTerm'])
const emitBoxes = async () =>{
    await nextTick(()=>{
        emit('filterBox', checkedTags.value);
    });
}

const query = ref([]);

const emitQuery = async() => {
    await nextTick(()=>{
        emit('filterTerm', query.value);
    });
}

</script>

<template>
    <div class="side-div">
        <p class="boxes-title">FILTER BY SEARCH</p>

        <input type="search" class="search" placeholder="post title"
            v-model="query" @keyup.enter="emitQuery">

        <p class="boxes-title">FILTER BY TAGS:</p>
        <div class="boxes" v-if="tags.length">
            <div v-for="(tag, tag_id) in tags" class="box">    
                <input type="checkbox" :id=tag_id name="tag-box"
                    class="tag-box hover"
                    :value=tag.id v-model="checkedTags"
                    @change="emitBoxes">
                <label :for=tag_id>{{ tag.name }}</label>
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