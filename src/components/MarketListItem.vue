<!-- MarketListItem.vue -->
<template>
  <div
    @click="goToOrderPage"
    class="flex items-center h-16 px-4 rounded-sm cursor-pointer text-white hover:bg-zinc-900"
  >
    <!-- market.isVisible일 때만 이미지 로드 -->
    <Coin :market="market.market" class="w-6 h-6 mr-4" />

    <div class="flex-1">
      <p class="text-base">{{ market.korean_name }}</p>
      <p class="text-xs text-zinc-500">{{ market.market }}</p>
    </div>
    <div class="flex items-center">
      <!-- 로딩 중일 때 돌아가는 애니메이션 -->
      <svg
        v-if="isLoading"
        class="w-6 h-6 text-zinc-500 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 1116 0A8 8 0 014 12z" class="opacity-75" />
      </svg>

      <!-- trade_price가 있으면 세자리마다 쉼표 추가 -->
      <p v-else class="text-base font-medium mr-2">
        ₩ {{ market.trade_price ? market.trade_price.toLocaleString() : '-' }}
      </p>
      
      <p
        :class="[
          'text-base w-20 text-right',
          priceChangeClass
        ]"
      >
        {{ market.priceChangePercent !== null ? market.priceChangePercent : '-' }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import Coin from "@/components/icons/Coin.vue"; // MD5 해시 생성용 라이브러리

interface Market {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning: string | undefined;
  isVisible: boolean;
  trade_price: number | null;
  prev_closing_price: number;
  change: string;
  priceChangePercent: number | null;
}

const props = defineProps<{ market: Market }>();
const router = useRouter();

// 로딩 상태 관리
const isLoading = ref(true);

// 데이터가 들어오면 로딩 종료
watchEffect(() => {
  if (props.market.trade_price !== null && props.market.priceChangePercent !== null) {
    isLoading.value = false;
  }
});

// 주문 페이지 이동
const goToOrderPage = () => {
  router.push(`/order/${props.market.market}`);
};

// 가격 변동 스타일
const priceChangeClass = computed(() => {
  switch (props.market.change) {
    case "RISE":
      return "text-red-500";
    case "FALL":
      return "text-blue-500";
    default:
      return "text-zinc-500";
  }
});
</script>

<style scoped>
.coin-icon {
  font-size: 2rem;
}
</style>
