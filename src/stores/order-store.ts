import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { useMarketStore } from "@/stores/market-store"; // authStore 가져오기
import { useOrderChanceStore } from "@/stores/order-chance-store"; // accountStore 가져오기
import { merge } from "lodash";

export const useOrderStore = defineStore("orderStore", {
  state: () => ({
    orderStatus: null,
    orderResponse: null,
    orderErrorMessage: null,
    orderData: {
      market: null,
      side: "bid",
      volume: "0",
      price: "0",
      total: "0",
      ord_type: 'limit',
    },
    tempOrderData: {
      market: null,
      side: "bid",
      volume: "0",
      price: "0",
      total: "0",
      ord_type: 'limit',
    },
    isTempOrder: false,
    activeTempOrderTab: 'volume',
    orderRatio: null,
  }),

  actions: {
    initOrderStore(value: string = "bid") {
      this.orderStatus = null;
      this.orderResponse = null;
      this.orderErrorMessage = null;
      if (!value) {
        console.warn("value 값이 제공되지 않았습니다. 기본값 'bid'로 설정됩니다.");
        this.orderData.side = "bid";
      } else {
        this.orderData.side = value;
      }
      this.isTempOrderData = false;
      this.setOrderData();
    },

    // * 초기화: 마켓 정보 가져오기
    async setOrderData() {
      this.orderRatio = null;
      const marketStore = useMarketStore();
      const orderMarket = marketStore.orderMarket;

      try {
        // orderMarket 정보가 없을 경우
        if (!orderMarket) {
          this.orderErrorMessage = "선택된 마켓의 정보가 없습니다.";
          return;
        }
        // 마켓 정보를 orderData에 설정
        this.orderData.market = orderMarket.market;
        this.orderData.price = orderMarket.trade_price ? orderMarket.trade_price.toString() : "0";
        this.orderData.volume = "0";
        this.orderData.total = "0";
        this.setTempOrderData();
      } catch (error) {
        // API 호출 실패 또는 예상치 못한 에러 처리
        console.error("마켓 정보를 가져오는 중 에러가 발생했습니다:", error);
        this.orderErrorMessage = "마켓 정보 로딩에 실패했습니다. 다시 시도해주세요.";
      }
    },

    async setOrderDataTradePrice() {
      const marketStore = useMarketStore();
      marketStore.fetchPriceForOrderMarket
      const orderMarket = marketStore.orderMarket;

      try {
        // orderMarket 정보가 없을 경우
        if (!orderMarket) {
          this.orderErrorMessage = "선택된 마켓의 정보가 없습니다.";
          return;
        }
        // 마켓 정보를 orderData에 설정
        this.orderData.price = orderMarket.trade_price ? orderMarket.trade_price.toString() : "0";

        const total = this.calcMulti(this.orderData.volume, this.orderData.price);
        this.orderData.total = this.formatNumber(total);
        this.setTempOrderData();
      } catch (error) {
        // API 호출 실패 또는 예상치 못한 에러 처리
        console.error("마켓 정보를 가져오는 중 에러가 발생했습니다:", error);
        this.orderErrorMessage = "마켓 정보 로딩에 실패했습니다. 다시 시도해주세요.";
      }
    },
















    handleDelKey(value: string) {
      return value.slice(0, -1) || '0';
    },

    preventDuplicateDot(value: string): string {
      if (value.startsWith('.')) {
        value = '0' + value;
      }
      if (value.includes('.')) {
        return value;
      }
      return value + '.';
    },
    inputValue(currentValue: string, inputValue: string) {
      if (!/^[0-9.]$/.test(inputValue)) {
        return currentValue;
      }
      return currentValue + inputValue;
    },


    async updateTempVolume(inputValue: string) {
      if (inputValue === 'del') {
        this.tempOrderData.volume = this.handleDelKey(this.tempOrderData.volume);
        const total = this.calcMulti(this.tempOrderData.volume, this.tempOrderData.price);
        this.tempOrderData.total = this.formatNumber(total);
      }
      if (inputValue === '.') {
        this.tempOrderData.volume = this.preventDuplicateDot(this.tempOrderData.volume);
      } else {
        const volume = this.inputValue(this.tempOrderData.volume, inputValue);
        this.tempOrderData.volume = this.formatDecimal(volume);
        const total = this.calcMulti(this.tempOrderData.volume, this.tempOrderData.price);
        this.tempOrderData.total = this.formatNumber(total);
      }
    },

    async updateTempPrice(inputValue: string) {
      if (inputValue === 'del') {
        this.tempOrderData.price = this.handleDelKey(this.tempOrderData.price);
        const total = this.calcMulti(this.tempOrderData.volume, this.tempOrderData.price);
        this.tempOrderData.total = this.formatNumber(total);
      }
      if (inputValue === '.') {
        this.tempOrderData.price = this.preventDuplicateDot(this.tempOrderData.price);
      } else {
        const price = this.inputValue(this.tempOrderData.price, inputValue);
        this.tempOrderData.price = this.formatDecimal(price);
        const total = this.calcMulti(this.tempOrderData.volume, this.tempOrderData.price);
        this.tempOrderData.total = this.formatNumber(total);
      }
    },
    async updateTempTotal(inputValue: string) {
      if (inputValue === 'del') {
        this.tempOrderData.total = this.handleDelKey(this.tempOrderData.total);
        const volume = this.calcDivi(this.tempOrderData.total, this.tempOrderData.price);
        this.tempOrderData.volume = this.formatDecimal(volume);
      }
      if (inputValue === '.') {

      } else {
        this.tempOrderData.total = this.inputValue(this.tempOrderData.total, inputValue);
        const volume = this.calcDivi(this.tempOrderData.total, this.tempOrderData.price);
        this.tempOrderData.volume = this.formatDecimal(volume);
      }
    },

    async updateTempOrderData(inputValue: string) {
      if (this.activeTempOrderTab === 'volume') {
        this.updateTempVolume(inputValue)
      }
      if (this.activeTempOrderTab === 'price') {
        this.updateTempPrice(inputValue)
      }
      if (this.activeTempOrderTab === 'total') {
        this.updateTempTotal(inputValue)
      }
    },

    // * 계산식
    calcMulti(value1: string, value2: string) {
      const num1 = parseFloat(value1);
    
      const num2 = parseFloat(value2);
      

      if (isNaN(num1) || isNaN(num2)) {
        return '0';
      }
      const result = num1 * num2;
      console.log ('num1-', num1)
      console.log ('num2-', num2)
      console.log ('result-', result)
      return (result).toString();
    },
    calcDivi(value1: string, value2: string) {
      const num1 = parseFloat(value1);
      const num2 = parseFloat(value2);
      if (isNaN(num1) || isNaN(num2) || num2 === 0) {
        return '0';
      }
      const result = num1 / num2;
      return (result).toString();
    },
    // * 소수점 처리 작업
    formatDecimal(value: string | number): string {
      // 만약 value가 number라면 string으로 변환
      let stringValue = String(value);

      // 숫자가 아니거나 빈 문자열인 경우 "0" 반환
      if (!stringValue || isNaN(Number(stringValue))) {
        return '0';
      }

      // 선행 0 제거 (단, 소수점 앞에서만)
      stringValue = stringValue.replace(/^0+(?![\.])/g, '');

      // 값이 '' 또는 '00'인 경우 '0' 반환
      if (stringValue === '' || stringValue === '00') {
        return '0';
      }
      // 소수점 처리
      if (stringValue.includes('.')) {
        const dotIndex = stringValue.indexOf('.');
        // 소수점 이하 최대 8자리까지 자르기
        stringValue = stringValue.slice(0, dotIndex + 9); // 소수점 포함해서 최대 8자리까지
      }
      return stringValue;
    },
    // * 정수 처리 작업
    formatNumber(value: string | number): string {
      let stringValue = String(value);
      let numericValue = parseFloat(stringValue);

      if (isNaN(numericValue)) {
        return "0";
      }

      return Math.round(numericValue).toString();
    },














































    openTempOrder(value: string) {
      console.log(value)
      this.setActiveTempOrderTab(value);
      this.isTempOrder = true;
      this.setTempOrderData();
    },
    closeTempOrder() {
      this.setActiveTempOrderTab(null);
      this.isTempOrder = false;
      this.setTempOrderData();
    },
    setTempOrderData() {
      this.tempOrderData = { ...this.orderData };
    },
    applyTempOrder() {
      if (!this.tempOrderData) {
        console.error("modalOrderData가 없습니다.");
        return;
      }
      this.orderData = { ...this.tempOrderData };
      this.closeTempOrder();
    },
    setActiveTempOrderTab(value: string) {
      this.activeTempOrderTab = value
      console.log('activeTempOrderTab', this.activeTempOrderTab)
    },












    async setRatioChange(value: string) {
      const orderChanceStore = useOrderChanceStore();
      const bidBalance = orderChanceStore.bidBalance;
      const askBalance = orderChanceStore.askBalance;

      if (!value) {
        console.error("비율 값이 유효하지 않습니다:", value);
        return;
      }
      this.orderRatio = value;



      if (this.isTempOrder) {
        // * 임시 주문값
        if (this.tempOrderData.side === "bid") {
          // * 매수
          const balance = this.calcMulti(bidBalance, value);
          this.tempOrderData.total = this.formatNumber(balance)
          const volume = this.calcDivi(this.tempOrderData.total, this.tempOrderData.price);
          this.tempOrderData.volume = this.formatDecimal(volume);
        } else if (this.tempOrderData.side === "ask") {
          // * 매도
          const balance = this.calcMulti(askBalance, value);
          this.tempOrderData.volume = this.formatDecimal(balance)
          const total = this.calcMulti(this.tempOrderData.volume, this.tempOrderData.price);
          this.tempOrderData.total = this.formatNumber(total);
        }
      } else {
        // * 주문값
        if (this.orderData.ord_type === "price" || this.orderData.ord_type === "market") {
          this.setOrderData();
          this.orderRatio = value;
        }
        if (this.orderData.side === "bid") {
          // * 매수
          const balance = this.calcMulti(bidBalance, value);
          this.orderData.total = this.formatNumber(balance)
          const volume = this.calcDivi(this.orderData.total, this.orderData.price);
          console.log ('계산?',volume )
          this.orderData.volume = this.formatDecimal(volume);
        } else if (this.orderData.side === "ask") {
          // * 매도
          const balance = this.calcMulti(askBalance, value);
          console.log ('계산?', value, askBalance)
          this.orderData.volume = this.formatDecimal(balance)
          this.orderData.volume = this.formatDecimal(balance)
          const total = this.calcMulti(this.orderData.volume, this.orderData.price);
          this.orderData.total = this.formatNumber(total);
        }

      }


    },








    // * 주문하기
    async createOrder() {
      const authStore = useAuthStore();

      const accessKey = authStore.accessKey;
      const secretKey = authStore.secretKey;

      if (!accessKey || !secretKey) {
        this.orderErrorMessage = "Access Key와 Secret Key가 설정되지 않았습니다.";
        return;
      }

      const apiUrl = "https://api.bithumb.com";

      const requestBody = {
        market: this.orderData.market,
        side: this.orderData.side,
        volume: this.orderData.volume.toString(),
        price: this.orderData.price.toString(),
        ord_type: this.orderData.ord_type,
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
        console.log('11', response)
        this.orderErrorMessage = null;
        const marketStore = useMarketStore();
        const orderChanceStore = useOrderChanceStore();
        orderChanceStore.fetchOrderChance(marketStore.orderMarket.market);
      } catch (error) {
        console.log('22', error.response.data.error)

        this.orderStatus = error.response?.data.error.name.toString() || "No response";
        this.orderErrorMessage = error.response?.data.error.message || "Order failed";
      }
    },


















  },
});