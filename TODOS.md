# Nowe funkcjonalnosci
1. TODO: Moze wgl dev notatnik, jakie wystapily problemy, jak zostaly rozwiazane itd.. teoretycznie kod powinien byc takim notatkiem ale jest jak jest czasami, szczegolnie po czasie
3. TODO: komponent side dla homeview z jakims najpop autorem itd - do tego autorzy musieliby miec count postow etc, najpewniej w django
7. ta karuzela jakos ruchoma? albo "stala" ale jakos filtrujaca 3 najnowsze posty albo 3 topowe wyswietlen (po nastepnym punkcie)
8. TODO: **sortowanie po views, likes**
9. footer costam
13. **CLEANUP I JSDOC NA WZOR POPRZEDNICH PROJEKTOW**
14. TODO: Pod tworzeniem postu z markdown dodaj jakis cheatsheet komend, jak wklejac obrazek itd

# Duze rzeczy
1. custom user / profile i logowanie
    - potem powiazywanie tworzonych postow z aktualnym uzytkownikiem itd
    - komentarze - sposob powiazania w django i odpowiadania i forma na tworzenie
2. Obrazki nie z url ale uploadowane
    - i potem moze moznaby na podstawie uploadu do markdowna wkladac link lokalny tam gdzie uzytnik przestal pisac i zaczal uploadowac obrazek
    albo pozwolic mu zuploadowac kilka i potem dac mu do wklejenia gdzie chce linki

# Uzupelnienie funkcjonalnosci
2. dodac filtracje z searchem na stronie tworzenia postow albo wyszukiwanie tagow albo inne

4. ## 09.06.2023
    5. TODO: ~~Usuwanie tagow~~, uzytnikow,
    ale co wtedy z postami ktore je zawieraja? kwestia ustawienia zachowania w django, CASCADE nie zawwsze chcemy, jak mozna to zmienic
    6. Jakies tam laczenie tego wszystkiego

5. ## Wazne: pomyslec nad jakimis refactorami i composables, bo duzo jest podobienst miedzy user/tag/post view, listami itd, idk

# Fixes
1. TODO: lepsze composables z srodkowym zwracaniem stanow itd ale to by wymagalo **zrozumienia promises etc**
2. **Filtracja po tagach** - najpierw w filter componencie dzieje sie emit a dopiero potem aktualizacja v-model wiec wysylane przy klinaniu sa emity z opoznieniem o 1...
i jeszcze to filtrowanie jakos zjebanie dziala ...
poza tym ok

# Pomysly
1. ? moze pomyslec o polaczeniu z store
2. WAZNE: queries/searches wplywajace na filtry, bo dane plyna po prostu z pobierania - wymaga modyfikacji kompunentu FilterSide 
3. cos robic chcialem przy dodawaniu signalem ...

# Koncepty
1. (comments) albo perform_create by moc dodawac na konkretnym url komenty albo cos typu /post/1/comment i tam post leci

2. [**czesciowo zrealizowane**] Moze warto by rozwazyc by bylo lacznie mniej miejsc w ktorych fetchujesz, glownie takie ogolne, top level i one spuszczaja dane nizej, bo ponownie, propy nie sa zle, to jest dobre narzedzie, po cos zostalo stworzone, a zdecydowanie latwiej zarzadzac stanem z jednego albo ogolnie mniejszej ilosci miejsc

3. ## Login dropdown
~~1. Renderowanie dropdownu login/register/acc - musi byc renderowane w zaleznosci od tego czy uzytkownik jest jakis zalogowany, co oczywiscie renderowaniem warunkowym z vue, pytanie jednak jak to sprawdzać? musiałoby jakoś zarządzać sesjami, najlepiej w przeglądarce trzymać, że jeśli jest przechowywany jakiś zalogowany użytnik, to znaczy że jest i to on, jak wylogowujesz to usuwasz itd. I to bedzie wyzwanie

Natomiast przelaczanie miedzy register a login? Moze tylko login w dropdownie albo acc i link do strony rejestracji~~

A potem ze strony rejestracji po submicie powrot do strony glownej albo POPRZEDNIEJ

4. ## Sotowanie
Sortowanie po views, likes etc - w taki sposob (ordered) najlepiej gdyby byly zwracane z store/db, to juz moze zostawie na integracje z django rest, bo tam latwo sie orderuje, tylko kwestia jak taki queryset wywolywac poprzez endpoint? moze parametr ?sorted_by=views&order=asc czy cos

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

# Wazne linki, itd:
1. https://stackoverflow.com/questions/67685843/allow-related-field-in-post-request-in-drf

## Konkretnie:
Dziala routowanie tagow po slugu
teraz przydaloby sie uzytkownikow tez (django i vue)
potem mozliwosc edycji, dodawania usuwania tagow
potem jednolicenie wszedzie

a konkretniej konwersja routes z id na slug i zmiana endpointow z jakich pobierane sa dane z id na slugi

# MEGA GIGA WAZNE:
Cos jest nie tak z vue...
czasem nie pokazuje tego co powinno (zwiazane z callami) a po refreshu juz tak
albo po dodaniu byle jakiej zmiany i zapisaniu
albo czasem nie
myslalem ze chodzi o calle w ifach zaleznych od innych calli ale chyba nie, bo jak wyciagnalem to nic to nie dalo
hmm

A poza tym to cleanup TODOS