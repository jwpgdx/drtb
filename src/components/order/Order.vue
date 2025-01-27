<template>
  <div>
    {{ orderData }}


   

    <div class="flex border-b">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{
          'text-blue-500 border-b-2 border-blue-500':
            orderData.side === tab.value,
          'text-gray-500': orderData.side !== tab.value,
        }"
        class="py-2 px-4 focus:outline-none"
        @click="handleOrderData(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="mt-4">
      <div v-if="orderData.side === tabs[0].value">
        <OrderAccount :orderMarket="orderMarket" :orderChance="orderChance" />
      </div>
      <div v-if="orderData.side === tabs[1].value || orderData.side === tabs[2].value">
        <OrderForm />
      </div>
      <OrderList v-if="orderData.side === tabs[3].value" />
    </div>

    <Drawer v-model:open="isTempOrder">
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <OrderFormTemp />
        </div>
      </DrawerContent>
    </Drawer>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useOrderStore } from "@/stores/order-store";
import { useMarketStore } from "@/stores/market-store"; // Pinia store 가져오기

import OrderAccount from "@/components/order/OrderAccount.vue";
import OrderList from "@/components/order/OrderList.vue";
import OrderForm from "@/components/order/OrderForm.vue";
import OrderFormTemp from "@/components/order/OrderFormTemp.vue";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const isTempOrder = computed({
  get: () => orderStore.isTempOrder, // Store에서 결제창 상태를 가져옴
  set: (value) => {
    if (!value) {
      orderStore.closeTempOrder();  // 값이 false일 경우 closeTempOrder 호출
    }
  },
});

const orderStore = useOrderStore();
const orderChance = computed(() => orderStore.orderChance);
const marketStore = useMarketStore();

const orderMarket = computed(() => marketStore.orderMarket);
const orderData = computed(() => orderStore.orderData);

const submitOrder = () => {
  // orderStore.createOrder(orderData.value);
};

const tabs = [
  { value: "account", label: "보유자산" },
  { value: "bid", label: "매수" },
  { value: "ask", label: "매도" },
  { value: "orderList", label: "거래내역" },
];
function handleOrderData(value) {
  console.log ('handleOrderData',value)
  orderStore.initOrderStore(value)
}
</script>
