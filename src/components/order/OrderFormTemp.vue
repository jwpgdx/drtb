<!-- @/components/order/OrderFormInput.vue -->

<template>
  <div>

    
    <div class="flex space-x-4" v-if="orderData.ord_type === 'limit'">
      <button
        :class="[
          'py-2 px-4 cursor-pointer',
          activeTempOrderTab === 'volume'
            ? 'border-b-2 font-semibold'
            : 'hover:bg-gray-200 rounded',
        ]"
        @click="handleSetActiveTempOrderTab('volume')"
      >
        수량
      </button>
      <button
        :class="[
          'py-2 px-4 cursor-pointer',
          activeTempOrderTab === 'price'
            ? 'border-b-2 font-semibold'
            : 'hover:bg-gray-200 rounded',
        ]"
        @click="handleSetActiveTempOrderTab('price')"
      >
        가격
      </button>
      <button
        :class="[
          'py-2 px-4 cursor-pointer',
          activeTempOrderTab === 'total'
            ? 'border-b-2 font-semibold'
            : 'hover:bg-gray-200 rounded',
        ]"
        @click="handleSetActiveTempOrderTab('total')"
      >
        총액
      </button>
    </div>







<!-- 거래 정보 -->


    <div
      v-if="orderData.side === 'bid'"
    >
    <p>보유 금액</p>
    <p>{{ formattedBalance }} {{ orderChance.bid_account.currency }}</p>
  </div>

  <div
      v-if="orderData.side === 'ask'"
    >
    <p>보유 코인</p>
    <p>
      {{ orderChance.ask_account.locked }} (단위:
      {{ orderChance.ask_account.currency }})
    </p>

    </div>
   

    <p>거래 가격</p>
    <p>{{ formattedPrice }} (단위: {{ orderChance.bid_account.currency }})</p>
    <p>거래 수량</p>
    <p>
      {{ tempOrderData.volume }} (단위: {{ orderChance.ask_account.currency }})
    </p>
    <p>총액</p>
    <p>{{ formattedTotal }} (단위: {{ orderChance.bid_account.currency }})</p>






    <!-- 입력란 -->

<div v-if="activeTempOrderTab === 'volume'">
  <p>거래 수량 입력</p>
    <p>
      {{ tempOrderData.volume }} (단위: {{ orderChance.ask_account.currency }})
    </p>

    <OrderRatio />
</div>


<div v-if="activeTempOrderTab === 'price'">
  <p>거래 가격 입력</p>
  <p>{{ formattedPrice }} (단위: {{ orderChance.bid_account.currency }})</p>
</div>



<div v-if="activeTempOrderTab === 'total'">
  <p>총액 입력</p>
  <p>{{ formattedTotal }} (단위: {{ orderChance.bid_account.currency }})</p>
</div>


 

    <NumericKeypad />

    <button @click="handleSetTempOrderData">초기화</button>
    <button @click="handleApplyTempOrder">저장</button>
  </div>
</template>

<script setup lang="ts">
import NumericKeypad from "@/components/NumericKeypad.vue";
import { computed } from "vue";
import { useOrderStore } from "@/stores/order-store";
import { formatPrice, formatTotal } from "@/utils/format";

import OrderRatio from "@/components/order/OrderRatio.vue";
const orderStore = useOrderStore();
const tempOrderData = computed(() => orderStore.tempOrderData);
const orderData = computed(() => orderStore.orderData);

const orderChance = computed(() => orderStore.orderChance);
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
const formattedBalance = computed(() =>
formatTotal(orderChance.value.bid_account.balance)
);
const formattedPrice = computed(() => formatPrice(tempOrderData.value.price));
const formattedTotal = computed(() => formatTotal(tempOrderData.value.total));
</script>
