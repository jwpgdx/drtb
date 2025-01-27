import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { useMarketStore } from "@/stores/market-store"; // authStore 가져오기

import { useAccountStore } from "@/stores/account-store"; // accountStore 가져오기

export const useOrderStore = defineStore("orderStore", {
  state: () => ({
    orderStatus: null,
    orderResponse: null,
    orderErrorMessage: null,
    orderChance: null, // 주문 가능 정보
    orderChanceErrorMessage: null, // 주문 가능 정보 오류 메시지
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
    async updateTempOrderData(inputValue: string) {
      console.log('num', inputValue);

      // 유효한 숫자 입력 체크
      const isValidInput = (input: string) => /^[0-9.]+$/.test(input) || input === 'del';
      if (!isValidInput(inputValue)) {
        console.warn("유효하지 않은 입력입니다!");
        return;
      }
      const addInputValue = (currentValue: string, inputValue: string): string => {
        // 숫자와 소수점만 입력받아 추가
        if (!/^[0-9.]$/.test(inputValue)) {
          return currentValue;
        }
        return currentValue + inputValue;
      };
      const preventDuplicateDot = (value: string): string => {
        // 값이 .로 시작하면 0을 추가
        if (value.startsWith('.')) {
          value = '0' + value;
        }
      
        // Ensure value is a string before checking for dot
        let stringValue = String(value); // value를 문자열로 변환
      
        // Check if the string already contains a dot
        if (stringValue.includes('.')) {
          return stringValue; // If it does, return the value as it is
        }
      
        return stringValue + '.'; // Otherwise, append the dot
      };
      const limitDecimalPlaces = (value: string): string => {
        // 빈 값 또는 NaN이 들어온 경우 "0"을 반환
        if (!value || isNaN(Number(value))) {
          return '0'; // 기본값 0으로 반환
        }
      
        // 앞의 불필요한 0을 제거
        value = value.replace(/^0+(?![\.])/g, ''); // 0 앞에 불필요한 0만 제거, 소수점 뒤는 남긴다.
      
        // 값이 "" (빈 문자열) 또는 "00"일 경우, "0"으로 바꿔줌
        if (value === '' || value === '00') {
          return '0';
        }
      
        // 만약 값이 .로 시작하면 0을 추가
        if (value.startsWith('.')) {
          value = '0' + value;
        }
      
        // 소수점 위치 찾기
        if (value.includes('.')) {
          // 소수점 이하 최대 8자리까지만 자르고, 필요 없으면 "0"을 추가하지 않음
          const dotIndex = value.indexOf('.');
          value = value.slice(0, dotIndex + 9); // 소수점 포함해서 최대 8자리까지
      
          if (value.endsWith('.')) {
            value = value.slice(0, -1); // 만약 끝에 .이 붙어 있으면 제거
          }
        }
      
        return value;
      };
      

      const calculateTotal = (price: string, volume: string): string => {
        // 문자열을 숫자로 변환
        const priceNum = parseFloat(price);
        const volumeNum = parseFloat(volume);
      
        // 유효하지 않으면 "0" 반환
        if (isNaN(priceNum) || isNaN(volumeNum)) {
          return '0';
        }
      
        // 계산 후 소수점 제거하고 문자열로 반환
        const total = priceNum * volumeNum;
        return Math.floor(total).toString(); // 소수점 이하 버리고 정수로 반환
      };

      const calculateVolume = (total: string, price: string): string => {
        // 문자열을 숫자로 변환
        const totalNum = parseFloat(total);
        const priceNum = parseFloat(price);
      
        // 유효한 숫자가 아니면 "0" 반환
        if (isNaN(totalNum) || isNaN(priceNum) || priceNum === 0) {
          return '0';
        }
     
        const volume = totalNum / priceNum;
        return limitDecimalPlaces(volume.toString()); // 계산 결과를 문자열로 변환
      };

      

    




      if (this.activeTempOrderTab === 'volume') {
        if (inputValue === 'del') {
          this.tempOrderData.volume = this.handleDelKey(this.tempOrderData.volume);
        } else if (inputValue === '.') {
          this.tempOrderData.volume = preventDuplicateDot(this.tempOrderData.volume);
        } else {
          this.tempOrderData.volume = addInputValue(this.tempOrderData.volume, inputValue);
          // volume만 소수점 8자리까지 제한
          this.tempOrderData.volume = limitDecimalPlaces(this.tempOrderData.volume);  // 여기에서 문자열로 반환
          this.tempOrderData.total = calculateTotal(this.tempOrderData.price, this.tempOrderData.volume);
          console.log('value 타입:', typeof this.tempOrderData.total);
        }
        console.log('volume', this.tempOrderData.volume);

      } else if (this.activeTempOrderTab === 'price') {
        console.log('price', this.tempOrderData.price);
        if (inputValue === 'del') {
          this.tempOrderData.price = this.handleDelKey(this.tempOrderData.price);
        } else if (inputValue === '.') {
          // price에 대해서는 소수점 처리가 안 됨
        } else {
          this.tempOrderData.price = addInputValue(this.tempOrderData.price, inputValue);
          this.tempOrderData.total = calculateTotal(this.tempOrderData.price, this.tempOrderData.volume);
          console.log('value 타입:', typeof this.tempOrderData.total);
        }

      } else if (this.activeTempOrderTab === 'total') {
        console.log('total', this.tempOrderData.total);

        if (inputValue === 'del') {
          this.tempOrderData.total = this.handleDelKey(this.tempOrderData.total);
        } else if (inputValue === '.') {
          // total에 대해서도 소수점 처리 없음
        } else {
          this.tempOrderData.total = addInputValue(this.tempOrderData.total, inputValue);
          this.tempOrderData.volume = calculateVolume(this.tempOrderData.total, this.tempOrderData.price);
          // volume만 소수점 8자리까지 제한
          this.tempOrderData.volume = limitDecimalPlaces(this.tempOrderData.volume);
          console.log('value 타입:', typeof this.tempOrderData.volume);
        }
      }

      try {
        // 예외처리
      } catch (error) {
        console.error('오류 발생:', error);
      }
    },



    handleDelKey(value: string): string {
      console.log('dell 들어왔음');
      console.log('value 타입:', typeof value); // value의 타입 출력
      
      // value가 숫자일 경우 문자열로 변환하여 slice 사용
      let stringValue = String(value); 
    
      return stringValue.slice(0, -1) || '0'; // 마지막 문자 삭제
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
    initOrderStore(value: string) {
      this.orderRatio = null;
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




    async setRatioChange(value: string) {
      this.orderRatio = value;
      const ratio = parseFloat(value);
      if (isNaN(ratio)) {
        console.error("비율 값이 유효하지 않습니다:", value);
        return;
      }


      if (this.isTempOrder) {
        // * 임시 주문값
        if (this.tempOrderData.side === "bid") {
          // * 매수
          this.tempOrderData.volume = (this.orderChance.bid_account.balance * ratio) / this.tempOrderData.price;
          this.tempOrderData.total = this.orderChance.bid_account.balance * ratio;
        } else if (this.tempOrderData.side === "ask") {
          // * 매도
          this.tempOrderData.total = this.orderChance.ask_account.locked * ratio * this.tempOrderData.price;
          this.tempOrderData.volume = this.orderChance.ask_account.locked * ratio;
        }

      } else {
        // * 주문값
        if (this.orderData.ord_type === "price" || this.orderData.ord_type === "market") {
          this.setOrderData();
        }
        if (this.orderData.side === "bid") {
          // * 매수
          this.orderData.volume = (this.orderChance.bid_account.balance * ratio) / this.orderData.price;
          this.orderData.total = this.orderChance.bid_account.balance * ratio;
        } else if (this.orderData.side === "ask") {
          // * 매도
          this.orderData.total = this.orderChance.ask_account.locked * ratio * this.orderData.price;
          this.orderData.volume = this.orderChance.ask_account.locked * ratio;
        }

      }


    },








    // * 주문하기
    async createOrder() {
      const authStore = useAuthStore(); // authStore 인스턴스 가져오기

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
        this.orderErrorMessage = null;
        const accountStore = useAccountStore();
        await accountStore.fetchAccountData(); // 계좌 정보 조회
      } catch (error) {
        console.error("Error:", error);
        this.orderStatus = error.response?.status.toString() || "No response";
        this.orderErrorMessage = error.response?.data || "Order failed";
      }
    },














    // * 개별 주문 조회

    async fetchOrderChance(market) {
      const authStore = useAuthStore(); // authStore 인스턴스 가져오기

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
        this.orderChance = response.data;
        console.log(response.data)
        this.orderChanceErrorMessage = null;
      } catch (error) {
        console.error("Error:", error);
        this.orderChance = null;
        this.orderChanceErrorMessage = error.response?.data || "Failed to fetch order chance data";
      }
    },




  },
});