import { defineStore } from "pinia";

// State 타입 정의
interface AuthState {
  accessKey: string | null;
  secretKey: string | null;
}

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    accessKey: null,
    secretKey: null,
  }),
  actions: {
    setKeys(accessKey: string, secretKey: string) {
      this.accessKey = accessKey;
      this.secretKey = secretKey;
    },
  },
});
