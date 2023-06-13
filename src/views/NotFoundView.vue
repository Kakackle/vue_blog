<!-- 
    CATCHALL view, ale
    TODO: cos nie zawsze dziala z przekazywaniem i odbieraniem tutaj parametrow
    z route ktorego szukalismy ale przeszlo tutaj
    TODO: also dodaj wiekszy przycisk go back intuicyjny
    TODO: also troche ten view jest zbyteczny dla wiekszosci przypadkow
    jesli chcialbym poinformowac uzytnika o tym ze dany tag pod podanych slugiem
    nie istnieje czy cos, to moze lepiej gdyby bylo to na stronie tego tagu, usera
    czy cokolwiek, dodatkowo moze sugerujacego liste innych tagow/ w/e do wyboru
 -->
<script setup>
import { useRoute } from 'vue-router';
import GoBackButton from '../components/GoBackButton.vue';
const route = useRoute();
</script>

<template>
    <div class="main">
        <GoBackButton></GoBackButton>
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