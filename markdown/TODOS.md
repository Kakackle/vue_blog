# Nowe funkcjonalnosci
5. TODO: [Vue] pozbyc sie troche console.logow itd

8. [Django] jakos zamienic to query na lepszy system filtracji/searchu,
   bo na pewno są, aktualnie jest dosyc kaleki

9. [Vue] TODO: Animacje oraz kiedy klikasz na np. posts paginated strone - scroll do gory strony a nie zostaje w tym samym miejscu
+ a takze w user view gdy zmieniany jest user poprzez klikniecie - ale to bardzo specyficzny warunek wiec.. moze przy KAZDYM wejsciu na podstrone by sie jakos to dalo

12. FIXME: [Vue] albo wylaczyc tostowanie albo jakos zdecydowanie zmniejszyc ich rozmiar bo fajne do debugowania ale dla uzytkownika moga byc przeszadzajace i nie potrzebne - luj, nie wiem 

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
