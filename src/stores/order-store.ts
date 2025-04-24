import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { useMarketStore } from "@/stores/market-store"; // marketStore 가져오기
import { useOrderChanceStore } from "@/stores/order-chance-store"; // accountStore 가져오기
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore"; // Firestore 추가

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
          this.orderData.volume = this.formatDecimal(volume);
        } else if (this.orderData.side === "ask") {
          // * 매도
          const balance = this.calcMulti(askBalance, value);
          this.orderData.volume = this.formatDecimal(balance)
          this.orderData.volume = this.formatDecimal(balance)
          const total = this.calcMulti(this.orderData.volume, this.orderData.price);
          this.orderData.total = this.formatNumber(total);
        }

      }


    },











    // * 주문 내역을 데이터베이스에 저장하는 함수 (Users 하위 컬렉션 구조)
    async saveOrderToDatabase(apiResponse) {
      const authStore = useAuthStore();
      const uid = authStore.user.uid;
    
      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 데이터베이스 저장 불가');
        return false;
      }
    
      try {
        const db = getFirestore();
    
        const timestamp =
          apiResponse.created_at
            ? Timestamp.fromDate(new Date(apiResponse.created_at))
            : Timestamp.now();
    
        const orderData = {
          ...apiResponse,
          uid,
          timestamp,
        };
    
        // ✅ 문서 ID 자동 생성
        await addDoc(collection(db, 'users', uid, 'orders'), orderData);
    
        return true;
      } catch (error) {
        console.error('[ERROR] 데이터베이스 저장 중 오류 발생:', error);
        return false;
      }
    },

    // * 주문하기
    async createOrder() {
      this.orderStatus = null;
      this.orderResponse = null;
      this.orderErrorMessage = null;

      const authStore = useAuthStore();
      const uid = authStore.user.uid;

      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 인증 불가~');
        this.orderErrorMessage = "등록되지 않은 uid!";
        return;
      }

      // 주문 데이터 준비
      const requestBody = {
        market: this.orderData.market,
        side: this.orderData.side,
        volume: this.orderData.volume.toString(),
        price: this.orderData.price.toString(),
        ord_type: this.orderData.ord_type,
      };

      // 쿼리 스트링 생성
      const queryString = new URLSearchParams(requestBody).toString();


      try {
        const functions = getFunctions();
        // 타입 정의를 통해 반환값의 구조를 명시적으로 지정
        const createAuthHeaderFromDbCall = httpsCallable<
          { queryString?: string | null },
          { authorization: string }
        >(functions, 'createAuthHeaderFromDb');

        // 인증 헤더 생성
        const authResult = await createAuthHeaderFromDbCall({
          queryString: queryString
        });

        // 생성된 인증 헤더로 주문 요청
        const config = {
          headers: {
            Authorization: authResult.data.authorization,
            "Content-Type": "application/json"
          }
        };
        const apiUrl = "https://api.bithumb.com/v1/orders";

        try {
          const response = await axios.post(apiUrl, requestBody, config);

          this.orderStatus = response.status.toString();
          this.orderResponse = response.data;
          this.orderErrorMessage = null;

          // 주문');
          // 주문 성공 시 데이터베이스에 주문 내역 저장
          const apiResponse = response.data
          console.log('1. apiResponse:', apiResponse);
          await this.saveOrderToDatabase(apiResponse);

        } catch (error) {
          console.error('[ERROR] Bithumb API 주문 요청 중 오류 발생:', error);

          // 오류 유형에 따른 세부 메시지 처리
          if (error.response) {
            console.error('[ERROR] 응답에서 에러 확인, 상태 코드:', error.response.status);
            this.orderStatus = error.response?.data.error?.name?.toString() || "Error";
            this.orderErrorMessage = error.response?.data.error?.message || "주문 처리 중 오류가 발생했습니다.";

            switch (error.response.status) {
              case 401:
                this.orderErrorMessage = "API 키 인증에 실패했습니다. 키를 다시 확인해주세요.";
                break;
              case 403:
                this.orderErrorMessage = "접근 권한이 없습니다. API 키 설정을 확인해주세요.";
                break;
              case 400:
                this.orderErrorMessage = "잘못된 요청입니다. 주문 정보를 확인해주세요.";
                break;
              default:
              // 이미 설정된 오류 메시지 사용
            }
          } else {
            console.error('[ERROR] 응답 자체 없음! 네트워크 문제인가?:', error);
            this.orderStatus = "NetworkError";
            this.orderErrorMessage = "네트워크 오류 또는 서버 연결에 실패했습니다.";
          }
        }
      } catch (error) {
        // 인증 헤더 생성 실패
        console.error('[ERROR] 인증 헤더 생성 과정에서 대참사 발생:', error);
        this.orderStatus = "AuthError";
        this.orderErrorMessage = "인증 처리 중 오류가 발생했습니다. 로그인 상태를 확인해주세요.";
      }
    },



    // * 사용자의 주문 이력 가져오기
    // * 사용자의 주문 이력 가져오기
    async fetchUserOrderHistory(limitNumber = 10) { // Changed parameter name
      const authStore = useAuthStore();
      const uid = authStore.user.uid;

      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 주문 이력 조회 불가');
        return [];
      }

      try {
        const db = getFirestore();
        const ordersRef = collection(db, `users/${uid}/orders`);
        const q = query(ordersRef, orderBy("timestamp", "desc"), limit(limitNumber)); // Use renamed parameter

        const querySnapshot = await getDocs(q);
        const orders = [];

        querySnapshot.forEach((doc) => {
          orders.push({
            id: doc.id,
            ...doc.data()
          });
        });

        return orders;
      } catch (error) {
        console.error('[ERROR] 주문 이력 조회 중 오류 발생:', error);
        return [];
      }
    },






















  },
});