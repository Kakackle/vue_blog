<!-- 
 -->
<script setup>
import {marked} from 'marked';
import Markdown from 'vue3-markdown-it';
import {ref, computed} from 'vue';
const text_to_mark = ref('');

const compiledMarkdown = computed(()=>{
    // return marked.parse(text_to_mark.value, {
    // "async": false,
    // "baseUrl": null,
    // "breaks": false,
    // "extensions": null,
    // "gfm": true,
    // "headerIds": false,
    // "headerPrefix": "",
    // "highlight": null,
    // "hooks": null,
    // "langPrefix": "language-",
    // "mangle": false,
    // "pedantic": false,
    // "sanitize": false,
    // "sanitizer": null,
    // "silent": false,
    // "smartypants": false,
    // "tokenizer": null,
    // "walkTokens": null,
    // "xhtml": false
    // })
    return marked.parse(text_to_mark.value, {
        "mangle": false,
        "headerIds": false,
    })
})
</script>

<template>
<div class="main">
    <p class="title">MARKDOWN VIEW</p>
    <div class="split">
        <div class="left">
            <label for="input_text">Input Text:</label>
            <textarea id="input_text" placeholder="markdown content" v-model="text_to_mark"></textarea>
        </div>
        <div class="right" v-html="compiledMarkdown"></div> 
        <!-- <div class="right">
            <Markdown  :source="text_to_mark"></Markdown>
        </div> -->

    </div>
</div>
</template>

<!-- <style scoped> -->
<style lang="css" scoped>
  *, *::before, *::after {
    font-size: unset !important;
    /* font-size: 2rem; */
  }
.main{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.title{
    font-size: 4rem;
}
.split{
    display: grid;
    grid-template-columns: 1fr 1fr;
}
.left, .right{
    font-size: 2rem;
    width: 100%;
    /* width: 50rem;
    height: 100rem; */
    padding: 2.5rem;
}
#input_text{
    width: 50rem;
    height: 50rem;
    /* width: 100%; */
    /* height: 100%; */
}
</style>