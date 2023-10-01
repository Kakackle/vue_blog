<script setup>

</script>

<template>
    <div class="form-cont">
        <p class="title">INTERESTED IN READING MORE? SIGN UP FOR THE NEWSLETTER</p>
        <div class="form-div">
            <div class="left">
                <div class="label-div">
                    <label for="name">Your name</label>
                    <input type="text" id="name" placeholder="John Doe">
                </div>
                <div class="label-div">
                    <label for="email">Your email</label>
                    <input type="email" id="email" placeholder="example@gmail.com">
                </div>
                <div class="label-div">
                    <label for="message">Want to send me a message?</label>
                    <textarea id="message" placeholder="Your blog sucks! Write more about...">
                    </textarea>
                </div>
            </div>
            <div class="right">
                <p>I won't spam your mailbox</p>
                <p>(I promise)</p>
            </div>
        </div>
        <div class="submit">
            <button class="button">SIGN UP NOW</button>
            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.3898 9.74809L9.09597 14.7341C8.46205 15.0247 8.67517 15.9856 9.37267 15.9856H14.7735C14.8377 15.9856 14.8993 16.0111 14.9447 16.0566C14.9901 16.102 15.0156 16.1636 15.0156 16.2278V21.6274C15.0156 22.3249 15.9844 22.5356 16.2738 21.9035L21.252 10.6103C21.3077 10.4896 21.3251 10.3548 21.3017 10.2239C21.2784 10.093 21.2155 9.9725 21.1215 9.87852C21.0276 9.78453 20.907 9.72164 20.7762 9.69831C20.6453 9.67499 20.5104 9.69236 20.3898 9.74809Z" fill="#080808"/>
            <path d="M27.125 15.5C27.125 9.08203 21.918 3.875 15.5 3.875C9.08203 3.875 3.875 9.08203 3.875 15.5C3.875 21.918 9.08203 27.125 15.5 27.125C21.918 27.125 27.125 21.918 27.125 15.5Z" stroke="#F1DD28" stroke-width="1.9375" stroke-miterlimit="10"/>
            </svg>
        </div>
    </div>
</template>

<style scoped>
    .form-cont{
        max-width: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
    }
    .title{
        font-size: 3.5rem;
        font-weight: 700;
        color: var(--mid-gray);
        letter-spacing: -1px;
    }
    .form-div{
        display: flex;
        width: 100%;
        padding: 10px;
        gap: 20px;
    }
    .left{
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .label-div{
        display: flex;
        gap: 20px;
        font-size: 2rem;
        align-items: center;
    }
    .label-div label{
        color: var(--mid-gray);
        width: 80px;
    }
    .label-div input, textarea{
        width: 280px;
        border: 1px solid var(--mid-light);
        color: var(--mid-gray);
        border-radius: 3px;
        height: 2rem;
        padding: 2px 6px;
        font-size: 1rem;
    }
    #message{
        height: 6rem;
    }
    .right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 2rem;
        color: var(--mid-gray);
    }
    .submit{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .button{
        background-color: var(--accent-yellow);
        border:none;
        font-size: 2rem;
        color: var(--dark-gray);
        font-weight: 600;
        padding: 2px 20px;
        border-radius: 20px;
    }
    .submit svg{
        height: 40px;
        width: 40px;
    }
</style>