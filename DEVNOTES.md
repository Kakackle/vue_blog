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

2. aaa