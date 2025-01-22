<template>
  <div>
    <!--{{ filteredMarket }}-->

    <Tabs default-value="order">
      <div class="flex justify-between w-full">
        <div>
          <p class="font-semibold text-4xl">{{ formattedTradePrice }}</p>

          <div
            v-if="filteredMarket.change"
            :class="{
              'text-red-500': filteredMarket.change === 'RISE',
              'text-gray-500': filteredMarket.change === 'EVEN',
              'text-blue-500': filteredMarket.change === 'FALL',
            }"
            class="flex gap-1 items-center"
          >
            <component
              :is="getIconComponent(filteredMarket.change)"
              class="w-4 h-4"
            />
            <div class="flex items-center">
              <p class="text-sm">{{ filteredMarket.priceChangePercent }}</p>
              <percent class="w-3 h-3" />
            </div>
          </div>
        </div>
        <div class="w-fit">
          <TabsList>
            <TabsTrigger value="order">
              <hand-coins class="w-6 h-6" /> 거래
            </TabsTrigger>
            <TabsTrigger value="chart">
              <chart-candlestick class="w-6 h-6" /> 차트
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="order">
        <div class="flex border-b">
          <!-- 각 탭을 클릭하면 activeTab 변경 -->
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{
              'text-blue-500 border-b-2 border-blue-500': activeTab === tab,
              'text-gray-500': activeTab !== tab,
            }"
            class="py-2 px-4 focus:outline-none"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- 탭 내용 표시 -->
        <div class="mt-4">
          <Order
            v-if="activeTab === tabs[0]"
            side="bid"
            :market="marketParam"
            :currentPrice="filteredMarket.trade_price"
          />
          <Order
            v-if="activeTab === tabs[1]"
            side="ask"
            :market="marketParam"
            :currentPrice="filteredMarket.trade_price"
          />

          <OrderList :market="marketParam" v-if="activeTab === tabs[2]" />
        </div>
      </TabsContent>
      <TabsContent value="chart"> Change your password here. </TabsContent>
    </Tabs>

    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import { useRoute } from "vue-router"; // vue-router의 useRoute 훅을 가져옴
import Order from "@/components/Order.vue"; // vue-router의 useRoute 훅을 가져옴
import OrderList from "@/components/OrderList.vue"; // vue-router의 useRoute 훅을 가져옴

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  ChartCandlestick,
  HandCoins,
  Percent,
  Asterisk,
} from "lucide-vue-next";

const marketStore = useMarketStore();
const route = useRoute();
const marketParam = computed(() => route.params.market as string);

const tabs = ["매수", "매도", "거래내역"]; // 탭 제목 배열
const activeTab = ref(tabs[0]); // 기본 활성화된 탭

// computed
const markets = computed(() => marketStore.markets);
const errorMessage = computed(() => marketStore.errorMessage);
const filteredMarket = computed(() => {
  return markets.value.find((market) => market.market === marketParam.value);
});
const formattedTradePrice = computed(() => {
  const price = filteredMarket.value?.trade_price;
  return price ? price.toLocaleString("en-US") : "-"; // 값이 없으면 "-" 표시
});
const getIconComponent = (change) => {
  switch (change) {
    case "RISE":
      return TrendingUp;
    case "EVEN":
      return Asterisk;
    case "FALL":
      return TrendingDown;
    default:
      return null;
  }
};
// 인터벌 ID를 ref로 선언
const intervalId = ref<NodeJS.Timeout | null>(null);

// 앱 초기화
async function initApp() {
  await fetchMarketsData();
  if (marketParam.value) {
    fetchPriceData(marketParam.value); // 하나의 마켓만 가격 갱신
  }
}

// 마켓 데이터 가져오기
async function fetchMarketsData() {
  await marketStore.fetchMarkets(); // Pinia store에서 데이터 가져오기
}

// 가격 갱신
function startPriceUpdate() {
  intervalId.value = setInterval(() => {
    if (marketParam.value) {
      fetchPriceData(marketParam.value); // 하나의 마켓만 가격 갱신
    }
  }, 1000); // 5초마다 갱신
}

// 가격 데이터 가져오기
function fetchPriceData(market: string) {
  marketStore.fetchPrice([market]); // 이제 배열을 넘길 필요 없이 직접 한 마켓만 처리
}

// 생명 주기
onMounted(() => {
  initApp();
  startPriceUpdate(); // 가격 갱신 시작
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value); // 컴포넌트 언마운트 시 interval 정리
  }
});
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
