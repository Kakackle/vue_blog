1. ~~TODO: Router~~

2. TODO: Post Preview
    1. preview_list
    2. preview_list_large
    3. preview_card

3. TODO: daty i wgl

# REST / API wykorzystanie
-? i moze pomyslec o polaczeniu z store
-a potem kwestia uzytkownikow w postaci np stworzenia custom wariacji wbudowanego user modelu w django / rest i potem jakos to polaczyc,  -jakos trzymac w programie, moze w localstorage, moze store zalogowanego uzytkownika
-potem powiazywanie tworzonych postow z aktualnym uzytkownikiem itd
-potem komentarze moze
- potem sposob (w django najpierw) na slugi stworzone z nazw tagow itp
- moze wyszukiwanie postow po autorze i innych
- ### WAZNE: queries/searches wplywajace na filtry, bo dane plyna po prostu z pobierania - wymaga modyfikacji kompunentu FilterSide 
- cos robic chcialem przy dodawaniu signalem ...
- albo perform_create by moc dodawac na konkretnym url komenty albo cos typu /post/1/comment i tam post leci
- ### WAZNE: POST! bo poki co get latwo a posty z axiosem zobaczym
- TODO: zwiazane z filtrowaniem: mam juz przyklad, teraz przydaloby sie dodac to na innych stronach
- ale co z wieloma tagami? bo poki co mam po jednym ale jakos liste by sie przydalo zrobic cos typu "get list from query params"
- ### WAZNE: paginacja - ale poniewaz dodalem paginacje, wszedzie teraz rezultaty nie sa dawane bezposrednio tylko wpakowane sa w results . , przy czym tam gdzie lista, pojedyncze rezultaty dzialaja nadal gites

# Problemy REST:
1. przydaloby sie zrobic jakies composables z podawanym linkiem ktore fetchowaloby dane i zwracalo po prostu, a obsluga czy to jest jeden post czy wiele poza nim zaleznie od potrzeb
+ mogloby tez zwracac error msg albo cos poza siebie jesli bys chcial do elementu, a ustawianie wyswietlania na zewnatrz, po odebraniu danych z composable i sprawdzeniu czy puste czy nie
+ also czy jesli mam funkcje w ktorej zamkniety jest axios to musi byc async a potem dane z niej wyciagac await?
2. poszukac moze info na relacji kiedy fetchowac dane w vue, a axiosem lub inaczej (axios vs vue lifecycle hooks czy cos)
3. kwestia hyperlinkedrelatedfields - czy jest mi to potrzebne czy nie i latwiej byloby stringrelated czy czyms, bo hyperlinked wygodne dla admina ale oznacza koniecznosc chainowania fetchy, co nawet nam nie pomaga z routerlinkiem, bo on dziala tez na parametrze takim jak ID
idealnie by wiec zwracac nazwy...

i jesli nazwy bylyby uniknalne to mozna tez wysylac query szukajace po tych nazwach (trzeba by to zbudowac w django)
- ale to znowu chainowanie fetchow, a wszystko po to zeby uzyskac wiele danych..

ALE:
mozesz przeciez zwracac cale obiekty w obiektach w endpoincie, tylko w serializatorach musisz podac ich serializatory
- i to jest niewygodne dla admina, bo jesli duzo to wypcha i trudno przegladac
- ALE jest IDEALNE dla naszego problemu - i wyeliminuje zaleznosc jednego fetcha od drugiego i powinno to wszystko usprawnic
4. Moze warto by rozwazyc by bylo lacznie mniej miejsc w ktorych fetchujesz, glownie takie ogolne, top level i one spuszczaja dane nizej, bo ponownie, propy nie sa zle, to jest dobre narzedzie, po cos zostalo stworzone, a zdecydowanie latwiej zarzadzac stanem z jednego albo ogolnie mniejszej ilosci miejsc
5. ..

## Konkretniej
1. **linki do stron kategorii, uzytkownikow**
2. ~~stworzyc jakis store userow czy cos, z username, login, avatarem, haslem, mailem, bio~~
3. ~~userview~~
4. ~~component do dropdownu logowania/registracji, przejdz do konta itd~~
6. komponent side dla homeview z jakims najpop autorem itd
7. count ile postow z tagiem, ile postow ma autor itd 
8. wgl tagi to moglby byc wlasny store/model w db
9. ~~na start prosta strona tworzenia postow z poki co polem tresciowym tylko na tekst~~
10. ~~przesylanie z submitu do store nowego postu~~
11. filtrowanie - uzytkownik wybiera filtr i wywoluje funkcje ze store ktora to filtruje (podobne zachowanie do rest gdzie wysylasz request z parametrami i zwraca ci queryset)
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
