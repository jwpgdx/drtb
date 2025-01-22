import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기

interface OrderParams {
  limit?: number;
  page?: number;
  [key: string]: any;
}

export const useOrderListStore = defineStore("orderListStore", {
  state: () => ({
    orderErrorMessage: null,
    orderList: [],
    isLastPage: false,
    page: 1,
  }),

  actions: {
    // 공통된 오더리스트 호출 함수
    
    async fetchOrderListCommon(params: OrderParams = {}) {
      const authStore = useAuthStore();
      const accessKey = authStore.accessKey;
      const secretKey = authStore.secretKey;

      if (!accessKey || !secretKey) {
        this.orderErrorMessage = "Access Key와 Secret Key가 설정되지 않았습니다.";
        return false; // 실패 시 false 리턴
      }

      const apiUrl = "https://api.bithumb.com/v1/orders";
      const query = new URLSearchParams(params).toString();
      const queryHash = CryptoJS.SHA512(query).toString(CryptoJS.enc.Hex);

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
        },
      };

      try {
        const response = await axios.get(`${apiUrl}?${query}`, config);
        return response.data; // 성공 시 받아온 데이터 리턴
      } catch (error) {
        console.error("Error:", error);
        if (error.response) {
          console.error("Error Response Status:", error.response.status);
          console.error("Error Response Data:", error.response.data);
        }
        this.orderErrorMessage = error.response?.data || "Failed to fetch order list";
        return false; // 실패 시 false 리턴
      }
    },

    // 오더리스트 새로 불러오기
    async fetchOrderList(params: OrderParams = {}) {
      this.page = 1;
      const updatedParams = { ...params, page: this.page };
      console.log("fetchOrderList 함수 호출됨");
      const data = await this.fetchOrderListCommon(updatedParams);
      if (data) {
        this.orderList = data;
        this.orderErrorMessage = null;
        this.page += 1;
        if(data.length < params.limit) {
          this.isLastPage = true
        } else {
          this.isLastPage = false;
        }
      }
    },

    // 오더리스트 추가로 불러오기
    async fetchMore(params: OrderParams = {}) {
      console.log("fetchMore 함수 호출됨");

      // fetchMore일 때만 this.page 값을 덮어쓰기
      const updatedParams = { ...params, page: this.page };

      const data = await this.fetchOrderListCommon(updatedParams);
      if (data) {
        // 새로 받아온 데이터 추가
        this.orderList = [...this.orderList, ...data];
        this.orderErrorMessage = null;

        // 페이지 번호 증가
        this.page += 1;
        // 마지막 페이지 여부 확인
         
        if(data.length < params.limit || data.length === 0 ) {
          this.isLastPage = true
        } else {
          this.isLastPage = false;
        }


      }
    },




    async cancelOrder(uuid) {
      const authStore = useAuthStore();
      const accessKey = authStore.accessKey;
      const secretKey = authStore.secretKey;

      if (!accessKey || !secretKey) {
        this.orderErrorMessage = "Access Key와 Secret Key가 설정되지 않았습니다.";
        return false; // 실패 시 false 리턴
      }

      const apiUrl = "https://api.bithumb.com/v1/order";
      const query = `uuid=${uuid}`;
      const queryHash = CryptoJS.SHA512(query).toString(CryptoJS.enc.Hex);

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
        },
      };

      try {
        const response = await axios.delete(`${apiUrl}?${query}`, config);
        console.log("Cancel Order Response:", response.data);
        this.orderErrorMessage = null;
        return response.data; // 주문 취소 성공 시 데이터 리턴
      } catch (error) {
        console.error("Error:", error);
        if (error.response) {
          console.error("Error Response Status:", error.response.status);
          console.error("Error Response Data:", error.response.data);
        }
        this.orderErrorMessage = error.response?.data || "Failed to cancel order";
        return false; // 실패 시 false 리턴
      }
    },


    
  },
});
