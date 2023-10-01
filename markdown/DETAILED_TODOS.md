# 1. Custom user / user extension

## Najłatwiejszym podejsciem wydaje sie rozszerzenie wbudowanego w Django User modelu o nowy model:
tzn. poprzez stworzenie modelu typu "Profile" z OneToOne relacją, przypisywaną podczas tworzenie użytkownika z requestu / instance

Co oznacza ze trzeba by dodać nowy model i sposoby odczytywania request/instance i zapisywania nowego user modelu poprzez save i sygnalami itd

np. tu:
- https://studygyaan.com/django/how-to-extend-django-user-model

## Alternatywa jest stworzenie prawie kompletnie nowego modelu, zastapujac domyslny:
np. tu:
- https://studygyaan.com/django/how-to-extend-django-user-model

Ale jakie sa benefity tego?

# 2. Majac custom usera (nie jest to wymog) authentication

**AD. 01.10.23** - w przypadku rozdzielonych domain pozostaje jedynie poprzez token

Zrodla ogolne:
- https://www.reddit.com/r/django/comments/poqe09/best_way_to_do_authentication_with/
- https://www.django-rest-framework.org/api-guide/authentication/
- biblio fajna?: https://github.com/sunscrapers/djoser

## Sposob 1. (do sprobowania) Session Authentication z DRF

### Do czego podejsc mozna w nastepujace sposoby:

1. Kompletnie oddzielne domains/apki (sensownie jesli masz rozdzielony backend i front a chcesz udostepniac frotn uzytkownikom), powinno to dzialac zgodnie z: 
https://testdriven.io/blog/django-spa-auth/

2. Jesli natomiast by nie dzialalo, trzeba/mozna by zaczac kombinowac cos z umieszczaniem django i vue na jednym domain, w jednym projekcie, co nie powinno byc tak trudne, bo ostatecznie masz jeden glowny html ktory servujesz jako SPA i do niego przypinasz vue app, wiec nie powinno byc zbytnio zabawy/problemow z wieloma pejami/views/html z django, np. tu:
- https://www.guguweb.com/2022/01/23/django-rest-framework-authentication-the-easy-way/
- i te linki z reddita
- https://www.valentinog.com/blog/vue-django/
- 

## 2. Sposob: Tokeny, localStorage itd
- https://simpleisbetterthancomplex.com/tutorial/2018/11/22/how-to-implement-token-authentication-using-django-rest-framework.html


# 3. Login, singup etc forms (sa tez w linkach z auth):
- https://www.geeksforgeeks.org/django-sign-up-and-login-with-confirmation-email-python/
- https://python.plainenglish.io/user-registration-and-login-authentication-in-django-2f3450479409

## Jesli dziala sessions auth:
1. Generalnie kwestia wysylania post requestow, odczytywania ic hw odpowniednym view w django i zwrcania i oczekiwania odpowiednich statusow i jesli status to pokazujesz uzytkownikowi na stronie ze zalogowany itd **a w tle powinno sie to zajac session**

## Jesli token
1. Tworzyc uzytkownika powinni moc wszyscy natomiast do inny "non-safe" methods potrzebne byloby przechowywanie tokenu i przesylanie go razem z requestami, token otrzymujesz przy tworzeniu uzytkownika
- Ale jak wtedy zajmowac sie loginami/logoutami? ni mom pojecia, jakos by trzeba wymieniac ten przechowywany w localstorage token
