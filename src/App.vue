<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Nav from './components/Nav.vue';
</script>

<template>
  <header>
      <Nav></Nav>
  </header>
  <main>
    <RouterView></RouterView>
  </main>

</template>

<style scoped>
nav{
  display: flex;
  gap: 1rem;
}
</style>
