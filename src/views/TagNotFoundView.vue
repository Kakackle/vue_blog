<!-- 
    TODO: Outdated, to be deleted
    mial byc osobny view jesli bylo podane zle id tagu ale moze byc w catchall, w/e
 -->
<script>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
    <div class="main">
        <p class="title">{{ route }}</p>
    </div>
</template>

<style scoped>
.title{
    font-size: 2.5rem;
}
</style>