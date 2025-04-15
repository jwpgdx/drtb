<!-- @/components/order/OrderFormInput.vue -->

<template>
   <div class="space-y-4">
    <!-- 탭 버튼들 -->
    <div class="flex space-x-4">
      <button
        :class="[
          'py-2 px-4 cursor-pointer w-1/3 text-center',
          activeTempOrderTab === 'volume'
            ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
            : 'hover:bg-zinc-200 rounded'
        ]"
        @click="handleSetActiveTempOrderTab('volume')"
      >
        수량
      </button>
      <button
        :class="[
          'py-2 px-4 cursor-pointer w-1/3 text-center',
          activeTempOrderTab === 'price'
            ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
            : 'hover:bg-zinc-200 rounded'
        ]"
        @click="handleSetActiveTempOrderTab('price')"
      >
        가격
      </button>
      <button
        :class="[
          'py-2 px-4 cursor-pointer w-1/3 text-center',
          activeTempOrderTab === 'total'
            ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
            : 'hover:bg-zinc-200 rounded'
        ]"
        @click="handleSetActiveTempOrderTab('total')"
      >
        총액
      </button>
    </div>

    <!-- 거래 정보 -->
    <div class=" p-4 rounded-md shadow-md">
      <p class="text-zinc-600 text-sm">거래 가격</p>
      <p class="text-lg font-semibold">{{ formattedPrice }} (단위: {{ bidCurrency }})</p>

      <p class="text-zinc-600 text-sm mt-2">거래 수량</p>
      <p class="text-lg font-semibold">{{ tempOrderData.volume }} (단위: {{ askCurrency }})</p>

      <p class="text-zinc-600 text-sm mt-2">총액</p>
      <p class="text-lg font-semibold">{{ formattedTotal }} (단위: {{ bidCurrency }})</p>
    </div>

    <!-- 입력란 -->
     
    <div class="space-y-4 mt-4">

      <div v-if="activeTempOrderTab === 'volume'" class="grid items-start gap-4">
        <Label>거래 수량 입력 (단위: {{ askCurrency }})</Label>
        <div class="flex items-center gap-4">
          <Input readonly v-model="tempOrderData.volume" />
          <OrderRatio />
        </div>
      </div>


      <div v-if="activeTempOrderTab === 'price'" class="grid items-start gap-4">
        <Label>거래 가격 입력 (단위: {{ bidCurrency }})</Label>
          <Input readonly v-model="formattedPrice" />
  
      </div>

      <div v-if="activeTempOrderTab === 'total'" class="grid items-start gap-4">
        <Label>총액 입력 (단위: {{ bidCurrency }})</Label>
        <div class="flex items-center gap-4">
          <Input readonly v-model="formattedTotal" />
          <OrderRatio />
        </div>
      </div>


    </div>

    <!-- Numeric Keypad -->
    <div class="mt-4">
      <NumericKeypad />
    </div>

    <!-- 버튼들 -->
    <div class="flex gap-4">
      <Button variant="outline" class="w-full"
        @click="handleSetTempOrderData"
      >
        초기화
      </Button>
      <Button
      class="w-full"
        @click="handleApplyTempOrder"
      >
        확인
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import NumericKeypad from "@/components/NumericKeypad.vue";
import { computed } from "vue";
import { useOrderStore } from "@/stores/order-store";
import { formatPrice, formatTotal } from "@/utils/format";
import { useOrderChanceStore } from "@/stores/order-chance-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import OrderRatio from "@/components/order/OrderRatio.vue";

const orderChanceStore = useOrderChanceStore();
const bidCurrency = computed(() => orderChanceStore.bidCurrency);
const askCurrency = computed(() => orderChanceStore.askCurrency);

const orderStore = useOrderStore();
const tempOrderData = computed(() => orderStore.tempOrderData);

const activeTempOrderTab = computed(() => orderStore.activeTempOrderTab);

// 가격 초기화
function handleSetTempOrderData() {
  orderStore.setTempOrderData();
}

// 탭선택
function handleSetActiveTempOrderTab(value: string) {
  orderStore.setActiveTempOrderTab(value);
}
// 저장
function handleApplyTempOrder() {
  orderStore.applyTempOrder();
}

// Computed properties
const formattedPrice = computed(() => formatPrice(tempOrderData.value.price));
const formattedTotal = computed(() => formatTotal(tempOrderData.value.total));
</script>
