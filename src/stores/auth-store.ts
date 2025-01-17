// stores/auth-store.ts
import { defineStore } from "pinia";
import axios from "axios";
import { KJUR } from "jsrsasign"; // JWT 생성 라이브러리
import { v4 as uuidv4 } from "uuid";

interface AuthState {
  accessKey: string | null;
  secretKey: string | null;
  isAuthenticated: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    accessKey: null,
    secretKey: null,
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
  }),
  actions: {
    // 로그인 함수
    async fetchApiKeyList(accessKey: string, secretKey: string) {
      if (!accessKey || !secretKey) {
        this.errorMessage = "Access Key와 Secret Key를 모두 입력해주세요.";
        this.successMessage = null;
        return;
      }

      const apiUrl = "https://api.bithumb.com";

      const payload = {
        access_key: accessKey,
        nonce: uuidv4(),
        timestamp: Date.now(),
      };
      const header = { alg: "HS256", typ: "JWT" };
      const jwtToken = KJUR.jws.JWS.sign("HS256", header, payload, secretKey);

      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };

      try {
        const response = await axios.get(`${apiUrl}/v1/api_keys`, config);

        this.successMessage = "검증에 성공했습니다!";
        this.errorMessage = null;

        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.isAuthenticated = true;

        console.log("API Key List:", response.data);

      } catch (error: any) {
        this.successMessage = null;

        if (error.response?.data?.error?.name === "jwt_verification") {
          this.errorMessage =
            "JWT 토큰 검증에 실패했습니다. Secret Key를 확인해주세요.";
        } else if (error.response?.data?.error?.name === "invalid_access_key") {
          this.errorMessage =
            "유효하지 않은 Access Key입니다. 올바른 키를 입력하세요.";
        } else {
          this.errorMessage =
            "서버와의 통신 중 오류가 발생했습니다. Bithumb API Key의 허용 IP주소를 확인해 주세요.";
          console.log("errorrr:", error);
        }
        console.error("Error:", error);
      }
    },
    logout() {
      this.accessKey = null;
      this.secretKey = null;
      this.isAuthenticated = false;
      this.errorMessage = null;
      this.successMessage = null;
    },
  },
});
