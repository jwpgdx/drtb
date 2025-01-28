<template>
    <div>
      <button @click="startAutoUpdate">호가 정보 자동 갱신 시작</button>
      <button @click="stopAutoUpdate">호가 정보 자동 갱신 멈추기</button>
  
      <div v-if="orderbook">
        <!-- 주문서 표시 -->
        <p>Market: {{ orderbook.market }}</p>
        <p>Timestamp: {{ orderbook.timestamp }}</p>
        <p>Market Price: {{ marketPrice }}</p>  <!-- 최신 시장 가격 표시 -->
        <!-- 다른 필드들도 표시 -->
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, onBeforeUnmount } from 'vue';
  import { useOrderBookStore } from '@/stores/order-book-store'; 
  
  const orderbookStore = useOrderBookStore();
  const market: string = 'BTC_KRW';  // 예시로 'BTC_KRW' 마켓 사용
  let intervalId: NodeJS.Timeout | null = null;  // setInterval의 반환 타입
  
  // 자동 갱신 시작
  const startAutoUpdate = (): void => {
    intervalId = setInterval(() => {
      orderbookStore.fetchOrderbook(market); // 1초마다 호출
    }, 1000);  // 1000ms = 1초
  };
  
  // 자동 갱신 멈추기
  const stopAutoUpdate = (): void => {
    if (intervalId) {
      clearInterval(intervalId); // 자동 갱신 멈추기
      intervalId = null;
    }
  };
  
  onMounted(() => {
    // 초기 로드 시 호가 정보 자동 갱신 시작
    startAutoUpdate();
  });
  
  onBeforeUnmount(() => {
    // 컴포넌트가 unmounted 될 때 자동 갱신 중지
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
  
  const orderbook = computed(() => orderbookStore.getOrderbook);
  const marketPrice = computed(() => orderbookStore.getMarketPrice);  // 시장 가격을 가져오기
  </script>
  