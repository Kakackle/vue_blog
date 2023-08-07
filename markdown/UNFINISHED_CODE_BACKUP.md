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

