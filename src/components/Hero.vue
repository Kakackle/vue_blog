<script setup>
import {ref} from 'vue';
let banner_index = 0;
let num_of_images = 3;
const base_image_path = "/src/assets/images/";
let image_paths = [
    'banner1.png',
    'banner2.png',
    'banner3.png'
];
let image_path = ref(base_image_path + image_paths[0]);
let image_url = ref(`url(${image_path.value})`);

const change_path = function() {
    banner_index += 1;
    banner_index %= num_of_images;
    image_path.value = base_image_path + image_paths[banner_index];
    image_url.value = `url(${image_path.value})`;
    // console.log(`banner_index: ${banner_index}, new image path: ${image_path.value}`);
}
setInterval(change_path, 5000);
</script>

<template>
    <!-- <main class="hero" :style="{backgroundImage: image_url}"> -->
    <main class="hero">
        <!-- <img :src=image_path class="banner"> -->
        <!-- <img class="banner" :src=image_path> -->
        <transition name="fade" mode="out-in">
        <!-- <div class="banner">
        <img class="banner" v-for="(img_path, index) in image_paths"
            :src=base_image_path+img_path
            v-if="index===banner_index">
        </div> -->
        <img class="banner" :src=image_path :key=banner_index>
        </transition>
        
    </main>
</template>

<style scoped>
/* #a29bfe */
*{
  font-size: 62.5%;
}
.hero{
    width: 100vw;
    /* height: 800px; */
    /* background-size: cover; */
    /* background-repeat: no-repeat; */
    -webkit-transition: all .5s ease-in-out;
    -moz-transition: all .5s ease-in-out;
    transition: all .5s ease-in-out;
    /* margin: 0 auto; */
}
.banner{
    /* width: 100%; */
    max-width: 1200px;
    /* max-height: 600px; */
    margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s ease
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}
</style>