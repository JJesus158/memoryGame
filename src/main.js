import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import router from "@/router/index.js";


axios.defaults.baseURL = 'http://localhost/api'

createApp(App).use(router).mount('#app')
