import { defineStore } from 'pinia';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isAdmin: false,
    errorMessage: null as string | null,
  }),
  actions: {
    // 유저 정보를 Firestore에 저장 (최초 로그인 시)
    async ensureUserDoc(user: User) {
      const db = getFirestore();
      
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // 유저 정보 없으면 생성 (기본 role은 'user')
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || '',
          createdAt: new Date(),
          role: 'user'
        });
      }
    },
    // 구글 로그인
    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        this.user = result.user;
        this.isAuthenticated = true;
        this.errorMessage = null;
        // Firestore 유저 정보 확인 및 생성
        await this.ensureUserDoc(result.user);
        // role 확인
        const db = getFirestore(); // Add this line to define db
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
        return result;
      } catch (error) {
        console.error(error);
        this.isAuthenticated = false;
        this.errorMessage = "로그인 실패. 다시 시도해주세요.";
        throw error;
      }
    },
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },
    // 로그아웃
    async logout() {
      const auth = getAuth();
      await auth.signOut();
      this.user = null;
      this.isAuthenticated = false;
      this.isAdmin = false;
    }
  }
});