# Obrazki dostepne w deployu z Vite i np. Netlify

Kwestia jest taka, ze w przypadku Vite, assety mozesz umieszczac w roznych miejscach - src i public

jesli umiescisz w src, sa to tak jakby zrodlowe, nie wszystkie sa kopiowane podczas budowania typu npm run build

zeby vite rozpoznawalo, ze chcesz je wykorzystac w produkcji jako pliki w plikach .vue musisz je np. importowac import costamImg from ...

zeby nie musiec importowac tylu rzeczy, vite oferuje dodatkowy folder public, w ktorym mozesz umiescic obrazki itp do ktorych sciezek bedziesz sie potem odnosil bez importowania

https://answers.netlify.com/t/vite-vue-3-images-deploy/91703/10
https://vitejs.dev/guide/assets.html#static-asset-handling
