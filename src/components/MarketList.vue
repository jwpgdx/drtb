<!-- MarketList.vue -->
<template>
  <div>
    <!-- 마켓 리스트와 광고 -->
    <template v-for="(market, index) in filteredMarkets" :key="market.market">
      <!-- 마켓 아이템 -->
      <MarketListItem
        :data-id="market.market"
        :market="market"
        class="market"
      />
    </template>

    <!-- 에러 메시지 -->
    <ErrorState v-if="errorMessage" image="content" :content="errorMessage">
      <template #action>
        <button
          class="px-4 border border-orange-500 text-orange-500 text-sm rounded-3xl h-8"
          @click="handleRetry"
        >
          재시도
        </button>
      </template>
    </ErrorState>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
} from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import MarketListItem from "@/components/MarketListItem.vue";
import ErrorState from "@/components/ErrorState.vue";

// store 사용
const marketStore = useMarketStore();

// reactive/observable 데이터
const observer = ref<IntersectionObserver | null>(null);
const visibleMarkets = ref<string[]>([]);

const props = defineProps<{
  filterQuery: string;
}>();

// computed
const markets = computed(() => marketStore.markets);
const errorMessage = computed(() => marketStore.errorMessage);

const isMounted = ref(false);

// 필터링된 마켓 목록
const filteredMarkets = computed(() => {
  if (!props.filterQuery) {
    return markets.value;
  }
  return markets.value.filter((market) => {
    const query = props.filterQuery.toLowerCase();
    return (
      market.market.toLowerCase().includes(query) ||
      market.korean_name.toLowerCase().includes(query) ||
      market.english_name.toLowerCase().includes(query)
    );
  });
});

// 화면에 보이는 마켓에 대해 가격 갱신
watch(visibleMarkets, (newVisibleMarkets) => {
  if (newVisibleMarkets.length > 0) {
    fetchPriceData(newVisibleMarkets);
  }
});

// 화면에 보이는 마켓의 변경을 감지하고 옵저버를 다시 설정
watch(
  filteredMarkets,
  () => {
    if (observer.value) {
      observer.value.disconnect(); // 기존 옵저버 종료
    }
    createObserver(); // 새로운 옵저버 생성
  },
  { immediate: true }
);

// onMounted와 onBeforeUnmount로 생명 주기 메서드 처리
onMounted(() => {
  createObserver();
  startPriceUpdate(); // 가격 갱신 시작

  isMounted.value = true;
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
async function createObserver() {
  await nextTick(); // DOM 업데이트가 완료되면 옵저버를 설정

  // 기존 옵저버가 있을 경우, 먼저 종료시킴
  if (observer.value) {
    observer.value.disconnect();
  }

  // 새로운 옵저버를 설정
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

  // 새로운 filteredMarkets에 대해서만 옵저버를 설정
  document.querySelectorAll(".market[data-id]").forEach((marketElement) => {
    observer.value?.observe(marketElement);
  });
}

const handleRetry = async () => {
  // 에러 메시지 초기화
  marketStore.$reset(); // 또는 marketStore.clearError() 같은 커스텀 액션 사용

  // 마켓 데이터 다시 불러오기
  try {
    await marketStore.fetchMarkets(); // 마켓 리스트 재요청
    if (visibleMarkets.value.length > 0) {
      await fetchPriceData(visibleMarkets.value); // 가격 데이터 재요청
    }
  } catch (error) {
    console.error("Retry failed:", error);
  }
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.ad-container {
  min-height: 100px;
  width: 100%;
}
</style>
