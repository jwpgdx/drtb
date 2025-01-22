import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기

export const useAccountStore = defineStore("accountStore", {
  state: () => ({
    accountData: null,
    accountErrorMessage: null,
    accountStatus: null,
  }),

  actions: {
    async fetchAccountData() {
      const authStore = useAuthStore(); // authStore 인스턴스 가져오기

      const accessKey = authStore.accessKey;
      const secretKey = authStore.secretKey;

      if (!accessKey || !secretKey) {
        this.accountErrorMessage = "Access Key와 Secret Key가 설정되지 않았습니다.";
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
        const response = await axios.get(`${apiUrl}/v1/accounts`, config);
        this.accountData = response.data;
        this.accountErrorMessage = null;
        this.accountStatus = response.status.toString();
      } catch (error) {
        console.error("Error:", error);
        this.accountData = null;
        this.accountStatus = error.response?.status.toString() || "No response";
        this.accountErrorMessage = error.response?.data || "Failed to fetch account data";
      }
    },
  },
});
