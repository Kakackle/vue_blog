<script setup>
import {ref} from 'vue';
import { getImageUrl } from '../composables/getImageUrl';
const banner_index = ref(0);

const base_image_path = "/assets/images/";
const image_paths = [
    'banner1.png',
    'banner2.png',
    'banner3.png'
];
const num_of_images = image_paths.length;
const image_path = ref(base_image_path + image_paths[0]);
const image_url = ref(`url(${image_path.value})`);

//funkcja aktualizujaca licznik liczbowo
const update_index = function(){
    banner_index.value += 1;
    banner_index.value %= num_of_images;
    change_path(banner_index.value);
}

//funkcja wyswietlajaca banner na bazie licznika
const change_path = function(index) {
    image_path.value = base_image_path + image_paths[index];
    image_url.value = `url(${image_path.value})`;
}
let bannerInterval = setInterval(update_index, 5000);

const changeBanner = function(index){
    banner_index.value = index - 1;
    change_path(banner_index.value);
    clearInterval(bannerInterval);
    bannerInterval = setInterval(update_index, 5000);
}

</script>

<template>
    <main class="hero">
        <transition name="fade" mode="out-in">
            <div class="banner-wrapper" :key=banner_index>
                <img class="banner" :src=image_path>
                <div class="dots">
                    <p v-for="index in num_of_images" @click="changeBanner(index)"
                    class="dot unified-shadow hover"
                    :class="{active: index-1 === banner_index}"></p>
                </div>
            </div>
        </transition>
    </main>
</template>

<style scoped>
*{
  font-size: 62.5%;
}
.hero{
    width: 100vw;
}
.banner-wrapper{
    width: clamp(400px, 100%, var(--max-page-width));
    position: relative;
    margin: 0 auto;
}

.dots{
    position: absolute;
    right: 40px;
    bottom: 10px;
    display: flex;
    gap: 10px;
}

.dot{
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: var(--almost-white-opacity)
}
.active{
    background-color: var(--accent-yellow);
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