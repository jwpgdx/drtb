import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { KJUR } from "jsrsasign";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { useMarketStore } from "@/stores/market-store"; // authStore 가져오기
import { useOrderChanceStore } from "@/stores/order-chance-store"; // accountStore 가져오기

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
        const totalNum = parseFloat(total);
        const priceNum = parseFloat(price);

        if (isNaN(totalNum) || isNaN(priceNum) || priceNum === 0) {
          return '0';
        }

        const volume = totalNum / priceNum;

        console.log('totalNum', totalNum);
        console.log('priceNum', priceNum);
        console.log('Calvolume', volume);

        // 과학적 표기법을 일반 소수점 문자열로 변환
        const volumeDecimal = volume.toFixed(10);  // 충분한 소수점 자리수로 변환
        console.log('Volume as decimal:', volumeDecimal);

        // 문자열로 된 소수와 직접 비교
        if (parseFloat(volumeDecimal) <= 0.00000001) {
          console.log('Volume is too small, returning 0');
          return '0';
        }

        return this.limitDecimalPlaces(volumeDecimal.toString());
      };








      if (this.activeTempOrderTab === 'volume') {
        if (inputValue === 'del') {
          this.tempOrderData.volume = this.handleDelKey(this.tempOrderData.volume);
          this.tempOrderData.volume = addInputValue(this.tempOrderData.volume, inputValue);
          // volume만 소수점 8자리까지 제한
          this.tempOrderData.volume = this.limitDecimalPlaces(this.tempOrderData.volume);  // 여기에서 문자열로 반환
          this.tempOrderData.total = calculateTotal(this.tempOrderData.price, this.tempOrderData.volume);
          console.log('value 타입:', typeof this.tempOrderData.total);
        } else if (inputValue === '.') {
          this.tempOrderData.volume = preventDuplicateDot(this.tempOrderData.volume);
        } else {
          this.tempOrderData.volume = addInputValue(this.tempOrderData.volume, inputValue);
          // volume만 소수점 8자리까지 제한
          this.tempOrderData.volume = this.limitDecimalPlaces(this.tempOrderData.volume);  // 여기에서 문자열로 반환
          this.tempOrderData.total = calculateTotal(this.tempOrderData.price, this.tempOrderData.volume);
          console.log('value 타입:', typeof this.tempOrderData.total);
        }
        console.log('volume', this.tempOrderData.volume);

      } else if (this.activeTempOrderTab === 'price') {
        console.log('price', this.tempOrderData.price);
        if (inputValue === 'del') {
          this.tempOrderData.price = this.handleDelKey(this.tempOrderData.price);
          this.tempOrderData.price = addInputValue(this.tempOrderData.price, inputValue);
          this.tempOrderData.total = calculateTotal(this.tempOrderData.price, this.tempOrderData.volume);
          console.log('value 타입:', typeof this.tempOrderData.total);
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
          this.tempOrderData.total = addInputValue(this.tempOrderData.total, inputValue);
          this.tempOrderData.volume = calculateVolume(this.tempOrderData.total, this.tempOrderData.price);
          // volume만 소수점 8자리까지 제한
          this.tempOrderData.volume = this.limitDecimalPlaces(this.tempOrderData.volume);
        } else if (inputValue === '.') {
          // total에 대해서도 소수점 처리 없음
        } else {
          this.tempOrderData.total = addInputValue(this.tempOrderData.total, inputValue);
          this.tempOrderData.volume = calculateVolume(this.tempOrderData.total, this.tempOrderData.price);
          // volume만 소수점 8자리까지 제한
          this.tempOrderData.volume = this.limitDecimalPlaces(this.tempOrderData.volume);
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

      // 마지막 문자를 삭제하고, 비어있으면 '0'을 반환
      return stringValue.slice(0, -1) || '0'; // 마지막 문자 삭제, 비어 있으면 '0'
    },

    limitDecimalPlaces(value: string): string {
      console.log('들어왓슈', value)
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
      const bidBalance = parseFloat(orderChanceStore.bidBalance); // bidBalance를 숫자로 변환
      const askBalance = parseFloat(orderChanceStore.askBalance);

      this.orderRatio = value;
      const ratio = parseFloat(value);
      if (isNaN(ratio)) {
        console.error("비율 값이 유효하지 않습니다:", value);
        return;
      }

      const formatPrice = (value: number) => {
        return Math.round(value).toString(); // 소수점을 버리고 정수로 변환 후 문자열로 반환
      };
    
      const formatVolume = (volume: number) => {
        if (volume < 0.00000001) {
          return "0"; // volume이 0.00000001보다 작으면 "0"으로 변환
        }
        return volume.toFixed(8); // volume을 소수점 8자리까지 반올림 후 문자열로 반환
      };


      if (this.isTempOrder) {
        // * 임시 주문값
        if (this.tempOrderData.side === "bid") {
          // * 매수
          this.tempOrderData.total = formatPrice(bidBalance * ratio);
          this.tempOrderData.volume = formatVolume(this.tempOrderData.total / this.tempOrderData.price);
        } else if (this.tempOrderData.side === "ask") {
          // * 매도
          this.tempOrderData.volume = formatVolume(askBalance * ratio);
          this.tempOrderData.total = formatPrice(this.tempOrderData.volume * this.tempOrderData.price);

        }

      } else {
        // * 주문값
        if (this.orderData.ord_type === "price" || this.orderData.ord_type === "market") {
          this.setOrderData();
        }
        if (this.orderData.side === "bid") {
          // * 매수
          this.orderData.total = formatPrice(bidBalance * ratio);
          this.orderData.volume = formatVolume(this.orderData.total / this.orderData.price);

        } else if (this.orderData.side === "ask") {
          // * 매도
          this.orderData.volume = formatVolume(askBalance * ratio);
          this.orderData.total = formatPrice(this.orderData.volume * this.orderData.price);
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
        console.log ('11', response)
        this.orderErrorMessage = null;
        const marketStore = useMarketStore();
        const orderChanceStore = useOrderChanceStore();
        orderChanceStore.fetchOrderChance(marketStore.orderMarket); 
      } catch (error) {
        console.log ('22', error.response.data.error)

        this.orderStatus = error.response?.data.error.name.toString() || "No response";
        this.orderErrorMessage = error.response?.data.error.message || "Order failed";
      }
    },


















  },
});