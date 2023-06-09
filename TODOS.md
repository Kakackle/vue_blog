
1. TODO: daty i wgl

# REST / API wykorzystanie
- ? i moze pomyslec o polaczeniu z store
- custom user / profile i logowanie
- potem powiazywanie tworzonych postow z aktualnym uzytkownikiem itd
- **komentarze - sposob powiazania w django i odpowiadania i forma na tworzenie**
- potem sposob (w django najpierw) na slugi stworzone z nazw tagow itp
- jak uporam sie z paginacja, to filtrowanie, jak nizej
- ### WAZNE: queries/searches wplywajace na filtry, bo dane plyna po prostu z pobierania - wymaga modyfikacji kompunentu FilterSide 
- cos robic chcialem przy dodawaniu signalem ...
- albo perform_create by moc dodawac na konkretnym url komenty albo cos typu /post/1/comment i tam post leci
- ### WAZNE: POST requests! bo poki co get latwo a posty z axiosem zobaczym
- TODO: zwiazane z filtrowaniem: mam juz przyklad, teraz przydaloby sie dodac to na innych stronach
- ### WAZNE: paginacja - ale poniewaz dodalem paginacje, wszedzie teraz rezultaty nie sa dawane bezposrednio tylko wpakowane sa w results . , przy czym tam gdzie lista, pojedyncze rezultaty dzialaja nadal gites

# Problemy REST:
1. TODO: lepsze composables z srodkowym zwracaniem stanow itd ale to by wymagalo **zrozumienia promises etc**

2. [**czesciowo zrealizowane**] Moze warto by rozwazyc by bylo lacznie mniej miejsc w ktorych fetchujesz, glownie takie ogolne, top level i one spuszczaja dane nizej, bo ponownie, propy nie sa zle, to jest dobre narzedzie, po cos zostalo stworzone, a zdecydowanie latwiej zarzadzac stanem z jednego albo ogolnie mniejszej ilosci miejsc

3. ..

## Konkretniej
1. **linki do stron kategorii, uzytkownikow**
6. komponent side dla homeview z jakims najpop autorem itd
7. count ile postow z tagiem, ile postow ma autor itd - moze w django
10. przesylanie z submitu do bazy danych
11. realizacja wielu filtrow na stronie do rest
12. ta karuzela jakos ruchoma? albo "stala" ale jakos filtrujaca 3 najnowsze posty albo 3 topowe wyswietlen
13. **~~wlasciwosci views, likes (views latwiejsze)~~**
14. sortowanie po views, likes
15. footer costam
16. paginacja - jest wbudowane w rest framework, by ja sam to robil musialaby byc funkcja w store z parametrem robiaca to samo, ale jest to mozliwe
17. **moze wlasna strona kategorii, model z opisem, powiazanymi, countem, nwm**
18. **i majac glowne komponenty odzyskiwania i wysylania danych mozna by przejsc do django/restc**
19. **powrot do dokladnie strony poprzedniej**

20. ~~konwersja v-for z indeksu na instancje przekazywane w propach~~
21. ~~przerzucenie kodu accdrop i logindrop w wlasne komponenty - jebac~~

## Ale kwestie
~~1. Renderowanie dropdownu login/register/acc - musi byc renderowane w zaleznosci od tego czy uzytkownik jest jakis zalogowany, co oczywiscie renderowaniem warunkowym z vue, pytanie jednak jak to sprawdzać? musiałoby jakoś zarządzać sesjami, najlepiej w przeglądarce trzymać, że jeśli jest przechowywany jakiś zalogowany użytnik, to znaczy że jest i to on, jak wylogowujesz to usuwasz itd. I to bedzie wyzwanie

Natomiast przelaczanie miedzy register a login? Moze tylko login w dropdownie albo acc i link do strony rejestracji~~

A potem ze strony rejestracji po submicie powrot do strony glownej albo POPRZEDNIEJ

2. FIXME: najpierw w filter componencie dzieje sie emit a dopiero potem aktualizacja v-model wiec wysylane przy klinaniu sa emity z opoznieniem o 1...
i jeszcze to filtrowanie jakos zjebanie dziala ...
poza tym ok

3. Sortowanie po views, likes etc - w taki sposob (ordered) najlepiej gdyby byly zwracane z store/db, to juz moze zostawie na integracje z django rest, bo tam latwo sie orderuje, tylko kwestia jak taki queryset wywolywac poprzez endpoint? moze parametr ?sorted_by=views&order=asc czy cos


# Zatem tematy do wyszukania:
- DRF sorting etc
- slugs
- axios post

konkretne kroki by zrealizowac post:
1. zamienic w serializatorach uzytkownika na ID? albo moc przesylac ID a view odczytuje to ID i na podstawie niego wybiera uzytkownika (chyba lepsza opcja)
2. jakos przesylac tego uzytkownika z programu - ostatecznie powinno byc ze zalogowany uzytnik automatycznie ale moze trzeba bedzie jakos wybierac wpierw
3. albo dodac forme tworzenia nowego postu jako podstrone strony uzytnika by przesylalo
**problemy:**
1. kwestia tworzenia nowych tagow - nie sa juz po prostu nazwami, jesli bys chcial dodawac nowy tag tylko po nazwie, to trzeba by desc bylo opcjonalne a potem przy przetwarzaniu post requestu, jesli zaden z tagow nie ma nazwy takiej jaka podana, to tworzy nowy na backendzie i przypisuje      - co moze nie jest takie trudne ale na pewno nie takie oczywiste i natychmiastowe jakbym chcial
2. w takim razie musze dac uzytnikowi liste istniejacych tagow i wybor, ale potem tez trzeba to przesylac i akceptowac ale widze ze beda problemy, bo w formie generowanej przez DRF ich nie ma, bo sa to related fields i serializator musialby byc bez nich czy cos... [https://stackoverflow.com/questions/67685843/allow-related-field-in-post-request-in-drf]


# 09.06.2023
1. Mozliwosc edycji postow
2. Mozliwosc edycji tagow / strona tagow
3. Mozliwosc dodawania, edycji userow
4. Mozliwosc usuwania postow
5. Usuwanie reszty
6. Jakies tam laczenie tego
7. lepsza forma dodawnia postow z markdownem?
8. userzy itd

9. slugowanie

10. WAZNE: refactor serializatorow i w jaki sposob pobierane sa dane do vue, tzn, poniewaz mam juz view dla userow, tagow, postow, to nie potrzebuje zwracac w serializatorze linkow do rzeczy, wystarcza same id (algo slugi jak zamienie) i potem konkretne instancje brac z pobranych juz wszystkich tagow, userow itd albo z konkretnego po id - i to jest sposob w jaki to bedzie dzialac wszedzie a nie teraz mam w roznych miejscach na rozne sposoby i sie pierdoli, a takie wybieranie pod id pozwoli na przekazywanie do metod i tym podobnych, bo przekazywanie linkow jest niewygodne
  
gdzie:  
wygodniej by bylo gdyby byly wyswietlane nazwy, ale problem z tym jest taki, ze wtedy by trzeba szukac po nazwie, co zakladaloby ze jest unikalna i nie pod to nastawione sa moje endpointy itd.. 