import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    errorMessage: null as string | null,
  }),

  actions: {
    // 구글 로그인 메서드
    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        this.user = result.user;
        this.isAuthenticated = true;
        this.errorMessage = null;
        return result; // 로그인 성공 후 결과 반환
      } catch (error) {
        console.error(error);
        this.isAuthenticated = false;
        this.errorMessage = "로그인 실패. 다시 시도해주세요.";
        throw error; // 로그인 실패시 에러 던지기
      }
    },

    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },

    // 로그아웃 메서드
    async logout() {
      const auth = getAuth();
      await auth.signOut();
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});
