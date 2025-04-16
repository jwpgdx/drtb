import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: "AIzaSyAwLtg6Cr3zM390WkvdRHYBYoJEe-efeIk",
  authDomain: "drtb-beta.firebaseapp.com",
  projectId: "drtb-beta",
  storageBucket: "drtb-beta.appspot.com", // ✅ 스토리지 버킷 주소 확인
  messagingSenderId: "330412859086",
  appId: "1:330412859086:web:9f2b5a2f4ab9d4f55a1e19",
  measurementId: "G-SDBKZ6H3J2",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 서비스 가져오기
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // ✅ 스토리지 인스턴스

export {
  auth,
  firestore,
  storage, // ✅ 이거도 export 해야지
  GoogleAuthProvider,
  signInWithPopup,
};
