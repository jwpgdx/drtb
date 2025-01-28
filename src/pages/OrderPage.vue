<!-- @/pages/OrderPage.vue -->

<template>
  <div>
    <OrderHeader />
    <Tabs default-value="order">
      <TabsList>
        <TabsTrigger value="order">
          <hand-coins class="w-6 h-6" />거래</TabsTrigger
        >
        <TabsTrigger value="chart"
          ><chart-candlestick class="w-6 h-6" />차트</TabsTrigger
        >
      </TabsList>
      <TabsContent value="order">
        <Order v-if="isAuthenticated" />
        <Auth404 v-else />
      </TabsContent>
      <TabsContent value="chart">
        <Error404 />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import { useOrderStore } from "@/stores/order-store"; // Pinia store 가져오기
import { useOrderChanceStore } from "@/stores/order-chance-store"; // Pinia store 가져오기

import { useAuthStore } from "@/stores/auth-store"; // Pinia store 가져오기
import { useRoute } from "vue-router"; // vue-router의 useRoute 훅을 가져옴
import OrderHeader from "@/components/order/OrderHeader.vue";
import Auth404 from "@/components/Auth404.vue";
import Order from "@/components/order/Order.vue";
import Error404 from "@/components/Error404.vue";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartCandlestick, HandCoins } from "lucide-vue-next";

const marketStore = useMarketStore();
const orderStore = useOrderStore();
const orderChanceStore = useOrderChanceStore();


const authStore = useAuthStore();

// 라우터 설정
const route = useRoute();
const marketParam = computed(() => route.params.market as string);

const isAuthenticated = computed(() => authStore.isAuthenticated);

// 인터벌 ID를 ref로 선언
const intervalId = ref<NodeJS.Timeout | null>(null);

async function authValidated() {
  // 마켓 데이터 가져오기
  if (marketParam.value) {
    orderChanceStore.fetchOrderChance(marketParam.value);
  }
}

// 가격 갱신
function startPriceUpdate() {
  intervalId.value = setInterval(() => {
    marketStore.fetchPriceForOrderMarket();
  }, 1000); // 1초마다 갱신
}
const markets = computed(() => marketStore.markets);

// 생명 주기
onMounted(async () => {
  if (markets.value.length === 0) {
    await marketStore.fetchMarkets(); // 1. fetchMarkets
  }
  await marketStore.setOrderMarket(marketParam.value); // 2. setOrderMarket
  await marketStore.fetchPriceForOrderMarket(); // 3. initOrderStore
  await orderStore.initOrderStore();

  if (isAuthenticated.value) {
    authValidated();
  }
  // 가격 갱신 시작
  startPriceUpdate();
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value); // 컴포넌트 언마운트 시 interval 정리
  }
});
</script>
