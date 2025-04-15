<template>
  <div class="flex flex-col bg-zinc-800 p-4 rounded-lg shadow-lg">
    <div v-if="orderMarket" class="flex justify-between items-center">
      <!-- 가격과 코인 이름 -->
      <div class="flex flex-col">
        <span class="text-2xl font-bold">
          {{ formatAmount(Math.floor(orderMarket.trade_price)) }}
          KRW
        </span>
        <span class="text-sm text-zinc-400">{{
          orderMarket.korean_name
        }}</span>
        <span class="text-sm text-zinc-300">{{
          orderMarket.english_name
        }}</span>
      </div>

      <!-- 가격 변화 표시 -->
      <div
        v-if="orderMarket.change"
        :class="{
          'text-red-500': orderMarket.change === 'RISE',
          'text-zinc-500': orderMarket.change === 'EVEN',
          'text-blue-500': orderMarket.change === 'FALL',
        }"
        class="flex items-center space-x-2"
      >
        <component
          :is="getIconComponent(orderMarket.change)"
          class="w-5 h-5"
        />
        <p class="text-lg font-semibold">
          {{ orderMarket.priceChangePercent }}
        </p>
        <Percent class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기
import { TrendingUp, TrendingDown, Percent, Asterisk } from "lucide-vue-next";

const marketStore = useMarketStore();
const orderMarket = computed(() => marketStore.orderMarket);
const formatAmount = (amount: number) => amount.toLocaleString();

const getIconComponent = (change) => {
  switch (change) {
    case "RISE":
      return TrendingUp;
    case "EVEN":
      return Asterisk;
    case "FALL":
      return TrendingDown;
    default:
      return null;
  }
};
</script>
