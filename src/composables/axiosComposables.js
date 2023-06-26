import {ref} from 'vue'
import axios from 'axios'

export async function getDataFromLink(link){
    const data = ref()
    await axios.get(link)
    .then(
        (response)=>{
            data.value = response.data;
        }
    )
    .catch((error)=>{
        console.log(error);
    })
    return data
}

// TODO: czemu niby odbieranie z destrukturyzacja mialoby nie dzialc z axiosem?
// przeciez zwracac powinno tylko jak przejdzie przez wszystko?
// czy raczej albo zrobic await data = get
// lub robic return w .then zeby bylo tylko po skonczeniu
export function getDataWithSuccess(link){
    const data = ref()
    const success = ref(false);
    const errorMsg = ref("")
    axios.get(link)
    .then(
        (response)=>{
            data.value = response.data;
            success.value = true;
        }
    )
    .catch((error)=>{
        console.log(error);
        success.value = false;
        errorMsg.value = error;
    })
    return {data, success, errorMsg}
}

