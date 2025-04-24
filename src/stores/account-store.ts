import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { getFunctions, httpsCallable } from "firebase/functions";

export const useAccountStore = defineStore("accountStore", {
  state: () => ({
    accountData: null,
    accountErrorMessage: null,
    accountStatus: null,
    krwBalance: null, // Added to store formatted KRW balance
    market: null,
    marketLocked: null,
    isLoading: false // 명시적으로 state에 추가

  }),

  actions: {
    async fetchAccountData() {
      this.isLoading = true;
      const authStore = useAuthStore();
      const uid = authStore.user.uid;

      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 인증 불가~');
        this.accountErrorMessage = "등록되지 않은 uid!";
        return;
      }

      try {
        const functions = getFunctions();
        // 타입 정의를 통해 반환값의 구조를 명시적으로 지정
        const createAuthHeaderFromDbCall = httpsCallable<
          { queryString?: string | null },
          { authorization: string }
        >(functions, 'createAuthHeaderFromDb');

        // 계정 조회를 위한 queryString 없이 호출
        const authResult = await createAuthHeaderFromDbCall({
          queryString: null
        });

        // 생성된 인증 헤더로 계정 정보 조회
        const config = {
          headers: {
            Authorization: authResult.data.authorization
          }
        };
        const apiUrl = "https://api.bithumb.com/v1/accounts";

        try {
          const response = await axios.get(apiUrl, config);

          // 계정 정보 조회 성공
          this.accountData = response.data;
          this.accountErrorMessage = null;
          this.accountStatus = response.status.toString();
          this.formatKrwBalance(this.accountData);
          this.isLoading = false;

        } catch (error: any) {
          console.error('[ERROR] Bithumb API 계정 조회 중 오류 발생:', error);
          // 계정 정보 조회 실패
          this.isLoading = false;
          this.accountData = null;
          this.accountStatus = error.response?.status.toString() || "No response";

          // 오류 유형에 따른 세부 메시지 처리
          if (error.response) {
            console.error('[ERROR] 응답에서 에러 확인, 상태 코드:', error.response.status);
            switch (error.response.status) {
              case 401:
                this.accountErrorMessage = "API 키 인증에 실패했습니다. 키를 다시 확인해주세요.";
                break;
              case 403:
                this.accountErrorMessage = "접근 권한이 없습니다. API 키 설정을 확인해주세요.";
                break;
              default:
                this.accountErrorMessage = "계정 정보 조회 중 오류가 발생했습니다.";
            }
          } else {
            console.error('[ERROR] 응답 자체 없음! 네트워크 문제인가?:', error);
            this.accountErrorMessage = "네트워크 오류 또는 서버 연결에 실패했습니다.";
          }
        }
      } catch (error: any) {
        // 인증 헤더 생성 실패
        console.error('[ERROR] 인증 헤더 생성 과정에서 대참사 발생:', error);
        this.isLoading = false;
        this.accountData = null;
        this.accountErrorMessage = "계정 정보를 확인할 수 없습니다.";
      }
    },

    formatKrwBalance(accountData) {
      try {
        // Assuming accountData has a structure like this:  Adjust to your actual structure
        const krwBalance = accountData.filter(item => item.currency === "KRW")
          .map(item => parseFloat(item.balance))
          .reduce((a, b) => a + b, 0);

        if (isNaN(krwBalance)) {
          this.krwBalance = "KRW balance not found or invalid";
          return;
        }

        //Format the number with commas and no decimal places
        const formattedBalance = krwBalance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.krwBalance = formattedBalance;


      } catch (error) {
        console.error("Error formatting KRW balance:", error);
        this.krwBalance = "Error formatting KRW balance";
      }
    },
    setMarketLocked(market) {
      try {
        if (!market || !market.includes("-")) {
          throw new Error("Invalid market format");
        }
        const marketCurrency = market.split("-")[1];
        const marketLocked = this.accountData
          .filter(item => item.currency === marketCurrency)
          .map(item => parseFloat(item.locked))
          .reduce((a, b) => a + b, 0);

        if (isNaN(marketLocked)) {
          console.warn("Market locked value is NaN. Setting default.");
          this.market = marketCurrency;
          this.marketLocked = "0";
          return;
        }

        this.market = marketCurrency;
        this.marketLocked = marketLocked.toString();
      } catch (error) {
        console.error("Error formatting Market Locked:", error.message);
        this.marketLocked = "Error formatting Market Locked";
      }
    },






  },
});
