<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
    <div class="main">
        <p class="title">404 Page Not Found</p>
        <p class="msg">perhaps you entered in a wrong id</p>
        <p class="msg">supplied route params: {{ route.params }}</p>
    </div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
.title{
    font-size: 4rem;
    border-bottom: 2px solid black;
}
.msg{
    font-size: 2rem;
}
</style>