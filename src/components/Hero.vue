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
// const image_url = ref(getImageUrl(image_path));

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
    // image_url.value = getImageUrl(image_path);
    // console.log(`banner_index: ${banner_index}, new image path: ${image_path.value}`);
}
let bannerInterval = setInterval(update_index, 5000);

const changeBanner = function(index){
    banner_index.value = index - 1;
    console.log(`banner_index: ${banner_index.value}`);
    change_path(banner_index.value);
    clearInterval(bannerInterval);
    bannerInterval = setInterval(update_index, 5000);
}

</script>

<template>
    <!-- <main class="hero" :style="{backgroundImage: image_url}"> -->
    <main class="hero">
        <!-- <img :src=image_path class="banner"> -->
        <!-- <img class="banner" :src=image_path> -->

        <!-- <transition name="fade" mode="out-in"> -->
        
        <!-- <div class="banner">
        <img class="banner" v-for="(img_path, index) in image_paths"
            :src=base_image_path+img_path
            v-if="index===banner_index">
        </div> -->

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
/* #a29bfe */
*{
  font-size: 62.5%;
}
.hero{
    width: 100vw;
    /* height: 800px; */
    /* background-size: cover; */
    /* background-repeat: no-repeat; */
    /* -webkit-transition: all .5s ease-in-out;
    -moz-transition: all .5s ease-in-out;
    transition: all .5s ease-in-out; */
    /* margin: 0 auto; */
}
.banner-wrapper{
    /* max-width: 100%; */
    /* max-width: var(--max-page-width); */
    width: clamp(400px, 100%, var(--max-page-width));
    position: relative;
    /* max-height: 600px; */
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