# Opcjonalne funkcjonalnosci, ktore mozna by dodac ale duzo roboty za malo rezultatow

## Zwiazane z filtrowaniem

### Daty
1. dodaj filtracje po miesiacu, roku itd, bo powinno byc latwo __month, __year itd
    Problem z tym jest taki, ze to duzo miesiecy, lat itd, co z powtarzajacymi sie miesiacami po roku itd

    Sposobem na to byloby moze dawanie wyboru tylko z istniejacych kombinacji miesiac i rok, tzn np. wyborem jest "Czerwiec 2023" a nie sam "Czerwiec",
    ale zeby przygotowac takie to trzeba pobierac wszystkie posty i z tego tworzyc, a nie chce zawsze pobierac wszystkich postow, chociaz moze czasem jest to okej, bo mozna w komponencie filtru pobrac, stworzyc filtry i potem sie pozbyc przechowywania albo cos, idk

    I potem przesylac takie kombinacje w query do Django, ktore musialoby odszyfrowac i zwrocic obiekty gdzie __year i __month sie zgadzaja, to ez

2. Filtracja po ">1week", ">1week", ">1month"
    Oznaczaloby to w django otrzymanie z query trybu (albo konwersji trybu na dni i tak przesylanie), tworzenia nowego obiektu daty, przesuwania go o tyle dni ile wybierzesz (week, month) i potem porownanie __gt, __lt ?


## Zwiazane z permissions:
1. Moglbym dodac do CreatePostView opcje wyswietlania tylko postow autora, sprawdzana jesli jest uzytnik zalogowany, lub z ustawionym watcherem na loggedUser ze store, ktory przy zmianie tej wartosci dokonywalby pobrania postow na nowo postow z query ?author="loggedUser"