<!-- TODO: Footer na wzor figmy -->
<script setup>

</script>

<template>
    <section class="footer-sect">
    <div class="footer-back">
        <div class="footer-cont">
            <div class="contact">
                <p class="footer-title">Contact me</p>
                <div class="contact-info">
                    <div>
                        <ion-icon name="mail-open-outline"></ion-icon>
                        <p>markowskimaciej98@gmail.com</p>
                    </div>
                    <div>
                        <ion-icon name="logo-github"></ion-icon>
                        <p>github.com/kakackle</p>
                    </div>
                    <div>
                        <ion-icon name="git-branch-outline"></ion-icon>
                        <p>linktree.com/kakackle</p>
                    </div>
                </div>
                <div class="socials">
                    <a class="hover"><ion-icon name="logo-github"></ion-icon></a>
                    <a class="hover"><ion-icon name="logo-twitter"></ion-icon></a>
                    <a class="hover"><ion-icon name="logo-facebook"></ion-icon></a>
                    <a class="hover"><ion-icon name="logo-instagram"></ion-icon></a>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <p class="footer-title">Help</p>
                    <div class="col-content">
                        <p>Example 1</p>
                        <p>Exa 2</p>
                        <p>Examp 3</p>
                    </div>
                </div>
                <div class="column">
                    <p class="footer-title">Legal</p>
                    <div class="col-content">
                        <p>Example 1</p>
                        <p>Exa 2</p>
                        <p>Examp 3</p>
                        <p>Exam 4</p>
                    </div>
                </div>
                <div class="column">
                    <p class="footer-title">Sitemap</p>
                    <div class="col-content">
                        <p>Example 1</p>
                        <p>Exa 2</p>
                        <p>Examp 3</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<style scoped>
.footer-sect{
  margin-top: auto;
  width: 100vw;
  /* margin-bottom: var(--section-margin); */
}
.footer-back{
    width: 100%;
    background-color: var(--dark-gray);
}
.footer-cont{
    margin: 0 auto;
    padding: 20px;
    max-width: var(--max-page-width);
    display: flex;
    gap: 100px;
    color: var(--almost-white);
    justify-content: center;
}

.contact{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.footer-title{
    font-size: 2rem;
    font-weight: 500;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
}

.contact-info{
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.contact-info div{
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 2rem;
}

.contact-info div ion-icon{
    font-size: 2rem;
}

.socials{
    display: flex;
    gap: 6px;
    /* height: 50px; */
}

.socials a{
    font-size: 50px;
    height: 50px;
}

.columns{
    display: flex;
    gap: 40px;
}
.column{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.col-content{
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 2rem;
}
</style>