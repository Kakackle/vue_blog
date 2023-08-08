import './assets/base.css'
import './assets/variables.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8000/api/"

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css";

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'


import PrimeVue from 'primevue/config';
//theme
import "primevue/resources/themes/md-light-indigo/theme.css";
    
//core
import "primevue/resources/primevue.min.css";

//Toast options
const options ={
position: "top-right",
  timeout: 3500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true
}

const app = createApp(App)
// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-');
app.use(router)
app.use(createPinia())
app.use(Toast, options)
app.use(VCalendar, {})
app.use(PrimeVue)
app.mount('#app')
