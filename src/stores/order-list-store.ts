import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store"; // authStore 가져오기
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore"; // Firestore 추가

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
    isLoading: false,
  }),

  actions: {
    // 공통된 오더리스트 호출 함수
    async fetchOrderListCommon(params: OrderParams = {}) {
      this.isLoading = true;
      const authStore = useAuthStore();
      const uid = authStore.user.uid;

      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 인증 불가~');
        this.orderErrorMessage = "등록되지 않은 uid!";
        this.isLoading = false;
        return false;
      }

      try {
        const functions = getFunctions();
        // 타입 정의를 통해 반환값의 구조를 명시적으로 지정
        const createAuthHeaderFromDbCall = httpsCallable<
          { queryString?: string | null },
          { authorization: string }
        >(functions, 'createAuthHeaderFromDb');

        // 파라미터를 queryString으로 변환
        const query = new URLSearchParams(params).toString();

        // queryString 포함하여 호출
        const authResult = await createAuthHeaderFromDbCall({
          queryString: query
        });

        // 생성된 인증 헤더로 주문 목록 조회
        const config = {
          headers: {
            Authorization: authResult.data.authorization
          }
        };
        const apiUrl = `https://api.bithumb.com/v1/orders?${query}`;

        try {
          const response = await axios.get(apiUrl, config);
          this.isLoading = false;
          return response.data; // 성공 시 받아온 데이터 리턴

        } catch (error: any) {
          console.error('[ERROR] Bithumb API 주문 목록 조회 중 오류 발생:', error);

          // 오류 유형에 따른 세부 메시지 처리
          if (error.response) {
            console.error('[ERROR] 응답에서 에러 확인, 상태 코드:', error.response.status);
            switch (error.response.status) {
              case 401:
                this.orderErrorMessage = "API 키 인증에 실패했습니다. 키를 다시 확인해주세요.";
                break;
              case 403:
                this.orderErrorMessage = "접근 권한이 없습니다. API 키 설정을 확인해주세요.";
                break;
              case 400:
                this.orderErrorMessage = "잘못된 요청입니다. 파라미터를 확인해주세요.";
                break;
              default:
                this.orderErrorMessage = "주문 목록 조회 중 오류가 발생했습니다.";
            }
          } else {
            console.error('[ERROR] 응답 자체 없음! 네트워크 문제인가?:', error);
            this.orderErrorMessage = "네트워크 오류 또는 서버 연결에 실패했습니다.";
          }

          this.isLoading = false;
          return false; // 실패 시 false 리턴
        }

      } catch (error: any) {
        // 인증 헤더 생성 실패
        console.error('[ERROR] 인증 헤더 생성 과정에서 대참사 발생:', error);
        this.orderErrorMessage = "주문 목록을 확인할 수 없습니다.";
        this.isLoading = false;
        return false; // 실패 시 false 리턴
      }
    },

    // 오더리스트 새로 불러오기
    async fetchOrderList(params: OrderParams = {}) {
      this.page = 1;
      const updatedParams = { ...params, page: this.page };
      const data = await this.fetchOrderListCommon(updatedParams);
      if (data) {
        this.orderList = data;
        this.orderErrorMessage = null;
        this.page += 1;
        if (data.length < (params.limit || 100)) {
          this.isLastPage = true;
        } else {
          this.isLastPage = false;
        }
      }
    },

    // 오더리스트 추가로 불러오기
    async fetchMore(params: OrderParams = {}) {

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

        if (data.length < (params.limit || 100) || data.length === 0) {
          this.isLastPage = true;
        } else {
          this.isLastPage = false;
        }
      }
    },

    async cancelOrder(uuid: string) {
      this.isLoading = true;
      const authStore = useAuthStore();
      const uid = authStore.user.uid;

      if (!uid) {
        console.error('[ERROR] UID가 존재하지 않음! 인증 불가~');
        this.orderErrorMessage = "등록되지 않은 uid!";
        this.isLoading = false;
        return false;
      }

      try {
        const functions = getFunctions();
        const createAuthHeaderFromDbCall = httpsCallable<
          { queryString?: string | null },
          { authorization: string }
        >(functions, 'createAuthHeaderFromDb');

        const query = `uuid=${uuid}`;
        const authResult = await createAuthHeaderFromDbCall({ queryString: query });

        const config = {
          headers: {
            Authorization: authResult.data.authorization,
          },
        };

        const apiUrl = `https://api.bithumb.com/v1/order?${query}`;

        try {
          const response = await axios.delete(apiUrl, config);
          this.orderErrorMessage = null;
          this.isLoading = false;

          console.log('주문 취소 성공!', response.data);

          // ✅ 취소 기록 Firestore에 랜덤 ID로 저장
          const db = getFirestore();
          const cancelData = {
            ...response.data,
            uid,
            side: 'cancel', // 명시적으로 취소임을 나타냄
            timestamp: Timestamp.now(), // 취소 시점 기록
          };

          const ordersRef = collection(db, 'users', uid, 'orders');
          await addDoc(ordersRef, cancelData);

          return response.data;

        } catch (error: any) {
          console.error('[ERROR] Bithumb API 주문 취소 중 오류 발생:', error);

          if (error.response) {
            switch (error.response.status) {
              case 401:
                this.orderErrorMessage = "API 키 인증에 실패했습니다. 키를 다시 확인해주세요.";
                break;
              case 403:
                this.orderErrorMessage = "접근 권한이 없습니다. API 키 설정을 확인해주세요.";
                break;
              case 400:
                this.orderErrorMessage = "잘못된 요청입니다. UUID를 확인해주세요.";
                break;
              case 404:
                this.orderErrorMessage = "해당 주문을 찾을 수 없습니다.";
                break;
              default:
                this.orderErrorMessage = "주문 취소 중 오류가 발생했습니다.";
            }
          } else {
            this.orderErrorMessage = "네트워크 오류 또는 서버 연결에 실패했습니다.";
          }

          this.isLoading = false;
          return false;
        }

      } catch (error: any) {
        console.error('[ERROR] 인증 헤더 생성 실패:', error);
        this.orderErrorMessage = "주문을 취소할 수 없습니다.";
        this.isLoading = false;
        return false;
      }
    }

  },
});