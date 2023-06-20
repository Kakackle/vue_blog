//Store for route history of user navigation during session
//for breadcrumb displaying purposes
//changed on entering routes

import {defineStore} from "pinia"
import {ref} from 'vue'

export const useRouteStore = defineStore('route', ()=>{
    const routeHistory = ref(["/"])
    return {routeHistory}
})