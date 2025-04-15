<template>
  <div class="max-w-4xl mx-auto p-6  shadow-md rounded-lg">
    <!-- 보유자산 -->
    <p class="text-2xl font-semibold mb-4">보유 자산</p>
    <div
      class="flex justify-between mb-2"
    >
      <span class="font-medium">보유 22금액</span>
      <span>{{ formattedBidBalance }}
        {{ bidCurrency }}</span
      >
    </div>

    <div class="flex justify-between mb-2">
      <span class="font-medium">보유 코인</span>
      <span>{{ askBalance }} ({{ askCurrency }})</span>
    </div>

    <div class="flex justify-between mb-2">
      <span class="font-medium">평균매수가</span>
      <span
        >{{ formattedAskAvgBuyPrice }}
        {{ bidCurrency }}</span
      >
    </div>

    <div class="flex justify-between mb-2">
      <span class="font-medium">평가금액</span>
      <span>{{ evaluationAmount }} {{ bidCurrency }}</span>
    </div>

    <!-- 수익률 -->
    <div class="flex justify-between mb-4">
      <span class="font-medium">수익률</span>
      <span :class="profitRateClass">{{ formattedProfitRate }}%</span>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useOrderChanceStore } from "@/stores/order-chance-store";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import { formatPrice, formatTotal } from "@/utils/format";

const orderChanceStore = useOrderChanceStore();
const marketStore = useMarketStore();
const orderMarket = computed(() => marketStore.orderMarket);
const bidBalance = computed(() => orderChanceStore.bidBalance);
const bidCurrency = computed(() => orderChanceStore.bidCurrency);
const askBalance = computed(() => orderChanceStore.askBalance);
const askCurrency = computed(() => orderChanceStore.askCurrency);
const askAvgBuyPrice = computed(() => orderChanceStore.askAvgBuyPrice);


// 평가금액 계산 (보유 코인 * 현재 가격)
const evaluationAmount = computed(() => {
  const balanceAmount = parseFloat(askBalance.value);
  const currentPrice = orderMarket.value?.trade_price ?? 0; // 값이 없으면 0으로 처리
  const amount = balanceAmount * currentPrice;
  return amount; // 소수점 아래 버리고 세자리마다 쉼표 추가
});

// 수익률 계산 ((현재 가격 - 평균 매수가) / 평균 매수가) * 100
const profitRate = computed(() => {
  const currentPrice = orderMarket.value?.trade_price ?? 0; // 값이 없으면 0으로 처리
  const avgBuyPrice = parseFloat(askAvgBuyPrice.value);
  if (avgBuyPrice === 0) return 0; // 평균 매수가가 0인 경우 수익률 0%
  return ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100;
});

// 수익률 값 포맷 (소수점 2자리까지)
const formattedProfitRate = computed(() => profitRate.value.toFixed(2));

// 수익률에 따른 색상 클래스 계산
const profitRateClass = computed(() => {
  const rate = profitRate.value; // 수익률 값을 직접 가져옵니다.
  if (rate > 0) return "text-green-500"; // 플러스일 경우 녹색
  if (rate < 0) return "text-red-500"; // 마이너스일 경우 빨간색
  return "text-zinc-500"; // 0%일 경우 회색
});

const formattedBidBalance = computed(() => formatTotal(bidBalance.value));
const formattedAskAvgBuyPrice = computed(() => formatTotal(askAvgBuyPrice.value));
</script>

<style scoped>
.bg-beige {
  background-color: beige;
}

.bg-burlywood {
  background-color: burlywood;
}

.bg-cornsilk {
  background-color: cornsilk;
}
</style>
