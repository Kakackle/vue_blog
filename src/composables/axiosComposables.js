import {ref} from 'vue'
import axios from 'axios'

export async function getDataFromLink(link){
    const data = ref()
    await axios.get(link)
    .then(
        (response)=>{
            data.value = response.data;
            // console.log(`response.data: ${JSON.stringify(response.data)}`)
        }
    )
    .catch((error)=>{
        console.log(error);
    })
    return data
}

//FIXME: nie mam pojecie jak z tego korzystac, bo przy destructuring nie mozesz uzywac await czy cos wiec chuja to daje
//ale moze to kwestia spojrzenia w to jak dziala axios / fetchowanie bardziej i tam szukac odpowiedzi
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

