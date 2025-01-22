// stores/auth-store.ts
import { defineStore } from "pinia";
import axios from "axios";
import { KJUR } from "jsrsasign"; // JWT 생성 라이브러리
import { v4 as uuidv4 } from "uuid";
import { useAccountStore } from "@/stores/account-store"; // accountStore 가져오기

interface AuthState {
  accessKey: string | null;
  secretKey: string | null;
  isAuthenticated: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  sessionTimer: number | null; // 로그인 유지 타이머 ID
  remainingTime: number; // 남은 시간 (초 단위)
}

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    accessKey: null,
    secretKey: null,
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    sessionTimer: null,
    remainingTime: 10 * 60, // 10분 초기화
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
        this.startSessionTimer();

        const accountStore = useAccountStore();
        await accountStore.fetchAccountData(); // 계좌 정보 조회
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

      // 타이머 제거
      if (this.sessionTimer) {
        clearInterval(this.sessionTimer);
        this.sessionTimer = null;
      }

      this.remainingTime = 10 * 60; // 초기화
    },
    // 로그인 유지 타이머 시작 (10분)
    startSessionTimer() {
      // 기존 타이머 제거
      if (this.sessionTimer) {
        clearInterval(this.sessionTimer);
      }

      // 타이머 시작
      this.remainingTime = 10 * 60; // 10분
      this.sessionTimer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime -= 1; // 1초씩 감소
        } else {
          // 시간 종료 시 로그아웃
          this.logout();
          alert("로그인 유지 시간이 만료되었습니다. 다시 로그인해주세요.");
        }
      }, 1000); // 1초 간격
    },

    // 타이머 초기화
    clearSessionTimer() {
      if (this.sessionTimer) {
        clearTimeout(this.sessionTimer);
        this.sessionTimer = null;
      }
    },

    // 로그인 유지 연장
    extendSession() {
      this.startSessionTimer(); // 타이머 초기화 및 연장
      this.successMessage = "로그인 유지 시간이 연장되었습니다.";
    },
  },
});
