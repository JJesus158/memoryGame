import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import {createPinia} from "pinia";
import router from "@/router/index.js";

const apiDomain = import.meta.env.VITE_API_DOMAIN

console.log('api domain', apiDomain)

const app = createApp(App)

app.use(router)
app.use(createPinia())

axios.defaults.baseURL = `http://${apiDomain}/api`

app.provide('serverBaseUrl', apiDomain)

app.mount('#app')
