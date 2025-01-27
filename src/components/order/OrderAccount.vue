<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <!-- 보유자산 -->
    <p class="text-2xl font-semibold mb-4">보유 자산</p>

    <div v-if="orderChance && orderChance.bid_account.balance > 0" class="flex justify-between mb-2">
      <span class="font-medium">보유 금액</span>
      <span>{{ formatAmount(Math.floor(parseFloat(orderChance.bid_account.balance))) }} {{ orderChance.bid_account.currency }}</span>
    </div>

    <div v-if="orderChance && orderChance.ask_account.locked > 0" class="flex justify-between mb-2">
      <span class="font-medium">보유 코인</span>
      <span>{{ orderChance.ask_account.locked }} ({{ orderChance.ask_account.currency }})</span>
    </div>

    <div class="flex justify-between mb-2">
      <span class="font-medium">평균매수가</span>
      <span>{{ formatAmount(parseFloat(orderChance.ask_account.avg_buy_price)) }} {{ orderChance.bid_account.currency }}</span>
    </div>

    <div class="flex justify-between mb-2">
      <span class="font-medium">평가금액</span>
      <span>{{ evaluationAmount }} {{ orderChance.bid_account.currency }}</span>
    </div>

    <!-- 수익률 -->
    <div class="flex justify-between mb-4">
      <span class="font-medium">수익률</span>
      <span :class="profitRateClass">{{ formattedProfitRate }}%</span>
    </div>
    <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

    <div class="flex justify-between mb-2">
      <span class="font-medium">최소 주문금액</span>
      <span>{{ orderChance.market.bid.min_total }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  orderChance: {
    type: Object,
    required: true,
  },
  orderMarket: {
    type: Object,
    required: false,
    default: () => ({ value: { trade_price: 0, change: "EVEN" } }), // Default structure
  },
});

// 평가금액 계산 (보유 코인 * 현재 가격)
const evaluationAmount = computed(() => {
  const lockedAmount = parseFloat(props.orderChance.ask_account.locked);
  const currentPrice = parseFloat(props.orderMarket.trade_price);
  const amount = lockedAmount * currentPrice;
  return Math.floor(amount).toLocaleString(); // 소수점 아래 버리고 세자리마다 쉼표 추가
});

// 수익률 계산 ((현재 가격 - 평균 매수가) / 평균 매수가) * 100
const profitRate = computed(() => {
  const currentPrice = parseFloat(props.orderMarket.trade_price);
  const avgBuyPrice = parseFloat(props.orderChance.ask_account.avg_buy_price);
  if (avgBuyPrice === 0) return 0; // 평균 매수가가 0인 경우 수익률 0%
  return ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100;
});

// 수익률 값 포맷 (소수점 2자리까지)
const formattedProfitRate = computed(() => profitRate.value.toFixed(2));

// 수익률에 따른 색상 클래스 계산
const profitRateClass = computed(() => {
  const rate = profitRate.value;  // 수익률 값을 직접 가져옵니다.
  if (rate > 0) return "text-green-500";  // 플러스일 경우 녹색
  if (rate < 0) return "text-red-500";   // 마이너스일 경우 빨간색
  return "text-gray-500";                 // 0%일 경우 회색
});

// 금액 계산 (세자리마다 쉼표 추가)
const formatAmount = (amount: number) => amount.toLocaleString();
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
