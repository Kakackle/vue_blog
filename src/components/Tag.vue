<script setup>
const props = defineProps(['tag']);
</script>

<template>
<p class="tag">{{ props.tag }}</p>
</template>

<style scoped>
.tag{
    background-color: var(--dark-gray);
    color: var(--almost-white);
    font-size: 1.2rem;
    padding: 0 1rem;
    border-radius: 25px;
}
</style>