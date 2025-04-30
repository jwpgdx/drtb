import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'; // pinia 추가
import './firebase';  // firebase.ts에서 초기화된 코드가 실행되도록 import
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import router from './router'; // router 추가
import './assets/index.css'; // TailwindCSS 스타일 추가

const app = createApp(App);

app.use(createPinia()); // Pinia 등록
app.use(Vue3Toastify, {
    theme: "dark",
    position: "bottom-center",
    autoClose: 2000,
    toastClassName: 'text-sm rounded-md',
    hideProgressBar: false,
    icon: false,
    transition: "slide",
    clearOnUrlChange: false // 모든 토스트에 적용
  })

  app.use(router); // router 등록

app.mount('#app');
