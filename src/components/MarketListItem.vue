<template>
  <div class="market" @click="goToOrderPage">
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
import { defineProps, computed } from "vue";
import { useRouter } from "vue-router"; // useRouter 훅을 임포트

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
const router = useRouter(); // router 인스턴스를 가져옴

// 퍼센트 변화 계산
const percentageChange = computed(() => {
  const tradePrice = props.market.trade_price;
  const prevClosingPrice = props.market.prev_closing_price;

  if (prevClosingPrice === 0) return null; // 전일 종가가 0이면 계산 불가

  return ((tradePrice - prevClosingPrice) / prevClosingPrice) * 100;
});

// 클릭 시 주문 페이지로 이동
const goToOrderPage = () => {
  router.push(`/order/${props.market.market}`);
};
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
  cursor: pointer; /* 클릭 가능한 느낌을 주기 위해 포인터 커서 추가 */
}

.router-link-active {
  font-weight: bold;
}
</style>
