import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";


axios.defaults.baseURL = 'http://localhost/api'

createApp(App).mount('#app')
