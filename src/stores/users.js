import { defineStore } from "pinia";
import {ref, reactive, computed} from 'vue'

export const useUserStore = defineStore('users', ()=>{
    const users = ref([
        {
            id: 1,
            username: "admin",
            name: "John Darksouls",
            password: "adminadmin",
            mail: "admin@localhost.com",
            bio: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores",
            avatar: "https://randomuser.me/portraits/men/30.jpg",
        },
        {
            id: 2,
            username: "rajj",
            name: "Rajj Patel",
            password: "rajjrajj",
            mail: "rajj@localhost.com",
            bio: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores",
            avatar: "https://randomuser.me/portraits/men/31.jpg",
        },
    ])
    const addUser = (newUser)=>{
        users.value.push(newUser)
    }
    return {users}
})