<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Nav from './components/Nav.vue';
</script>

<template>
  <header>
      <Nav></Nav>
  </header>
  <main>
    <!-- <Transition name="slide"> -->
      <RouterView></RouterView>
    <!-- </Transition> -->
  </main>

</template>

<style scoped>
nav{
  display: flex;
  gap: 1rem;
}

/* simple route fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* simple route slide transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s ease-out;
}

.slide-enter-to {
  position: absolute;
  right: 0;
}

.slide-enter-from {
  position: absolute;
  right: -100%;
}

.slide-leave-to {
  position: absolute;
  left: -100%;
}

.slide-leave-from {
  position: absolute;
  left: 0;
}

</style>
