1. ~~TODO: Router~~

2. TODO: Post Preview
    1. preview_list
    2. preview_list_large
    3. preview_card

3. TODO: daty i wgl

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
