TODO: [TUTAJ] Moze wgl dev notatnik, jakie wystapily problemy, jak zostaly rozwiazane itd.. teoretycznie kod powinien byc takim notatkiem ale jest jak jest czasami, szczegolnie po czasie

# Porzucone elementy
1. JSDOC

    problemem jest, ze podstawowa implementacja JSDOC nie jest w stanie dzialac z \<script setup\> z Composition API poniewaz komponenty te nie sa natychmiast dostepne, dopiero sa tworzone w trakcie tworzenia strony, dlatego JSDOC nie ma w nie wgladu, a jedyna sensowna biblioteka ktora znalazlem, dzialala z Options API

    Ponadto moglbym wyciagac deklaracje funkcji, zmiennych itp z script setup do samego script, ale z tym tez sa ograniczenia jakies, konieczny refactor calego kodu

    ALE:
    Te ograniczenia dotycza tylko generowania dokumentacji
    Wciaz jednak mozliwe jest stosowanie formatu

    {**
    \* @param 
    }
    itd
    
    do tworzenia tooltipow funkcji

# Problemy rozwiazane

1. Kwestia reakcji na zmiany w store - Pinia ma do tego specjalna metode
tzw StoreToRefs, link:
https://stackoverflow.com/questions/71676111/vue-component-doesnt-update-after-state-changes-in-pinia-store

https://pinia.vuejs.org/core-concepts/


2. Kwestia przesylania przez DRF danych zarowno w postaci JSON i jaki file / multipart

- teoretycznie w views zawarte sa parsery dla obu typow danych (multipart dla obrazkow i form dla json), ale w praktyce przesylajac tylko dane tekstowe/numeryczne, domyslnie konwertuje na JSON i z jakiegos powodu odrzuca w drf

ale poki co nie mialem absolutnie zadnego problemu z dodawaniem headeru:
,
  {
        headers: {
            "Content-Type": "multipart/form-data",
        },
  }

który sprawia, że dane przesyłane są w postaci multipart, i niezaleznie czy to int czy string czy co, to dziala

widzialem ze komus kiedys to manglowalo dane, ale moze nie mial obu parserow albo mi dopiero zacznie, ale poki co

3. jakos przekazywanie z Nava do komponentow zalogowanego uzytkownika - po prostu store

4. Zmiana stylow etc zalezna od wartosci ze store, jak np. zalogowany uzytkownik
 - bardzo prosta sprawa, nawet nie trzeba uzywac watch, wystarczy storetorefs oraz nastepnei render elementu ktory ma sie zmieniac uzaleznic od :key=ta_wartosc.
 - nie potrzeba zadnego v-if, tymczasowego zmieniania na undefined i spowrotem przypisywania
 - takie kombinacje potrzebne sa tylko jesli tym czyms jest tablica, bo ref ma problem z wykrywaniem zmian w tablicach, ale z poprostu wartasciami dziala magicznie

    przykladowe wykorzystanie: zmiana koloru przycisku polubienia postu w zaleznosci czy jest polubiony czy nie, co zalezy wlasnie od wartosci ze store typu zalogowany uzytkownik

5. tailwind prose i markdown i osiaganie pelnej szerokosci
przykladowo createpostview: post-content po prostu nie chcialo zajmowac 100%, przyjmuje jakis limit i ma to w dupie

ale min-width juz sie sluchalo wiec nie wiem o co chodzi, ale chyba cos ze min-width ma przewage nad width i max-width, wiec pokonuje jakies wewnetrzne limity niewidoczne

6. Blur na dole containera
rozwiazanie ze stacka z wykorzystaniem elementu :after https://stackoverflow.com/a/61772690

# Problemy porzucone

1. Kwestia przypisywania czegos do elementu wyswietlajacego po keys z refa
W tym wypadku byl to komponent breadcrumb z biblioteki UI PrimeVue,
ktory poslugiwal sie tablica obiektow przesylana w ref

Problem wystapil gdy chcialem kompletnie zmienic strukture tej tablicy, szczegolnie jesli w jej obrebie powtarzaly sie obiekty, totez powtarzaly sie klucze
wiec potem przesuwajac albo nadpisujac rzeczy, klucze sie nie zgadzaly i wszystko sie pierdolilo, bo nie wiedzialo gdzie sie zaczyna itd

```
    // if (routeHistory.value.length < 10) breadcrumbList.value = routeHistory.value;
    // else {
    //     // breadcrumbList.value.length = 0;
    //     // breadcrumbList.value = routeHistory.value.slice(-5);
    //     // console.log(routeHistory.value.slice(-10));
    //     breadcrumbList.value.shift();
    //     breadcrumbList.value.push(newRoute);
    // }
    
    // if (routeHistory.value.length > 10){
    //     routeHistory.value.shift();
    //     routeHistory.value.push(newRoute);
    // }
```

rozwiazanie: nie wiem w tym przypadku konkretnym, w nowym trzeba by tworzyc kompletnie nowy obiekt i go zwracac i powodowac rerender obiektu z kluczami czy cos