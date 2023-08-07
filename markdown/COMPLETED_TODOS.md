# Idk, zobaczymy czy okaze sie przydatne takie zapisywanie
## TODO: upieknic, Moze jakies kategorie, typy

1. Mozliwosc dodawania ~~tagow~~ i userow [POST] (chodzi o czy beda problemy ze slug)
4. Routowanie w vue po slugach do postow i uzytkownikow - ale duzo bedzie naprawiania
6. dodaj title do wszystkich podstron
    i moze jakis sposob by zrobic tytul w postaci Blog | podstrona , gdzie podstrona to tytul podstrony ofc

2. dodac filtracje z searchem na stronie tworzenia postow albo wyszukiwanie tagow albo inne

2. WAZNE: queries/searches wplywajace na filtry, bo dane plyna po prostu z pobierania - wymaga modyfikacji kompunentu FilterSide 


5. ## Refactor serializatorow i requestow

1. slugowanie - co bedzie wymagalo zmiany nie tylko w django ale i w vue w pozyskiwaniu rzeczy nie po tagu tylko po slugu
**I moze najlepiej gdyby zaczac od slugowania tagow po name i userow po username, bo sa krotkie i wygodne, a posty pozniej, bo dluzsze**
ALSO: zakladajac ze bedziemy uzywac slugu zamiast id, trzeba bedzie to uwzglednic w pobieraniu wszedzie, ze teraz nie jest po id tylko po slugu, ale zasada pozostaje taka sama ze nie cale elementy w serializatorach tylko reprezentacja

2. WAZNE: refactor serializatorow i w jaki sposob pobierane sa dane do vue, tzn, poniewaz mam juz view dla userow, tagow, postow, to nie potrzebuje zwracac w serializatorze linkow do rzeczy, wystarcza same id (algo slugi jak zamienie) i potem konkretne instancje brac z pobranych juz wszystkich tagow, userow itd albo z konkretnego po id - i to jest sposob w jaki to bedzie dzialac wszedzie a nie teraz mam w roznych miejscach na rozne sposoby i sie pierdoli, a takie wybieranie pod id pozwoli na przekazywanie do metod i tym podobnych, bo przekazywanie linkow jest niewygodne

gdzie:  
wygodniej by bylo gdyby byly wyswietlane nazwy, ale problem z tym jest taki, ze wtedy by trzeba szukac po nazwie, co zakladaloby ze jest unikalna i nie pod to nastawione sa moje endpointy itd.. 

- **rozwiazaniem sa slugi!**, bo mozesz miec endpoint po slugu i wyswietlac sie bedzie jako ladna nazwa itd w ramach serializacji po slugfield
.. ale ponownie, refactoru bedzie wymagalo a to praca ehhh
.. ale mozna miec oba - branie po id numerkowo i po slugach dla latwosci uzytkownika, jest okej


3. Mozna by np dodac wiecej views w Django typu
/users/user_id/posts, ktore zwraca wszystkie posty uzytkownika
co nam da specyficzne pobranie, zamiast calego i nastepnie filtrowania po uzytkowniku - to powinien byc domyslny sposob

.. co byc moze mozna rozwiazac takze poprzez queries! w sensie wystarczy jeden view ale zawierajacy wiele queries
hmm


4. ## Sotowanie
 Sortowanie po views, likes etc - w taki sposob (ordered) najlepiej gdyby byly zwracane z store/db, to juz moze zostawie na integracje z django rest, bo tam latwo sie orderuje, tylko kwestia jak taki queryset wywolywac poprzez endpoint? moze parametr ?sorted_by=views&order=asc czy cos

8.  **sortowanie po views, likes**

8.  **funkcjonalnosc likes** - tylko ze, to nie takie proste, bo chcialbym by kazdy uzytnik mogl polubic dany post tylko raz, do czego potrzebne jest odczytywanie informacji jaki uzytkownik teraz zalogowany i przy klikaniu like zapisywanie tej informacji w jakos tablicy typu "liked_by"

1. Poki co zalogowany uzytnik przechowywany jest w Nav, bo dosyc globalny, ale ciezko potem wyciagac w innych komponentach, wiec zamiast tego stworz nowy store na uzytkownika, moze na tokeny tez potem itd

14. Pod tworzeniem postu z markdown dodaj jakis cheatsheet komend, jak wklejac obrazek itd
albo sa cale markdown editory, ale zastanawia jak ciezkie to jest (wagowo)

16. Slug nie zmienia sie przy patchowaniu postow, szczegolnie chodzi o zmiane tytulu, a to bardzo wazne, ale za chuja nie moglem znalezc signalu ktory by na to reagowal, wiec trzeba by dodac to tak jak tworzenie postow customowe w view w django... ktory po prostu bedzie przy patchu ustawial nowy slug zalezny od nowego tytulu i zapisywal serializator

10.  vueprime dropdown dla wiekszej ilosci linkow w navie, moze drop typu "Lists" i tam wszystkie listy itp

5.  ~~Usuwanie tagow~~, uzytnikow,

2. Obrazki nie z url ale uploadowane
    - i potem moze moznaby na podstawie uploadu do markdowna wkladac link lokalny tam gdzie uzytnik przestal pisac i zaczal uploadowac obrazek
    albo pozwolic mu zuploadowac kilka i potem dac mu do wklejenia gdzie chce linki
    ogolnie Django uploading images, jak to przesylac przez rest, jak to serwowac?

3. pobieranie np. w Nav (bo jest globalny) usera z API wedlug wpisanego
np w dropie username / slug
na start moze byc przechowywane w Navie, potem localstorage
i na podstawie tego wyswietlanie zalogowanego w dropach
i potem mozna by na podstawie tej informacje wykonywac funkcjonalnosci typu
automatyczne ustawianie uzytkownika przy filtrowaniu,
umozliwianie edycji uzytkownika tylko jesli zgadza sie z zalogowanym itd..
czyli kluczowe operacje dla strony obslugujacej konta, a taka wlasnie strone chcemy
przy czym zwaz, ze to co robisz w ten sposob nachodzi na to co powinien robic
twoj backed, czyli obsluga authentication, persmissions itd


## Idk

1. Kompletnie zjebane wszedzie sa rozmiary czcionek w stylach przez to ograniczenie markdown ze font-size nie moze byc globalnie 62.5%
ALE: zamiast kombinowac z zamienianiem wszedzie rozmiarow moze mozna dodac to w na view gdzie to ma sens, a ~~wylaczyc~~ NIE WLACZAC tylko na dwoch (czyli tworzenie postu i wyswietlanie) gdzie jest md - NAGLE MD DZIALA MIMO GLOBALNEGO 62.5%, OKEJ, SUPER