<script setup>
</script>

<template>
<nav class="navbar">
    <span class="logo">LOGO</span>
    <div class="nav-right">
        <div class="links">
            <router-link class="hover" to="/">Home</router-link>
            <RouterLink class="hover" to="/about">About</RouterLink>
            <RouterLink class="hover" to="/blog">Blog</RouterLink>
        </div>   
        <span class="acc hover">ACC</span>   
    </div>
</nav>
</template>

<style scoped>
.navbar{
    height: 4rem;
    width: 100%;
    background-color: #636e72;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
}
.logo{
    font-size: 4rem;
    color: whitesmoke;
}
.links{
    list-style-type: none;
    display: flex;
    gap: 2rem;
}
.nav-right{
    display: flex;
    gap: 8rem;
}

.links a{
    color: white;
    font-size: 2rem;
    text-decoration: none;
    text-transform: capitalize;
}

.links a.router-link-active{
    color: tomato;
}

.hover:hover{
    filter: brightness(0.7);
    cursor: pointer;
}

.active{
    color: tomato;
}

.acc{
    color: whitesmoke;
    font-size: 2rem;
}
/* #636e72 */
</style>