<template>
  <div>
    <MarketListItem
      v-for="market in markets"
      :key="market.market"
      :data-id="market.market"
      :market="market"
      class="market"
    >
    </MarketListItem>

    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import MarketListItem from "@/components/MarketListItem.vue";

// store 사용
const marketStore = useMarketStore();

// reactive/observable 데이터
const observer = ref<IntersectionObserver | null>(null);
const visibleMarkets = ref<string[]>([]);

// computed
const markets = computed(() => marketStore.markets);
const errorMessage = computed(() => marketStore.errorMessage);

// 화면에 보이는 마켓에 대해 가격 갱신
watch(visibleMarkets, (newVisibleMarkets) => {
  if (newVisibleMarkets.length > 0) {
    fetchPriceData(newVisibleMarkets);
  }
});

// onMounted와 onBeforeUnmount로 생명 주기 메서드 처리
onMounted(() => {
  initApp();
  startPriceUpdate(); // 가격 갱신 시작
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
  if (intervalId.value) {
    clearInterval(intervalId.value); // 컴포넌트 언마운트 시 interval 정리
  }
});

// 인터벌 ID를 ref로 선언
const intervalId = ref<NodeJS.Timeout | null>(null);

// 앱 초기화
async function initApp() {
  await fetchMarketsData();
  createObserver();
}

// 마켓 데이터 가져오기
async function fetchMarketsData() {
  await marketStore.fetchMarkets(); // Pinia store에서 데이터 가져오기
}

// 가격 갱신
function startPriceUpdate() {
  intervalId.value = setInterval(() => {
    if (visibleMarkets.value.length > 0) {
      fetchPriceData(visibleMarkets.value); // 보이는 마켓만 가격 갱신
    }
  }, 5000); // 5초마다 갱신
}

// 가격 데이터 가져오기
function fetchPriceData(markets: string[]) {
  marketStore.fetchPrice(markets);
}

// IntersectionObserver 생성
function createObserver() {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const market = entry.target.getAttribute("data-id");
        if (market) {
          marketStore.updateVisibility(market, entry.isIntersecting);

          // 화면에 보이게 되면 visibleMarkets에 추가
          if (entry.isIntersecting && !visibleMarkets.value.includes(market)) {
            visibleMarkets.value.push(market);
          }

          // 화면에서 사라지면 visibleMarkets에서 제거
          if (!entry.isIntersecting) {
            visibleMarkets.value = visibleMarkets.value.filter(
              (item) => item !== market
            );
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  markets.value.forEach((market) => {
    const marketElement = document.querySelector(
      `.market[data-id="${market.market}"]`
    );
    if (marketElement) {
      observer.value.observe(marketElement);
    }
  });
}
</script>

<style scoped>
.text-red-500 {
  color: red;
}
.bg-blue-500 {
  background-color: #3b82f6;
}
.text-white {
  color: white;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.rounded {
  border-radius: 0.375rem;
}
.fff2 {
  position: fixed;
  display: block;
  width: 400px;
  background-color: antiquewhite;
  top: 40px;
  left: 0;
}
</style>
