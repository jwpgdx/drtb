<template>
  <div>
    <!-- 필터 입력창 -->
    <div class="relative w-full items-center mb-4">
      <Input v-model="filterQuery" id="search" type="text" placeholder="Search..." class="pl-10" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

    <!-- 마켓 리스트와 광고 -->
    <template v-for="(market, index) in filteredMarkets" :key="market.market">
      <!-- 마켓 아이템 -->
      <MarketListItem
        :data-id="market.market"
        :market="market"
        class="market"
      />
      
      <!-- 광고 삽입 (10개 아이템마다) -->
      <div v-if="index === 2" class="ad-container my-4">
        <div v-if="isMounted">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-format="fluid"
               data-ad-layout-key="-fb+5w+4e-db+86"
               data-ad-client="ca-pub-3125100873852926"
               data-ad-slot="1012762984"></ins>
        </div>
      </div>
    </template>

    <!-- 에러 메시지 -->
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import MarketListItem from "@/components/MarketListItem.vue";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
// store 사용
const marketStore = useMarketStore();

// reactive/observable 데이터
const observer = ref<IntersectionObserver | null>(null);
const visibleMarkets = ref<string[]>([]);

// 필터 입력값
const filterQuery = ref('');

// computed
const markets = computed(() => marketStore.markets);
const errorMessage = computed(() => marketStore.errorMessage);

const isMounted = ref(false);

// 필터링된 마켓 목록
const filteredMarkets = computed(() => {
  if (!filterQuery.value) {
    return markets.value;
  }
  return markets.value.filter(market => {
    const query = filterQuery.value.toLowerCase();
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
watch(filteredMarkets, () => {
  if (observer.value) {
    observer.value.disconnect(); // 기존 옵저버 종료
  }
  createObserver(); // 새로운 옵저버 생성
  nextTick(() => {
    initAds(); // 광고 초기화
  });
}, { immediate: true });

// onMounted와 onBeforeUnmount로 생명 주기 메서드 처리
onMounted(() => {
  createObserver();
  startPriceUpdate(); // 가격 갱신 시작
  
  isMounted.value = true;
  nextTick(() => {
    initAds(); // 광고 초기화
  });
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

// 광고 초기화
function initAds() {
  nextTick(() => {
    // 광고가 이미 표시되었는지 확인
    if (window.adsbygoogle && window.adsbygoogle.length === 0) {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  });
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
  document.querySelectorAll('.market[data-id]').forEach((marketElement) => {
    observer.value?.observe(marketElement);
  });
}
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