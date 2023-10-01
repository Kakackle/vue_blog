<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps(['items', 'title'])
const items = ref(props.items);
const title = ref(props.title)

const isOpen = ref(0);

const choosePath = function(to_route){
    isOpen.value = 0;
    router.push({name: `${to_route}`})
}

</script>

<template>
<main>
    <div class="button hover" :class="{'is-open': isOpen}"
        @click="isOpen? isOpen=0 : isOpen = 1">
        <p>{{ title }}</p>
        <ion-icon class="icon" name="caret-down-outline"></ion-icon>  
    </div>
    <div class="dropdown" v-if="isOpen">
        <ul class="list">
            <li v-for="(item, index) in items" class="item hover"
            @click="choosePath(item.route)">
            <p>{{ item.title}}</p>
            </li>
        </ul>
    </div>
</main>
</template>

<style scoped>
main{
    position: relative;
    height: 100%;
}

.button{
    background-color: var(--dark-gray);
    color: var(--almost-white);
    font-size: 3rem;
    height: 30px;
    padding: 2px 10px;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    width: 100px;
}

.icon{
    visibility: visible;
}

.is-open{
    text-decoration: underline;
    text-decoration-thickness: 2px;
}

.dropdown{
    position: absolute;
    top: 40px;
    background-color: var(--dark-gray);
    min-width: 100px;
    z-index: 2;
    border: 2px solid var(--mid-gray);
}

.list{
    color: var(--almost-white);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.item{
    width: 100%;
    display: flex;
    justify-content: center;
    border-bottom: 2px solid var(--almost-white);
    padding: 5px;
}

.item p{
    font-size: 1.5rem;
}

.item:last-of-type{
    border-bottom: none;
}
</style>