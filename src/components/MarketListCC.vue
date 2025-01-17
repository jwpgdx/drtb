<template>
  <div>
    <div>
      <h2>Pinia에 저장된 시장 정보:</h2>
      <li v-for="market in visibleMarkets" :key="market.market">
        {{ market }}
      </li>
    </div>

    <div class="scroller" ref="scroller">
      <MarketListItem
        v-for="item in items"
        :key="item.market"
        :ref="`item-${item.market}`"
        :data-id="item.market"
        :market="item"
        :isVisible="item.isVisible"
        class="item"
      >
        {{ item.korean_name }} - 가격: {{ item.isVisible || "불러오는 중" }}
      </MarketListItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { nextTick } from "vue";
import MarketListItem from "@/components/MarketListItem.vue";
import { useMarketStore } from "@/stores/market-store.ts";

interface Item {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning: string;
  isVisible: boolean; // isVisible 속성 추가
}

const items = ref<Item[]>([]);
const marketStore = useMarketStore();
const visibleMarkets = marketStore.visibleMarkets;

const fetchMarkets = async () => {
  try {
    const options = { method: "GET", headers: { accept: "application/json" } };
    const response = await fetch(
      "https://api.bithumb.com/v1/market/all?isDetails=false",
      options
    );
    const data = await response.json();
    items.value = data;
  } catch (error) {
    console.error("Error fetching markets:", error);
    errorMessage.value = "Markets 정보를 가져오는데 실패했습니다.";
  }
};

const observer = ref<IntersectionObserver | null>(null);

// IntersectionObserver로 아이템 추적
const createObserver = async () => {
  console.log("createObserver called");

  await nextTick(); // DOM 업데이트 후 실행
  console.log("DOM updated, starting observer creation");

  observer.value = new IntersectionObserver(
    (entries) => {
      console.log("IntersectionObserver callback triggered");
      entries.forEach((entry) => {
        const market = entry.target.getAttribute("data-id");
        console.log(
          `Checking entry: ${market}, isIntersecting: ${entry.isIntersecting}`
        );

        if (market) {
          const item = items.value.find((item) => item.market === market);
          if (item) {
            item.isVisible = entry.isIntersecting; // 화면에 보이는 상태 업데이트

            if (entry.isIntersecting) {
              // 화면에 보일 때만 marketStore에 추가
              marketStore.addMarket(item); // 보이는 마켓만 추가
            } else {
              // 화면에서 사라지면 marketStore에서 제거
              marketStore.removeMarket(item.market); // 사라진 마켓 제거
            }

            console.log(`Market ${market} visibility: ${item.isVisible}`);
          } else {
            console.warn(`Market ${market} not found in items`);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  console.log("Observer created:", observer.value);

  items.value.forEach((item) => {
    console.log(`Processing item: ${item.market}`);
    const itemElement = document.querySelector(
      `.item[data-id="${item.market}"]`
    );
    console.log(`Element found for market ${item.market}:`, itemElement);
    if (itemElement) {
      console.log(`Observing element for market: ${item.market}`);
      observer.value.observe(itemElement);
    } else {
      console.warn(`Element not found for market: ${item.market}`);
    }
  });
};

onMounted(async () => {
  console.log("Fetching markets...");
  await fetchMarkets(); // 데이터를 먼저 가져옴
  console.log("Markets fetched, creating observer...");
  createObserver(); // 데이터를 가져온 후 observer 생성
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style scoped>
.scroller {
  height: 500px;
  overflow-y: auto;
}
.item {
  height: 120px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
