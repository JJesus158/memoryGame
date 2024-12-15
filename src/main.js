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

axios.interceptors.response.use(
    response => response, // Pass successful responses through
    error => {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            // Check for specific status codes if needed (e.g., error.response.status === 403)
            router.push({ name: 'ErrorPage', params: { errorCode: error.response.status } });
        }
        return Promise.reject(error); // Reject the promise so other error handlers can act
    }
);

app.provide('serverBaseUrl', apiDomain)

app.mount('#app')
