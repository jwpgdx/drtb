<template>
  <div class="market">
    <p>{{ market.korean_name }}</p>
    <p v-if="isVisible">보이는 중</p>
    <p v-else>보이지 않음</p>

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

const props = defineProps<{ market: Market; isVisible: boolean }>();

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

// 가격 정보를 가져오는 함수
const fetchPrice = (market: string) => {
  const randomPrice = generateRandomPrice();
  return new Promise<number>((resolve) => {
    setTimeout(() => resolve(randomPrice), 1000); // 1초 뒤에 가격 값 반환
  });
};

// isVisible이 true일 때 가격 정보 가져오기
watch(
  () => props.isVisible,
  async (newVal) => {
    if (newVal) {
      targetPrice.value = await fetchPrice(props.market.market);
      if (targetPrice.value !== null) {
        animatePrice(targetPrice.value); // 애니메이션 시작
      }
    } else {
      targetPrice.value = null;
      displayPrice.value = null; // 안 보이면 가격 초기화
    }
  },
  { immediate: true } // 컴포넌트 초기화 시에도 실행
);

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
