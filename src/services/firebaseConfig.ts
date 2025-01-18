// src/services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: "AIzaSyAZwpno56slAioqR5tKV-AQisM42vn48So",
  authDomain: "bitble.firebaseapp.com",
  projectId: "bitble",
  storageBucket: "bitble.firebasestorage.app",
  messagingSenderId: "419540434111",
  appId: "1:419540434111:web:e8485daf9af8bf2cbc9a0a",
  measurementId: "G-VRP6M15GG8"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };