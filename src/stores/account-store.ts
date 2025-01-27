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
    krwBalance: null, // Added to store formatted KRW balance
    market: null,
    marketLocked: null,
 
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
        this.formatKrwBalance(this.accountData);
      } catch (error) {
        console.error("Error:", error);
        this.accountData = null;
        this.accountStatus = error.response?.status.toString() || "No response";
        this.accountErrorMessage = error.response?.data || "Failed to fetch account data";
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
