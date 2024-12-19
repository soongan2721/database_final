// import './assets/main.css'

import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import router from './router';
import naive from 'naive-ui';
import './styles/style.css';
import axios from 'axios';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
axios.defaults.withCredentials = true;
const app = createApp(App);
app.use(store);
app.use(router);
app.use(naive);
app.use(LoadingPlugin);
app.mount('#app');