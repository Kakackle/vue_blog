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