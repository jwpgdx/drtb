<template>
  <div
    @click="goToOrderPage"
    class="flex items-center p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
  >
    <i
      :class="`cf cf-${market.market.replace('KRW-', '').toLowerCase() || 'btc'}`"
      class="coin-icon mr-4"
    ></i>
    <div class="flex-1">
      <p class="text-lg font-semibold">{{ market.korean_name }}</p>
      <p class="text-sm text-gray-500">{{ market.market }}</p>
    </div>
    <div class="flex items-center">
      <!-- 로딩 중일 때 돌아가는 애니메이션 -->
      <svg
        v-if="isLoading"
        class="w-6 h-6 text-gray-500 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke-width="4"
          class="opacity-25"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
          class="opacity-75"
        />
      </svg>

      <!-- trade_price가 있으면 세자리마다 쉼표 추가 -->
      <p v-else class="text-xl font-bold mr-2">
        {{ market.trade_price ? market.trade_price.toLocaleString() : '-' }}
      </p>
      
      <p
        :class="[
          'text-sm font-semibold',
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

// 데이터가 들어오면 로딩을 종료
watchEffect(() => {
  if (props.market.trade_price !== null && props.market.priceChangePercent !== null) {
    isLoading.value = false;
  }
});

// goToOrderPage function
const goToOrderPage = () => {
  router.push(`/order/${props.market.market}`);
};

// Computed property for price change class
const priceChangeClass = computed(() => {
  switch (props.market.change) {
    case "RISE":
      return "text-blue-500"; // 상승
    case "FALL":
      return "text-red-500"; // 하락
    default:
      return "text-gray-500"; // 보합
  }
});
</script>

<style scoped>
.coin-icon {
  font-size: 2rem;
}
</style>
