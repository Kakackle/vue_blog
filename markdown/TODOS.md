# Nowe funkcjonalnosci
3. TODO: komponent side dla homeview z jakims najpop autorem itd - do tego autorzy musieliby miec count postow etc, najpewniej w django
7. ta karuzela jakos ruchoma? albo "stala" ale jakos filtrujaca 3 najnowsze posty albo 3 topowe wyswietlen (po nastepnym punkcie)

9. footer costam
10. TODO: vueprime dropdown dla wiekszej ilosci linkow w navie, moze drop typu "Lists" i tam wszystkie listy itp
# Duze rzeczy
1. custom user / profile i logowanie
    - potem powiazywanie tworzonych postow z aktualnym uzytkownikiem itd
    - komentarze - sposob powiazania w django i odpowiadania i forma na tworzenie
2. Obrazki nie z url ale uploadowane
    - i potem moze moznaby na podstawie uploadu do markdowna wkladac link lokalny tam gdzie uzytnik przestal pisac i zaczal uploadowac obrazek
    albo pozwolic mu zuploadowac kilka i potem dac mu do wklejenia gdzie chce linki
    ogolnie TODO: Django uploading images, jak to przesylac przez rest, jak to serwowac?

# Uzupelnienie funkcjonalnosci


4. ## 09.06.2023
    5. TODO: ~~Usuwanie tagow~~, uzytnikow,

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