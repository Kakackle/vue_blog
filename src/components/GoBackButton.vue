<script setup>
import {useRouter} from 'vue-router'
const router = useRouter();
</script>

<template>
<a class="go-back hover" @click="router.back()">&larr; GO BACK</a>
</template>

<style scoped>
.go-back{
  font-size: 1.2rem;
  color: #636e72
}
.hover:hover{
  cursor: pointer;
  filter: brightness(0.5);
}
</style>