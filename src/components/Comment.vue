<script setup>
import {ref} from 'vue';
const props = defineProps(['comment']);
// console.log(`props: ${JSON.stringify(props)}`)
const comment = ref(props.comment);
// console.log(`comment: ${comment.value}`)
const displayReply = ref(0);
const displayEdit = ref(0);
</script>

<template>
<div class="main">
    <div class="comment-main">
        <div class="top">
            <div class="top-left">
                <p>{{ comment.author }}</p>
                <p>-</p>
                <p>{{ comment.date }}</p>
                <p>-</p>
                <p>likes: {{ comment.likes }}</p>
            </div>
            <div class="top-rigt">
                <button class="like">LIKE</button>
            </div>
        </div>
        <div class="bottom">
            {{ comment.content }}
            <div class="controls">
                <button class="reply" @click="displayReply = 1">reply</button>
                <button class="edit" @click="displayEdit = 1">edit</button>
            </div>
        </div>
    </div>
    <!-- reply form -->
    <div class="reply-form" v-if=displayReply>
        <textarea class="reply-text" placeholder="write your response..."></textarea>
        <button class="close-reply" @click="displayReply = 0">submit</button>
    </div>
    <div class="reply-form" v-if=displayEdit>
        <textarea class="reply-text">{{ comment.content }}</textarea>
        <button class="close-reply" @click="displayEdit = 0">submit</button>
    </div>
    <Comment v-for="(reply, reply_id) in comment.replies" :comment="reply"
    class="reply"></Comment>
</div>
</template>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
    /* position: relative; */
    gap: 0.5rem;
}
.comment-main{
    display:flex;
    flex-direction: column;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.5);
    padding: 1rem;
}
.top{
    display: flex;
    /* gap: 1rem; */
    border-bottom: 1px solid rgba(0,0,0,0.8);
    margin-bottom: 1rem;
    justify-content: space-between;
}
.top-left{
    display: flex;
    gap: 1rem;
}
.reply-form{
    display: flex;
    flex-direction: column;
}
.reply-text{
    width: 100%;
    height: 50px;
}
.close-reply{
    width: 60px;
    align-self: end;
}
.controls{
    display: flex;
    gap: 1.5rem;
}
.reply{
    /* position: absolute;s */
    /* top: 20px; */
    /* left: 10px; */
    transform: translateX(20px);
}
</style>