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

<script>
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import MarketListItem from "@/components/MarketListItem.vue";

export default {
  // todo 에러 메세지 출력 시 404 적용 할 것.
  components: {
    MarketListItem, // 객체 형태로 등록
  },
  data() {
    return {
      observer: null, // IntersectionObserver 인스턴스
      visibleMarkets: [], // 화면에 보이는 마켓들을 저장
    };
  },
  mounted() {
    this.initApp();
    this.startPriceUpdate(); // 가격 갱신 시작
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId); // 컴포넌트 언마운트 시 interval 정리
    }
  },
  watch: {
    visibleMarkets(newVisibleMarkets) {
      // visibleMarkets가 업데이트되면 가격 정보 받아오기
      if (newVisibleMarkets.length > 0) {
        this.fetchPriceData(newVisibleMarkets);
      }
    },
  },
  computed: {
    markets() {
      const marketStore = useMarketStore();
      return marketStore.markets;
    },
    errorMessage() {
      const marketStore = useMarketStore();
      return marketStore.errorMessage;
    },
  },
  methods: {
    async initApp() {
      await this.fetchMarketsData();
      this.createObserver();
    },
    async fetchMarketsData() {
      const marketStore = useMarketStore();
      await marketStore.fetchMarkets(); // Pinia store에서 데이터 가져오기
    },
    startPriceUpdate() {
      this.intervalId = setInterval(() => {
        if (this.visibleMarkets.length > 0) {
          this.fetchPriceData(this.visibleMarkets); // 보이는 마켓만 가격 갱신
        }
      }, 5000); // 5초마다 갱신
    },

    fetchPriceData(markets) {
      const marketStore = useMarketStore();
      marketStore.fetchPrice(markets);
    },
    createObserver() {
      const marketStore = useMarketStore();

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const market = entry.target.getAttribute("data-id");
            if (market) {
              marketStore.updateVisibility(market, entry.isIntersecting);

              // 화면에 보이게 되면 visibleMarkets에 추가
              if (
                entry.isIntersecting &&
                !this.visibleMarkets.includes(market)
              ) {
                this.visibleMarkets.push(market);
              }

              // 화면에서 사라지면 visibleMarkets에서 제거
              if (!entry.isIntersecting) {
                this.visibleMarkets = this.visibleMarkets.filter(
                  (item) => item !== market
                );
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      this.markets.forEach((market) => {
        const marketElement = document.querySelector(
          `.market[data-id="${market.market}"]`
        );
        if (marketElement) {
          this.observer.observe(marketElement);
        }
      });
    },
  },
};
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
