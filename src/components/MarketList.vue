<template>
  <div>
    <div class="fff2" v-if="visibleMarkets.length">
      <h3>보이는 마켓들:</h3>
      {{ visibleMarkets }}
    </div>
    <button
      @click="createObserver"
      class="bg-blue-500 text-white py-2 px-4 rounded"
    >
      옵저버 실행~
    </button>
    <button
      @click="fetchPriceData()"
      class="bg-blue-500 text-white py-2 px-4 rounded"
    >
      마켓 데이터 불러오기2
    </button>
    
    <!-- 화면에 마켓 데이터 출력 -->
    <MarketListItem
      v-for="item in markets"
      :key="item.market"
      :ref="`item-${item.market}`"
      :data-id="item.market"
      :market="item"
      :isVisible="item.isVisible"
      class="item"
    >
     {{ item }} {{ item.korean_name }} - 가격: {{ item.isVisible || "불러오는 중" }}
    </MarketListItem>

    <!-- 에러 메시지 -->
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import { nextTick } from 'vue'; // nextTick을 가져옵니다.

import MarketListItem from "@/components/MarketListItem.vue";

export default {
  components: {
    MarketListItem, // 객체 형태로 등록
  },
  data() {
    return {
      observer: null, // IntersectionObserver 인스턴스
      visibleMarkets: [], // 화면에 보이는 마켓들

    };
  },
  mounted() {
    this.initApp();

  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
    // fetchMarketsData가 완료된 후 createObserver 실행
    await this.fetchMarketsData();
    this.createObserver();
  },
    async fetchMarketsData() {
      const marketStore = useMarketStore();
      await marketStore.fetchMarkets(); // Pinia store에서 데이터 가져오기
    },
    fetchPriceData() {
      const marketStore = useMarketStore();
      marketStore.fetchPrice(['KRW-BTC', 'KRW-ETH']); 
    },
    
    





    async createObserver() {
  console.log("Observer creation initiated.");
  await this.$nextTick();

  const marketStore = useMarketStore();

  this.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const market = entry.target.getAttribute("data-id");
        if (market) {
          marketStore.updateVisibility(market, entry.isIntersecting);
        }
      });
    },
    { threshold: 0.5 }
  );

  this.markets.forEach((item) => {
    const itemElement = document.querySelector(
      `.item[data-id="${item.market}"]`
    );
    if (itemElement) {
      this.observer.observe(itemElement);
    }
  });

  console.log("Observer created and observing items.");
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
