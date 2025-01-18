import { defineStore } from 'pinia'
import axios from "axios";
import CryptoJS from "crypto-js"; // HmacSHA512

interface AuthState {
  accessKey: string | null;
  secretKey: string | null;
  isAuthenticated: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  userInfo: Record<string, any> | null;
}

// 인증 헤더 생성 유틸 함수
function generateHeaders(
  endpoint: string,
  requestParams: Record<string, string>,
  accessKey: string,
  secretKey: string,
  apiClientType: string = "2"
) {
  const encodedParams = new URLSearchParams(requestParams).toString();
  const nonce = Date.now().toString();

  // Endpoint + Request Parameter + Api-Nonce 조합
  const signData = `${endpoint};${encodedParams};${nonce}`;

  // HmacSHA512 + Base64 인코딩
  const signature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA512(signData, secretKey)
  );

  return {
    "api-client-type": apiClientType,
    "Content-Type": "application/x-www-form-urlencoded",
    "Api-Key": accessKey,
    "Api-Sign": signature,
    "Api-Nonce": nonce,
  };
}

// Pinia Store 정의
export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    accessKey: '6cb40a618f74012a596ccc579b31af9b',  // 예시 키
    secretKey: 'ef4aa2baaff960f1e191ecff6251d0b0',  // 예시 시크릿
    isAuthenticated: false,
    errorMessage: null,
    successMessage: null,
    userInfo: null,
  }),
  actions: {
    async fetchAccountInfo(orderCurrency: string, paymentCurrency: string = "KRW") {
      if (!this.accessKey || !this.secretKey) {
        this.errorMessage = "Access Key와 Secret Key를 설정해주세요.";
        this.successMessage = null;
        return;
      }

      const endpoint = "/info/account";
      const apiUrl = `https://api.bithumb.com${endpoint}`;

      const requestParams = {
        order_currency: orderCurrency,
        payment_currency: paymentCurrency,
      };

      // 인증 헤더 생성
      const headers = generateHeaders(
        endpoint,
        requestParams,
        this.accessKey!,
        this.secretKey!
      );

      try {
        // requestParams를 string으로 URLSearchParams 형식에 맞게 인코딩
        const encodedParams = new URLSearchParams(requestParams).toString();

        // POST 요청 보내기
        const response = await axios.post(apiUrl, encodedParams, { headers });
        
        console.log("응답 데이터:", response.data);  // 응답 데이터 로그로 출력

        if (response.data.status === "0000") {
          this.successMessage = "회원 정보를 성공적으로 가져왔습니다!";
          this.errorMessage = null;
          this.userInfo = response.data;
        } else {
          this.successMessage = null;
          this.errorMessage = `에러 코드: ${response.data.status}`;
        }
      } catch (error: any) {
        this.successMessage = null;
        this.errorMessage = "서버와의 통신 중 오류가 발생했습니다.";
        console.error("Error:", error);
        if (error.response) {
          // 서버에서 반환한 에러 메시지 출력
          console.error("응답 데이터 (에러):", error.response.data);
        }
      }
    },

    logout() {
      this.accessKey = null;
      this.secretKey = null;
      this.isAuthenticated = false;
      this.errorMessage = null;
      this.successMessage = null;
      this.userInfo = null;
    },
  },
});
