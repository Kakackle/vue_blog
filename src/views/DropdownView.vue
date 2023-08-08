<!-- view na testy wlasnego elementu dropdown zamiast jakichs gotowych -->

<script setup>
import Dropdown from '../components/Dropdown.vue';

const title = 'lists';

const items = [
    {
        title: 'Item 1',
        route: 'home'
    },
    {
        title: 'It 2',
        route: 'blog',
    },
    {
        title: 'Itemization 3',
        route: 'dropdown',
    },
    {
        title: 'Item 4',
        route: 'dropdown'
    }
]

</script>

<template>
<main>
    <Dropdown :items="items" :title="title"></Dropdown>
</main>
</template>

<style scoped>
main{
    display: flex;
    height: 40px;
    /* background-color: var(--dark-gray); */
    border: 2px solid var(--dark-gray);
    width: 100vw;
    align-items: center;
    justify-content: center;
}
</style>