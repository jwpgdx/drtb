import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { useAccountStore } from "@/stores/account-store"; // accountStore 가져오기

export const useOrderStore = defineStore("orderStore", {
  state: () => ({
    orderStatus: null,
    orderResponse: null,
    orderErrorMessage: null,
    orderList: null,
  }),

  actions: {
    async createOrder(orderData) {
      const authStore = useAuthStore(); // authStore 인스턴스 가져오기

      const accessKey = authStore.accessKey;
      const secretKey = authStore.secretKey;

      if (!accessKey || !secretKey) {
        this.orderErrorMessage = "Access Key와 Secret Key가 설정되지 않았습니다.";
        return;
      }

      const apiUrl = "https://api.bithumb.com";

      const requestBody = {
        market: orderData.market,
        side: orderData.side,
        volume: orderData.volume.toString(),
        price: orderData.price.toString(),
        ord_type: orderData.ord_type,
      };

      const queryString = new URLSearchParams(requestBody).toString();
      const queryHash = CryptoJS.SHA512(queryString).toString(CryptoJS.enc.Hex);

      const payload = {
        access_key: accessKey,
        nonce: uuidv4(),
        timestamp: Date.now(),
        query_hash: queryHash,
        query_hash_alg: "SHA512",
      };

      const header = { alg: "HS256", typ: "JWT" };
      const jwtToken = KJUR.jws.JWS.sign("HS256", header, payload, secretKey);

      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await axios.post(`${apiUrl}/v1/orders`, requestBody, config);
        this.orderStatus = response.status.toString();
        this.orderResponse = response.data;
        this.orderErrorMessage = null;
        const accountStore = useAccountStore();
        await accountStore.fetchAccountData(); // 계좌 정보 조회
      } catch (error) {
        console.error("Error:", error);
        this.orderStatus = error.response?.status.toString() || "No response";
        this.orderErrorMessage = error.response?.data || "Order failed";
      }
    },








    async fetchOrderList(params = {}) {
      console.log("fetchOrderList 함수 호출됨");
      const authStore = useAuthStore();
      const accessKey = authStore.accessKey;
      const secretKey = authStore.secretKey;

      if (!accessKey || !secretKey) {
        this.orderErrorMessage = "Access Key와 Secret Key가 설정되지 않았습니다.";
        return;
      }
      console.log("Access Key와 Secret Key 확인 완료");

      const apiUrl = "https://api.bithumb.com/v1/orders";
      const query = new URLSearchParams(params).toString();
      console.log("Query String:", query);

      const queryHash = CryptoJS.SHA512(query).toString(CryptoJS.enc.Hex);
      console.log("Query Hash:", queryHash);

      const payload = {
        access_key: accessKey,
        nonce: uuidv4(),
        timestamp: Date.now(),
        query_hash: queryHash,
        query_hash_alg: "SHA512",
      };
      console.log("Payload:", payload);

      const header = { alg: "HS256", typ: "JWT" };
      const jwtToken = KJUR.jws.JWS.sign("HS256", header, payload, secretKey);
      console.log("JWT Token:", jwtToken);

      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      console.log("Config:", config);

      try {
        const response = await axios.get(`${apiUrl}?${query}`, config);
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
        this.orderList = response.data;
        this.orderErrorMessage = null;
      } catch (error) {
        console.error("Error:", error);
        if (error.response) {
          console.error("Error Response Status:", error.response.status);
          console.error("Error Response Data:", error.response.data);
        }
        this.orderErrorMessage = error.response?.data || "Failed to fetch order list";
      }
    },
  },
});