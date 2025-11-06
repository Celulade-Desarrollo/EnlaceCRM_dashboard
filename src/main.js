import './assets/main.css'
import { createApp } from 'vue'
import { plugin, defaultConfig } from "@formkit/vue";
import config from "../formkit.config";
import App from './App.vue'
import router from './router'
import './assets/global.css';
import axios from "axios";
import 'leaflet/dist/leaflet.css';


axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const app = createApp(App)
app.use(router)
app.use(plugin, defaultConfig(config))

app.mount('#app')
