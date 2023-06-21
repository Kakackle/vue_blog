//Store for route history of user navigation during session
//for breadcrumb displaying purposes
//nowe strony zapisywane w momencie wchodzenia w poszczegolne view

import {defineStore} from "pinia"
import {ref} from 'vue'

export const useRouteStore = defineStore('route', ()=>{
    const routeHistory = ref([
        {
        label: 'home',
        to: '/'
        },
    ])
    const breadcrumbList = ref([])
    const pushRoute = function(route){
        // console.log(JSON.stringify(route));
        // console.log(route.path);
        const newRoute = {label: route.path, to: route.path};
        routeHistory.value.push(newRoute);
        // console.log(JSON.stringify(routeHistory.value));
        console.log(routeHistory.value.length)
    }
    return {routeHistory, breadcrumbList, pushRoute}
})