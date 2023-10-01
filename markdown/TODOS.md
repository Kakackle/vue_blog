# Nowe funkcjonalnosci
TODO: [Footer.vue] - uzupelnic linki do social media itd, ale to jak juz bedzie wszystko

FIXME: [axiosComposables] - getDataWithSuccess - nonfunctioning atm

8. OPTIONAL: [Django] jakos zamienic to query na lepszy system filtracji/searchu,
   bo na pewno są, aktualnie jest dosyc kaleki
   - wlasciwie to jest dosyc prosty i skuteczny, jedyne co to ze bardzo specyficzny dla view, zeby wykorzystac gdzie indziej duzo kopiowania kodu, a z bibliotekami typu django-filters mozna tworzyc reusable interfejsy w miare

9. [Vue] Animacje oraz kiedy klikasz na np. posts paginated strone - scroll do gory strony a nie zostaje w tym samym miejscu
+ a takze w user view gdy zmieniany jest user poprzez klikniecie - ale to bardzo specyficzny warunek wiec.. moze przy KAZDYM wejsciu na podstrone by sie jakos to dalo

# Uzupelnienie funkcjonalnosci

## Wazne: pomyslec nad jakimis refactorami i composables, bo duzo jest podobienst miedzy user/tag/post view, listami itd, idk

# Pomysly

# Koncepty
1. [**czesciowo zrealizowane**] Moze warto by rozwazyc by bylo lacznie mniej miejsc w ktorych fetchujesz, glownie takie ogolne, top level i one spuszczaja dane nizej, bo ponownie, propy nie sa zle, to jest dobre narzedzie, po cos zostalo stworzone, a zdecydowanie latwiej zarzadzac stanem z jednego albo ogolnie mniejszej ilosci miejsc

# Wazne linki, itd:
1. https://stackoverflow.com/questions/67685843/allow-related-field-in-post-request-in-drf
