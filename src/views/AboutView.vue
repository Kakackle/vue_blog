<script setup>
import GoBackButton from '../components/GoBackButton.vue';
</script>

<template>
  <main class="main">
    <GoBackButton></GoBackButton>
    <p class="title">Something about the site or author idk</p>
  </main>
</template>

<style scoped>
.main{
  display: flex;
  flex-direction: center;
  align-items: center;
}
.title{
  font-size: 2.5rem;
}
</style>