<script setup>
import {ref} from 'vue'
const masks = ref({
    modelValue: 'YYYY-MM-DD',
});

const inputDate = ref('');
const counter = ref(0);
const openDate = ref(0);
</script>

<template>
    <VDatePicker v-model.string="inputDate" :masks="masks" @click="openDate=0"
    v-if="openDate"/>
    <button class="date hover" @click="openDate=1">CHOOSE DATE</button>
    <p class="date">Date: {{ inputDate }}</p>
    <p class="date">Count: {{ counter }} </p>
</template>

<style scoped>
.date{
    font-size: 2rem;
}
.hover:hover{
    cursor: pointer;
    filter:brightness(0.7);
}
</style>