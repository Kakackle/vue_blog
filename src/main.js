import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8000/api/"


const app = createApp(App)
// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-');
app.use(router)
app.use(createPinia())
app.mount('#app')
