import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
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
  }),

  actions: {
    async fetchOrderChance(market) {
      const authStore = useAuthStore();
      const accessKey = authStore.accessKey;
      const secretKey = authStore.secretKey;

      if (!accessKey || !secretKey) {
        this.orderChanceErrorMessage = "Access Key와 Secret Key가 설정되지 않았습니다.";
        return;
      }

      const apiUrl = "https://api.bithumb.com";
      const query = `market=${market}`;

      // crypto-js를 사용하여 SHA512 해시 생성
      const queryHash = CryptoJS.SHA512(query).toString(CryptoJS.enc.Hex);

      const payload = {
        access_key: accessKey,
        nonce: uuidv4(),
        timestamp: Date.now(),
        query_hash: queryHash,
        query_hash_alg: "SHA512",
      };

      const jwtToken = KJUR.jws.JWS.sign("HS256", { alg: "HS256", typ: "JWT" }, payload, secretKey);

      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };


      try {
        const response = await axios.get(`${apiUrl}/v1/orders/chance?${query}`, config);
        // merge로 API 데이터와 기본값을 병합
        this.orderChance = merge(this.orderChance, response.data);
        this.bidBalance = this.orderChance.bid_account.balance; // balance 저장
        this.bidCurrency = this.orderChance.bid_account.currency; // currency 저장
        this.askBalance = this.orderChance.ask_account.balance; // balance 저장
        this.askCurrency = this.orderChance.ask_account.currency; // currency 저장
        this.askAvgBuyPrice = this.orderChance.ask_account.avg_buy_price; // 평균 구매 가격 저장
        this.orderChanceErrorMessage = null;
        console.log('asasa', this.orderChance);
      } catch (error) {
        this.orderChanceErrorMessage = error.response?.data || error.message || "Failed to fetch order chance data";
      }
    },
  },
});
