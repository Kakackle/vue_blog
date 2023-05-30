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