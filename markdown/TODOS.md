# Nowe funkcjonalnosci
4. TODO: zliczanie ilosci postow autora, postow z tagiem etc, to bardziej moze czesc Django, jako dodatkowa startystyka
7. TODO: ta karuzela jakos ruchoma? albo "stala" ale jakos filtrujaca 3 najnowsze posty albo 3 topowe wyswietlen (po nastepnym punkcie), albo losowe, albo najwiecej lajkow/wyswietlen w ciagu ostatnich 7/30 w/e dni, jakims "algorytmem" (czyli kalkulacja stosunku)
4. [ Django ] TODO: jakies resizowanie obrazkow przy uploadzie i zapisywanie w roznych rozmiarach typu thumbnail
# Duze rzeczy
1. custom user / profile i logowanie
    - potem powiazywanie tworzonych postow z aktualnym uzytkownikiem itd
    - komentarze - sposob powiazania w django i odpowiadania i forma na tworzenie

# Uzupelnienie funkcjonalnosci
1. TODO: Chujowa ta stylizacja listy z Prime, zrobienie wlasnej jest dosyc latwe, serio, dropdown + kwestia by hover dobrze sie nakladal tylko na wskazana opcje - moze nawet jako komponent, tylko wtedy kwestia czy dac jakos slot czy prop na funkcje czy co, zeby uzytkownik mogl jako prop podac teksty ale i czy to ma byc tylko tekst czy link, czy po kliknieciu ma wywolywac jakas funkcje itd


5. ## Wazne: pomyslec nad jakimis refactorami i composables, bo duzo jest podobienst miedzy user/tag/post view, listami itd, idk

# Fixes
1. TODO: lepsze composables z srodkowym zwracaniem stanow itd
2. TODO: Kompletnie zjebane wszedzie sa rozmiary czcionek w stylach przez to ograniczenie markdown ze font-size nie moze byc globalnie 62.5%
ALE: zamiast kombinowac z zamienianiem wszedzie rozmiarow moze mozna dodac to w na view gdzie to ma sens, a ~~wylaczyc~~ NIE WLACZAC tylko na dwoch (czyli tworzenie postu i wyswietlanie) gdzie jest md - NAGLE MD DZIALA MIMO GLOBALNEGO 62.5%, OKEJ, SUPER

3. TODO: obsluga md w list i card preview? bo widac kodowanie md i brzydko to wyglada typu ### i obrazki ... tylko kwestia zeby jesli obrazki to nie wyjebawalo wysokosci na zmieszczenie tylko zeby go usuwalo - to by bylo w sumie nawet spoko gdyby bylo widasc tylko poczatek obrazka a reszta ucina, przy czym jesli ucina to najlepiej z blurem itd itd

4. TODO: W kazdym komponencie zmiana kolorkow na nowe

# Pomysly

# Koncepty
1. (comments) albo perform_create by moc dodawac na konkretnym url komenty albo cos typu /post/1/comment i tam post leci

2. [**czesciowo zrealizowane**] Moze warto by rozwazyc by bylo lacznie mniej miejsc w ktorych fetchujesz, glownie takie ogolne, top level i one spuszczaja dane nizej, bo ponownie, propy nie sa zle, to jest dobre narzedzie, po cos zostalo stworzone, a zdecydowanie latwiej zarzadzac stanem z jednego albo ogolnie mniejszej ilosci miejsc


5. ## Refactor serializatoeow i requestow 2
Bo aktualnie jest dosc hacky, na sline, na 100% wiele zbytecznych, specyficznych rzeczy

# Wazne linki, itd:
1. https://stackoverflow.com/questions/67685843/allow-related-field-in-post-request-in-drf
