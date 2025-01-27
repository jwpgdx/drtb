<template>
  <div>

  <!-- 주문 종류 -->

    <RadioGroup v-model="orderData.ord_type">
      <div class="grid grid-cols-4 items-center gap-4 h-10">
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="limit" value="limit" />
          <Label for="limit">지정</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="price" value="price" />
          <Label for="price">시장</Label>
        </div>
      </div>
    </RadioGroup>



    <!-- 지갑 정보 -->

    <div v-if="orderData.side === 'bid'">
      <p>보유 금액</p>
      <p>{{ formattedBalance }} (단위: {{ orderChance.bid_account.currency }})</p>
    </div>

    <div v-if="orderData.side === 'ask'">
      <p>보유 코인</p>
      <p>
        {{ orderChance.ask_account.locked }} (단위:
        {{ orderChance.ask_account.currency }})
      </p>
    </div>

 

  
    <p>거래 수량</p>
    <button @click="handleOpenTempOrder('volume')">
      {{ orderData.volume }}
    </button>
    <OrderRatio />

    <p>거래 가격</p>
    <button @click="handleOpenTempOrder('price')">
      {{ formattedPrice }}
    </button>
   

    <p>총액</p>
    <button @click="handleOpenTempOrder('total')">
      {{ formattedTotal }} (단위: {{ orderChance.bid_account.currency }})
    </button>



   
    
    <div v-if="orderData.ord_type === 'price' && orderData.side === 'bid'">
      <p>예상 수량</p>
    <p>{{ orderData.volume }} (단위:
      {{ orderChance.ask_account.currency }})</p>
    </div>
    
    <div v-if="orderData.ord_type === 'price' && orderData.side === 'ask'">
      <p>예상 금액</p>
    <p>{{ formattedTotal }} (단위:
      {{ orderChance.bid_account.currency }})</p>
</div>


    



    <button @click="handleSetOrderData">초기화</button>
    <button @click="handleCreateOrder">매수</button>

  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOrderStore } from "@/stores/order-store";
import { formatPrice, formatTotal } from "@/utils/format";

import OrderRatio from "@/components/order/OrderRatio.vue";

const orderStore = useOrderStore();
const orderData = computed(() => orderStore.orderData);
const orderChance = computed(() => orderStore.orderChance);

const handleOpenTempOrder = (value: string) => {
  orderStore.openTempOrder(value);
};

function handleSetOrderData() {
  orderStore.setOrderData();
}
function handleCreateOrder() {
  orderStore.createOrder();
}




const formattedBalance = computed(() =>
  formatTotal(orderChance.value.bid_account.balance)
);
const formattedPrice = computed(() => formatPrice(orderData.value.price));
const formattedTotal = computed(() => formatTotal(orderData.value.total));

</script>
