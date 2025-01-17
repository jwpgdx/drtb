import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router 추가
import { createPinia } from 'pinia'; // pinia 추가
import './assets/index.css'; // TailwindCSS 스타일 추가

const app = createApp(App);

app.use(router); // router 등록
app.use(createPinia()); // Pinia 등록

app.mount('#app');
