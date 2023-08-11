### Funkcja majaca na podstawie url pobrac doslownie plik zdjecia, w jakims formacie ktorym mozna by przeslac spowrotem do Django

bo aktualnie jedyny sposob jaki mam to poprzez file input przeslanei pliku z pc i ten plik dziala, ale nie udalo mi sie zrobic by js pobral z neta, zachowal i przeslal tak

wiec poki co sie poddaje

bo nie chce kazac uzytkownikowi pobierac pliku


ALE: myslalem o tym tylko dla sytuacji w ktorych uzytkownik bierze post i aktualizuje go przez przesylanie spowrotem pliku cover img, ale jesli uzytkownik nie zalacza pliku, to po prostu nie jest aktualizowany w Django i elo, nie ma zadnego problemu

```
async function getFileFromUrl(url, defaultType = 'image/jpg') {
    // trzeba jakos odebrac albo link albo z endpointu img (przy edycji postu)
    // i jakos to przeksztalcic na pelnoprawny img
    // i potem wyslac
    // ale nie mam pojecia jak

//   const response = await fetch(url)
//   const data = await response.blob() 
//   return new File([data], name, {
//     type: data.type || defaultType,
//   })
//   axios.get(url)
//   .then((res)=>{
//     data = res.data.blob()
//     newImg.value = new File([data], name, {
//     type: data.type || defaultType,
//     })
//     console.log(`data: ${data}`)
//   })
//   .catch((err)=>{
//     console.log(err);
//   })
//   axios.get(`image/${selectedPost.value.slug}`)
//   .then((res)=>{
//     // console.log(res.data);
//     newImg.value = res.data;
//   })
//   .catch((err)=>{
//     console.log(err);
//   })

// fetch(`image/${selectedPost.value.slug}`)
// .then(res => res.blob())
// .then(blob=>{
//     var reader = new FileReader();
//     reader.readAsDataURL(blob); 
//     reader.onloadend = function() {
//     var base64data = reader.result;
//     newImg.value = base64data;                
//     console.log(base64data);
//     }
// })

}
```

*status: zbyteczne*


### Funkcja aktualizujaca polubienia na w tym przypadku modelu komentarzy, ktory posiada pole manytomany powiazane z uzytkownikami.

Ta funkcja pobiera zatem z endpointu przez serializator listę uzytkownikow lubiacych post, dodaje do niego lub odejmuje od niej aktualnie zalogowanego uzytkownika i zwraca sprowrotem cala liste, ktora serializator akceptuje bez problemu

Ale problem jest taki ze to bardzo duzo operacji logicznych jak na frontend, lepiej zostawic to backendowi i tak zostalo zrobione - jeden endpoint na backendzie przyjmuje zalogowanego uzytkownika i decyduje czy dodac czy odjac i to wykonuje

```
const updateLiked = async function(){
    success.value='';
    error.value='';
    if(!loggedUser.value.slug){
        loggedUser.value = userStore.getUser();
    }
    //czy jakikolwiek uzytkownik zalogowany
    new_liked_by.value = loggedUser.value;
    if(!new_liked_by.value){
        toast.error(`log in first before trying to like`);
        return
    }
    if(loggedUser.value.slug === comment.value.author){
        toast.error(`you can't like your own comments, silly`);
        return
    }
    //czy uzytkownik juz w liscie lubiacych
    if(comment.value.liked_by.filter((slug)=>{ return slug === loggedUser.value.slug}).length === 0){
        console.log(`logged user not in liked_by`);
        comment.value.liked_by.push(new_liked_by.value.slug);
    }
    else{
        const user_index = comment.value.liked_by.indexOf(loggedUser.value.slug);
        comment.value.liked_by.splice(user_index, 1);
        if (comment.value.liked_by.length === 0){
            comment.value.liked_by = [];
        }
        console.log('user in liked_by already');
        // toast.error('user in liked_by already');
    }
    console.log(`new liked_by: ${comment.value.liked_by},
     type: ${typeof comment.value.liked_by},
     len: ${comment.value.liked_by.length}`);
    
    axios.patch(`comments/${comment.value.id}`, {
        liked_by: comment.value.liked_by,
        likes: comment.value.liked_by.length
    })
    .then((res)=>{
        success.value = `updated likes, ${res.status}, ${res.statusText}`;
        toast.success(success.value);
        new_liked_by.value=undefined;
        emit('refresh');
        
    })
    .catch((err)=>{
        error.value = `${err.status}, ${err.statusText}`;
        toast.error(error.value);
        console.log(`updating comment likes error: ${err}`);
    })
}
```

#### tak samo dla postow - nowy sposob dodawania polubien

```
const updateLiked = async function(){
    // aktualne liked_by
    console.log(`old liked_by: ${post.value.liked_by}`);
    success.value='';
    error.value='';
    // jesli zalogowany user jest aktualny, a jesli bylo zalogowanie nie wykryte
    //to upewnij sie
    if(!loggedUser.slug){
        loggedUser.value = userStore.getUser();
    }
    // przypisz nowego uzytkownika do zmiennej new_liked_by
    new_liked_by.value = loggedUser.value;
    // jesli nie ma zalogowanego uzytkownika to powroc
    if(!new_liked_by.value){
        toast.error(`log in first before trying to like`);
        return
    }
    // jesli zalogowany uzytkownik NIE JEST w liscie lajkujacych post
    if(post.value.liked_by.filter((slug)=>{ return slug === loggedUser.value.slug}).length === 0){
        console.log(`logged user not in liked_by`);
        // dodaj uzytkownika do lajkujacych
        post.value.liked_by.push(new_liked_by.value.slug);
    }
    // jesli JEST juz na liscie
    else{
        const user_index = post.value.liked_by.indexOf(new_liked_by.value.slug)
        post.value.liked_by.splice(user_index, 1);
        console.log('user in liked_by already');
        if (post.value.liked_by.length === 0){
            post.value.liked_by = [];
        }
        // toast.error('user in liked_by already');
    }
    //po dodaniu albo usunieciu
    console.log(`new liked_by: ${post.value.liked_by},
     type: ${typeof post.value.liked_by},
     len: ${post.value.liked_by.length}`);
    
    // przeslij nowy stan
    axios.patch(`posts/${post.value.slug}`, {
        liked_by: post.value.liked_by,
        likes: post.value.liked_by.length
    },
    {
            headers: {
                "Content-Type": "multipart/form-data",
            },
    })
    .then((res)=>{
        // console.log(`data sent: ${post.liked_by}`)
        success.value = `changed post likes, ${res.status}, ${res.statusText}`;
        toast.success(success.value);
        console.log(success.value);
        new_liked_by.value=undefined;
        emit('refresh');
    })
    .catch((err)=>{
        error.value = `${err.status}, ${err.statusText}`;
        toast.error(error.value);
        console.log(`update like err: ${err}`);
    })
}
```

