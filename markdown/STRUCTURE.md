# Struktura projektu

## Nav
### zawiera:
- logo
- routerlinks
- dropdown login/register/acc info - w postaci komponentu? np. **NavAcc.vue**

## Footer
### zawiera
- site map?
- linki do socjali autora itd

## HomeView.vue
### zawiera:
- **Nav.vue**
- **Hero.vue**
- **Carousel.vue** z ostatnimi/najpopularniejszymi kartami **PreviewCard.vue**
- sidebar z ... cos o autorze? albo cos takiego informacyjnego np. top author this week w postaci takiej pionowe
- main z previewem 3 ostatnich postów w postaci **PreviewList.vue** w postaci listy z tytulem, poczatkiem tekstu itd
- przycisk -> zobacz więcej postów
- **Footer.vue**

## BlogView.vue
### zawiera:
- **Nav**, **Footer**
- sidebar z **Filters.vue** czyli searchbarem i checkboxami
- main z listą **PreviewListLarge.vue** czy cos z mini obrazkiem, tytulem, poczatek tekstu wiekszy niz  **PreviewList**
- paginacja

## PostView.vue
### Strona postu czyli zawiera:
- **Nav**, **Footer**
- Caly post czyli:
    - Obrazek 
    - Tytul
    - Autor z profilowym
    - Data
    - tagi/kategorie
    - Treść
    - Lajki
- Komenty
- Przycisk go back to main

## AboutView.vue
### cos o autorze, blogu itd

# Dodatkowo

## CreatePostView
### tzn view do tworzenia postów, tzn zawiera:
- Input na tytul
- autor sam sie dodaje z zalogowanego uzytkownika
- przycisk dodaj tag z inputem na wpisanie
- Input na cover img
- Pole tekstowe na tresc tekstowa
- Input na obrazek
- **wazne** jakis sytem by, w zaleznosci w jakiej kolejnosci uzytkownik robic umozliwic wstawianie na przemian paragrafow tekstu albo obrazkow i zeby w tej kolejnosci bylo odtwarzane w stworzonym poscie
- submit itd

## UserView
### Strona z informacjami o uzytkowniku oraz jego postami, jego najczestszymi tagami itd
- dodatkowo jesli zalogowany uzytkownik odpowiada uzytkownikowi ktorego strone wyswietlamy, wyswietl przyciski umozliwiajace edycje pol

## Register View? czy tylko dropdown z navbara
