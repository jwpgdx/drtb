<!-- MarketListItem.vue -->
<template>
  <div
    @click="goToOrderPage"
    class="flex h-16 cursor-pointer items-center rounded-sm px-4 text-white hover:bg-zinc-900"
  >
    <!-- market.isVisible일 때만 이미지 로드 -->
    <Coin :market="market.market" class="mr-3 size-5 lg:mr-4 lg:size-6" />

    <div class="flex-1">
      <p class="text-[15px] lg:text-base">{{ market.korean_name }}</p>
      <p class="text-xs text-zinc-500">{{ market.market }}</p>
    </div>
    <div class="number-text flex items-center">
      <p v-if="isLoading" class="mr-2 text-base">-</p>

      <!-- trade_price가 있으면 세자리마다 쉼표 추가 -->
      <p v-else class="mr-2 text-[15px] lg:text-base">
        ₩ {{ market.trade_price ? market.trade_price.toLocaleString() : "-" }}
      </p>

      <p
        :class="[
          'min-w-16 text-right text-[15px] lg:min-w-20 lg:text-base',
          priceChangeClass,
        ]"
      >
        {{
          market.priceChangePercent !== null ? market.priceChangePercent : "-"
        }}%
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
  if (
    props.market.trade_price !== null &&
    props.market.priceChangePercent !== null
  ) {
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
.number-text {
  font-family: "SamsungSharpSans", sans-serif;
  font-weight: 500;
}
</style>
