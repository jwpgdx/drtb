<template>
  <div class="market">
    <p>{{ market.korean_name }}</p>
    <p>{{ market.market }}</p>

    <div :class="market.change">
      <!-- EVEN, RISE, FALL -->

      <p>{{ market.trade_price }}</p>

      <!-- 퍼센트 변화 출력 -->
      <p v-if="percentageChange !== null">
        {{ percentageChange > 0 ? "+" : percentageChange < 0 ? "-" : "" }}
        {{ percentageChange.toFixed(2) }}%
      </p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, computed } from "vue";

interface Market {
  market: string;
  korean_name: string;
  english_name: string;
  isVisible: boolean;
  trade_price: number; // 종가(현재가)
  prev_closing_price: number; // 전일 종가(KST 0시 기준)
  change: string; //EVEN : 보합, RISE : 상승, FALL : 하락
}

const props = defineProps<{ market: Market }>();

// 퍼센트 변화 계산
const percentageChange = computed(() => {
  const tradePrice = props.market.trade_price;
  const prevClosingPrice = props.market.prev_closing_price;

  if (prevClosingPrice === 0) return null; // 전일 종가가 0이면 계산 불가

  return ((tradePrice - prevClosingPrice) / prevClosingPrice) * 100;
});
</script>

<style scoped>
.market {
  height: 120px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
