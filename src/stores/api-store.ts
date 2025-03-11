// stores/auth-store.ts
import { defineStore } from "pinia";
import axios from "axios";
import { KJUR } from "jsrsasign"; // JWT 생성 라이브러리
import { v4 as uuidv4 } from "uuid";
import { useAccountStore } from "@/stores/account-store"; // accountStore 가져오기
import { useAuthStore } from "@/stores/auth-store"; // accountStore 가져오기

import { getFunctions, httpsCallable } from "firebase/functions";

interface AuthState {
  accessKey: string | null;
  secretKey: string | null;
  expireAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadingMessage: string | null;
  errorMessage: string | null;
  successMessage: string | null;
}

export const useApiStore = defineStore("apiStore", {
  state: (): AuthState => ({
    accessKey: null,
    secretKey: null,
    expireAt: null,
    isAuthenticated: false,
    isLoading: false,
    loadingMessage: null,
    errorMessage: null,
    successMessage: null,
  }),
  actions: {
    setLoading(val) {
      this.isLoading = val
    },
    async fetchApiKeyStatus() {
      this.isLoading = true;
      console.log('[DEBUG] fetchApiKeyStatus 시작! 에러라도 찰나의 기록 남기자~');
      const authStore = useAuthStore();
      const uid = authStore.user.uid;
      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 인증 불가~');
        this.errorMessage = "등록되지 않은 uid!";
        this.successMessage = null;
        return;
      }
      console.log('[DEBUG] UID 확인됨:', uid);

      try {
        const functions = getFunctions();
        // 타입 정의를 통해 반환값의 구조를 명시적으로 지정
        const createAuthHeaderFromDbCall = httpsCallable<
          { queryString?: string | null },
          { authorization: string }
        >(functions, 'createAuthHeaderFromDb');
        console.log('[DEBUG] Firebase 함수 호출 준비 완료. 이제 JWT 생성 가즈아!');

        // 키 검증을 위해 queryString을 null로 전달
        const authResult = await createAuthHeaderFromDbCall({
          queryString: null
        });
        console.log('[DEBUG] 인증 헤더 생성 성공:', authResult);

        // 생성된 인증 헤더로 API 키 검증
        const config = {
          headers: {
            Authorization: authResult.data.authorization
          }
        };
        const apiUrl = "https://api.bithumb.com/v1/api_keys";

        try {
          console.log('[DEBUG] Bithumb API 호출 전.. 이제 키 검증 돌입!');
          const response = await axios.get(apiUrl, config);
          console.log('[DEBUG] API 키 검증 성공! 응답 데이터:', response.data);

          // API 키 검증 성공
          this.accessKey = response.data[0].access_key;
          this.expireAt = response.data[0].expire_at;
          this.isAuthenticated = true;
          this.successMessage = "API 키가 정상적으로 검증되었습니다.";
          this.errorMessage = null;
          this.isLoading = false;

        } catch (error: any) {
          console.error('[ERROR] Bithumb API 호출 중 오류 발생:', error);
          // API 키 검증 실패
          this.isAuthenticated = false;
          this.successMessage = null;
          this.isLoading = false;

          // 오류 유형에 따른 세부 메시지 처리
          if (error.response) {
            console.error('[ERROR] 응답에서 에러 확인, 상태 코드:', error.response.status);
            switch (error.response.status) {
              case 401:
                this.errorMessage = "API 키 인증에 실패했습니다. 키를 다시 확인해주세요.";
                break;
              case 403:
                this.errorMessage = "접근 권한이 없습니다. API 키 설정을 확인해주세요.";
                break;
              default:
                this.errorMessage = "API 키 검증 중 오류가 발생했습니다.";
            }
          } else {
            console.error('[ERROR] 응답 자체 없음! 네트워크 문제인가?:', error);
            this.errorMessage = "네트워크 오류 또는 서버 연결에 실패했습니다.";
          }
        }
      } catch (error: any) {
        // 인증 헤더 생성 실패
        console.error('[ERROR] 인증 헤더 생성 과정에서 대참사 발생:', error);
        this.isAuthenticated = false;
        this.isLoading = false;

        this.errorMessage = "API 키 상222태를 확인할 수 없습니다.";
        this.successMessage = null;
      }
    },
    // 로그인 함수 및 API 키 검증
    async saveApiKey(accessKey: string, secretKey: string) {
      this.isLoading = true;
      this.loadingMessage = 'API KEY 검증중';
      if (!accessKey || !secretKey) {
        this.errorMessage = "Access Key와 Secret Key를 모두 입력해주세요.";
        this.successMessage = null;
        this.isLoading = null;
        this.loadingMessage = null;
        return;
      }
      try {
        const functions = getFunctions();
        const createAuthHeaderCall = httpsCallable(functions, 'createAuthHeader');

        // Firebase Function을 호출하여 인증 헤더 생성
        const authResult = await createAuthHeaderCall({
          accessKey,
          secretKey,
          queryString: null // 필요한 경우 쿼리 스트링 추가
        });

        const config = {
          headers: {
            [String(authResult.data).split(': ')[0]]: String(authResult.data).split(': ')[1]
          }
        };

        const apiUrl = "https://api.bithumb.com";
        const response = await axios.get(`${apiUrl}/v1/api_keys`, config);



        this.accessKey = accessKey;
        this.secretKey = secretKey;

        console.log("API Key List:", response.data);
        this.loadingMessage = 'API KEY 서버에 저장중';

        // API 키 검증 성공 후 Firestore에 저장 시도
        await this.saveApiKeysToFirestore();

        this.successMessage = "API 키 검증에 성공했습니다!";
        this.errorMessage = null;
        this.isLoading = null;
        this.loadingMessage = null;

      } catch (error: any) {
        this.successMessage = null;
        this.isLoading = null;
        this.loadingMessage = null;
        if (error.response?.data?.error?.name === "jwt_verification") {
          this.errorMessage =
            "JWT 토큰 검증에 실패했습니다. Secret Key를 확인해주세요.";
        } else if (error.response?.data?.error?.name === "invalid_access_key") {
          this.errorMessage =
            "유효하지 않은 Access Key입니다. 올바른 키를 입력하세요.";
        } else {
          this.errorMessage =
            error.response?.data?.error || "서버와의 통신 중 오류가 발생했습니다. Bithumb API Key의 허용 IP주소를 확인해 주세요.";
          console.log("errorrr:", error);
        }
        console.error("Error:", error);
      }
    },
    resetApiStatus() {
      this.isLoading = null;
      this.loadingMessage = null;
      this.errorMessage = null;
      this.successMessage = false;
    },

    resetApiKeyStatus() {
      this.accessKey = null;
      this.secretKey = null;
      this.expireAt = null;
      this.isAuthenticated = false;
      // 기타 필요한 상태 초기화
    },

    async deleteApiKeys() {
      console.log("✅ nextTick 이전전 상태:", this.accessKey, this.secretKey, this.expireAt, this.isAuthenticated);

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const functions = getFunctions();
        const deleteApiKeysFunction = httpsCallable(functions, 'deleteApiKeys');
        await deleteApiKeysFunction();
        console.log('삭제완료');
        this.successMessage = 'API 키가 삭제되었습니다.';
        this.resetApiKeyStatus();
        console.log("✅ nextTick 이후 상태:", this.accessKey, this.secretKey, this.expireAt, this.isAuthenticated);

        return true;
      } catch (error: any) {
        this.error = error.message || 'API 키 삭제 중 오류가 발생했습니다.';
        return false;
      } finally {
        this.loading = false;
      }
    },




    // Firestore에 API 키 저장 함수
    async saveApiKeysToFirestore() {
      try {
        const functions = getFunctions();
        const saveApiKeysCall = httpsCallable(functions, 'saveApiKeys');

        if (!this.accessKey || !this.secretKey) {
          console.error("Access Key or Secret Key is missing in store state.");
          this.errorMessage = "API 키 저장에 실패했습니다. 키 정보가 누락되었습니다.";
          return;
        }

        await saveApiKeysCall({
          accessKey: this.accessKey,
          secretKey: this.secretKey,
        });

        this.successMessage = "API 키가 안전하게 저장되었습니다."; // 성공 메시지 업데이트 (검증 성공 메시지 덮어쓰기)
        this.errorMessage = null;
        console.log("API keys saved to Firestore successfully.");

      } catch (error: any) {
        console.error("Error saving API keys to Firestore:", error);
        this.errorMessage = "API 키 저장에 실패했습니다.";
        this.successMessage = null;
        // 필요하다면 더 자세한 에러 메시지 처리 (error.message 등)
      }
    },
  },
});