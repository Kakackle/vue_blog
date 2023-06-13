<!-- 
    [So far] static banner element


 -->
<script setup>

</script>

<template>
    <div class="banner">
        <div class="banner-items">
            <p>Item 1</p>
            <p>Itemization 2</p>
            <p>It3</p>
            <p>Item 4</p>
        </div>
    </div>
</template>

<style scoped>
.banner{
    background-color: black;
    height: 2rem;
    padding: 0 4rem;
}
.banner-items{
    color: white;
    font-size: 1.5rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;  
}
</style>