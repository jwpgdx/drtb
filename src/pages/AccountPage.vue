<!-- @/pages/OrderPage.vue -->

<template>
  <div>
    <OrderHeader :filteredMarket="filteredMarket" />
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
        <Order :filteredMarket="filteredMarket" v-if="isAuthenticated" />
        <Auth404 v-else />
      </TabsContent>
      <TabsContent value="chart">
      <Error404/>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import { useAccountStore } from "@/stores/account-store"; // Pinia store 가져오기
import { useOrderStore } from "@/stores/order-store"; // Pinia store 가져오기

import { useAuthStore } from "@/stores/auth-store"; // Pinia store 가져오기
import { useRoute } from "vue-router"; // vue-router의 useRoute 훅을 가져옴
import OrderHeader from "@/components/order/OrderHeader.vue";
import Auth404 from "@/components/Auth404.vue";
import Order from "@/components/order/Order.vue";
import Error404 from "@/components/Error404.vue";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartCandlestick, HandCoins } from "lucide-vue-next";

const marketStore = useMarketStore();
const accountStore = useAccountStore();
const orderStore = useOrderStore();

const authStore = useAuthStore();

const route = useRoute();
const marketParam = computed(() => route.params.market as string);

const markets = computed(() => marketStore.markets);
const errorMessage = computed(() => marketStore.errorMessage);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const filteredMarket = computed(() => {
  return markets.value.find((market) => market.market === marketParam.value);
});
const formattedTradePrice = computed(() => {
  const price = filteredMarket.value?.trade_price;
  return price ? price.toLocaleString("en-US") : "-"; // 값이 없으면 "-" 표시
});
// 인터벌 ID를 ref로 선언
const intervalId = ref<NodeJS.Timeout | null>(null);

async function authValidated() {
  // 마켓 데이터 가져오기
  if (marketParam.value) {
    await accountStore.fetchAccountData(); // 계정 데이터 가져오기
    accountStore.setMarketLocked(marketParam.value);
    orderStore.fetchOrderChance(marketParam.value);
  }
}

// 가격 갱신
function startPriceUpdate() {
  if (marketParam.value) {
    marketStore.fetchPrice([marketParam.value]);
    intervalId.value = setInterval(() => {
      marketStore.fetchPrice([marketParam.value]);
    }, 1000); // 5초마다 갱신
  }
}
// 생명 주기
onMounted(async () => {
  await marketStore.fetchMarkets(); // 마켓 정보 가져오기
  if (isAuthenticated.value) {
    authValidated();
  }
  startPriceUpdate(); // 가격 갱신 시작
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value); // 컴포넌트 언마운트 시 interval 정리
  }
});
</script>
