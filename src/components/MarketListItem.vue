<template>
  <div class="market">
    <p>{{ market }}</p>

    <slot/>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from "vue";

interface Market {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning: string;
}

const props = defineProps<{ market: Market; }>();

// 가격 상태
const targetPrice = ref<number | null>(null); // 목표 가격
const displayPrice = ref<number | null>(null); // 화면에 표시될 가격

// 가격 정보를 랜덤하게 생성하는 함수
const generateRandomPrice = () => Math.floor(Math.random() * 10000) + 1000;

// 애니메이션으로 가격을 점진적으로 올리는 함수
const animatePrice = (newPrice: number) => {
  if (displayPrice.value === null) {
    displayPrice.value = 0; // 초기화
  }
  const step = Math.ceil(Math.abs(newPrice - (displayPrice.value ?? 0)) / 20); // 속도 조절

  const interval = setInterval(() => {
    if (displayPrice.value === null) return;

    if (displayPrice.value < newPrice) {
      displayPrice.value = Math.min(displayPrice.value + step, newPrice);
    } else {
      clearInterval(interval); // 목표 값에 도달하면 애니메이션 종료
    }
  }, 50); // 50ms마다 업데이트
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
}
</style>
