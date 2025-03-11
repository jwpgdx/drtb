import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router 추가
import { createPinia } from 'pinia'; // pinia 추가
import './assets/index.css'; // TailwindCSS 스타일 추가
import './firebase';  // firebase.ts에서 초기화된 코드가 실행되도록 import

const app = createApp(App);

app.use(router); // router 등록
app.use(createPinia()); // Pinia 등록

app.mount('#app');
