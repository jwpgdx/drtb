import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { getFunctions, httpsCallable } from "firebase/functions";
import { merge } from "lodash";

export const useOrderChanceStore = defineStore("orderChanceStore", {
  state: () => ({
    orderChance: {
      bid_fee: "0.0025",
      ask_fee: "0.0025",
      maker_bid_fee: "0.0025",
      maker_ask_fee: "0.0025",
      market: {
        id: "KRW-BTC",
        name: "BTC/KRW",
        order_types: ["limit"],
        order_sides: ["ask", "bid"],
        bid_types: ["limit", "price"],
        ask_types: ["limit", "market"],
        bid: {
          currency: "KRW",
          min_total: "5000",
        },
        ask: {
          currency: "BTC",
          min_total: "5000",
        },
        max_total: "1000000000",
        state: "active",
      },
      bid_account: {
        currency: "KRW",
        balance: "0",
        locked: "0",
        avg_buy_price: "0",
        avg_buy_price_modified: false,
        unit_currency: "KRW",
      },
      ask_account: {
        currency: "BTC",
        balance: "0",
        locked: "0",
        avg_buy_price: "0",
        avg_buy_price_modified: false,
        unit_currency: "KRW",
      },
    },
    orderChanceErrorMessage: null,
    bidBalance: "0", // 기본값 설정
    bidCurrency: "KRW", // 기본값 설정
    askBalance: "0", // 기본값 설정
    askCurrency: "BTC", // 기본값 설정
    askAvgBuyPrice: "0",
    isLoading: false, // 로딩 상태 추가
  }),

  actions: {
    async fetchOrderChance(market) {
      this.isLoading = true;
      const authStore = useAuthStore();
      const uid = authStore.user.uid;
      
      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 인증 불가~');
        this.orderChanceErrorMessage = "등록되지 않은 uid!";
        this.isLoading = false;
        return;
      }
    
      try {
        const functions = getFunctions();
        // 타입 정의를 통해 반환값의 구조를 명시적으로 지정
        const createAuthHeaderFromDbCall = httpsCallable<
          { queryString?: string | null },
          { authorization: string }
        >(functions, 'createAuthHeaderFromDb');
    
        // 마켓 정보 포함하여 queryString 구성
        const queryString = `market=${market}`;
        const authResult = await createAuthHeaderFromDbCall({
          queryString: queryString
        });
    
        // 생성된 인증 헤더로 주문 기회 조회
        const config = {
          headers: {
            Authorization: authResult.data.authorization
          }
        };
        const apiUrl = `https://api.bithumb.com/v1/orders/chance?${queryString}`;
    
        try {
          const response = await axios.get(apiUrl, config);
    
          // 기존 orderChance와 응답 데이터 병합
          this.orderChance = merge(this.orderChance, response.data);
          this.bidBalance = this.orderChance.bid_account.balance;
          this.bidCurrency = this.orderChance.bid_account.currency;
          this.askBalance = this.orderChance.ask_account.balance;
          this.askCurrency = this.orderChance.ask_account.currency;
          this.askAvgBuyPrice = this.orderChance.ask_account.avg_buy_price;
          this.orderChanceErrorMessage = null;
          this.isLoading = false;
    
        } catch (error) {
          console.error('[ERROR] Bithumb API 주문 기회 조회 중 오류 발생:', error);
          // 주문 기회 정보 조회 실패
          this.isLoading = false;
    
          // 오류 유형에 따른 세부 메시지 처리
          if (error.response) {
            console.error('[ERROR] 응답에서 에러 확인, 상태 코드:', error.response.status);
            switch (error.response.status) {
              case 401:
                this.orderChanceErrorMessage = "API 키 인증에 실패했습니다. 키를 다시 확인해주세요.";
                break;
              case 403:
                this.orderChanceErrorMessage = "접근 권한이 없습니다. API 키 설정을 확인해주세요.";
                break;
              case 400:
                this.orderChanceErrorMessage = "잘못된 요청입니다. 마켓 ID를 확인해주세요.";
                break;
              default:
                this.orderChanceErrorMessage = "주문 기회 정보 조회 중 오류가 발생했습니다.";
            }
          } else {
            console.error('[ERROR] 응답 자체 없음! 네트워크 문제인가?:', error);
            this.orderChanceErrorMessage = "네트워크 오류 또는 서버 연결에 실패했습니다.";
          }
        }
      } catch (error) {
        // 인증 헤더 생성 실패
        console.error('[ERROR] 인증 헤더 생성 과정에서 대참사 발생:', error);
        this.isLoading = false;
        this.orderChanceErrorMessage = "주문 기회 정보를 확인할 수 없습니다.";
      }
    },
  },
});