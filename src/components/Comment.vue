<script setup>
import {ref} from 'vue';
const props = defineProps(['comment']);
console.log(`props: ${JSON.stringify(props)}`)
const comment = ref(props.comment);
console.log(`comment: ${comment.value}`)
</script>

<template>
<div class="main">
    <p>{{ comment.title }}</p>
    <Comment v-for="(reply, reply_id) in comment.replies" :comment="reply"
    class="reply"></Comment>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    /* position: relative; */
}
.reply{
    /* position: absolute;s */
    /* top: 20px; */
    /* left: 10px; */
    transform: translateX(20px);
}
</style>