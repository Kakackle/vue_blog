# Nowe funkcjonalnosci
4. TODO: [Django] zliczanie ilosci postow autora, postow z tagiem etc, to bardziej moze czesc Django, jako dodatkowa startystyka - potem dodac na froncie wyswietlanies
7. TODO: [Django] jakos filtrujaca 3 najnowsze posty albo 3 topowe wyswietlen (po nastepnym punkcie), albo losowe, albo najwiecej lajkow/wyswietlen w ciagu ostatnich 7/30 w/e dni, jakims "algorytmem" (czyli kalkulacja stosunku) - ale to kwestia [ Django ]

8. [Django] jakos zamienic to query na lepszy system filtracji/searchu,
   bo na pewno są, aktualnie jest dosyc kaleki

# Uzupelnienie funkcjonalnosci

5. ## Wazne: pomyslec nad jakimis refactorami i composables, bo duzo jest podobienst miedzy user/tag/post view, listami itd, idk

# Fixes
1. TODO: lepsze composables z srodkowym zwracaniem stanow itd 

# Pomysly

# Koncepty
1. (comments) albo perform_create by moc dodawac na konkretnym url komenty albo cos typu /post/1/comment i tam post leci

2. [**czesciowo zrealizowane**] Moze warto by rozwazyc by bylo lacznie mniej miejsc w ktorych fetchujesz, glownie takie ogolne, top level i one spuszczaja dane nizej, bo ponownie, propy nie sa zle, to jest dobre narzedzie, po cos zostalo stworzone, a zdecydowanie latwiej zarzadzac stanem z jednego albo ogolnie mniejszej ilosci miejsc


5. ## Refactor serializatoeow i requestow 2
Bo aktualnie jest dosc hacky, na sline, na 100% wiele zbytecznych, specyficznych rzeczy

# Wazne linki, itd:
1. https://stackoverflow.com/questions/67685843/allow-related-field-in-post-request-in-drf
