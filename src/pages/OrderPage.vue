<template>
  <div>
    {{ filteredMarket }}
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import { useRoute } from "vue-router"; // vue-router의 useRoute 훅을 가져옴

const marketStore = useMarketStore();
const route = useRoute();
const marketParam = computed(() => route.params.market as string);

// computed
const markets = computed(() => marketStore.markets);
const errorMessage = computed(() => marketStore.errorMessage);
const filteredMarket = computed(() => {
  return markets.value.find((market) => market.market === marketParam.value);
});

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
  }, 5000); // 5초마다 갱신
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
