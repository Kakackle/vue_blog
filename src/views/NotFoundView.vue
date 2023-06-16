<!-- 
    CATCHALL view, ale
    chuja, nie da rady tak chyba przekazywac, bo trafia tu tylko jesli
    url byl zly kompletnie
    kiedy matchuje poczatek np /posts i probujemy zredirectowac
    to juz nie dziala, nie da sie przekazac nie istniejacych paramow
    odrzuca je jako invalid
 -->
<script setup>
import { useRoute } from 'vue-router';
import GoBackButton from '../components/GoBackButton.vue';
const route = useRoute();
</script>

<template>
    <div class="main">
        <GoBackButton class="big-button"></GoBackButton>
        <p class="title">404 Page Not Found</p>
        <p class="msg">perhaps you entered in a wrong id or url</p>
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
.big-button{
    font-size: 4rem;
}
</style>