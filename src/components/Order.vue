<template>
  <div>
    <order-account :market="market" :side="side" />
    <div class="preview flex min-h-[350px] w-full justify-center items-center">
      <div class="grid gap-4 py-4 w-full">
        <RadioGroup v-model="orderData.ord_type" default-value="limit">
          <div class="grid grid-cols-4 items-center gap-4 h-10">
            <Label class="text-left">거래 타입</Label>
            <div class="flex items-center justify-end w-full col-span-3 gap-6">
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="limit" value="limit" />
                <Label for="limit">지정</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="price" value="price" />
                <Label for="price">시장</Label>
              </div>
            </div>
          </div>
        </RadioGroup>

        <div
          v-if="orderData.ord_type === 'limit'"
          class="grid grid-cols-4 items-center gap-4 h-10"
        >
          <Label for="volume" class="text-left">수량</Label>
          <div class="flex items-center justify-end w-full col-span-3 gap-2">
            <Input
              class="basis-3/4"
              id="volume"
              placeholder="수량"
              v-model="orderData.volume"
              @input="updateVolume"
            />
            <div class="basis-1/4">
              <Select v-model="selectedRatio">
                <SelectTrigger>
                  <SelectValue placeholder="비율" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="max"> 최대 </SelectItem>
                    <SelectItem value="75"> 75% </SelectItem>
                    <SelectItem value="50"> 50% </SelectItem>
                    <SelectItem value="25"> 25% </SelectItem>
                    <SelectItem value="10"> 10% </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div
          v-if="orderData.ord_type === 'limit'"
          class="grid grid-cols-4 items-center gap-4 h-10"
        >
          <Label class="text-left">가격</Label>
          <div class="flex items-center justify-end w-full col-span-3 gap-2">
            <Input
              id="price"
              placeholder="가격"
              v-model="orderData.price"
              @input="updateVolume"
            />
            <Button variant="ghost" size="icon" @click="refreshPrice()"
              ><rotate-cw
            /></Button>
          </div>
        </div>

        <div
          v-if="orderData.ord_type === 'limit'"
          class="grid grid-cols-4 items-center gap-4 h-10"
        >
          <Label class="text-left">총액</Label>

          <div class="flex items-center justify-end w-full col-span-3">
            <Input
              id="total"
              placeholder="총액"
              v-model="orderData.total"
              @input="updateVolume"
            />
          </div>
        </div>

        <div
          v-if="orderData.ord_type === 'price'"
          class="grid grid-cols-4 items-center gap-4 h-10"
        >
          <Label class="text-left">예상 수량</Label>
          <div class="flex items-center justify-end w-full col-span-3 gap-1">
            <p class="font-medium font-mono text-base">
              {{ orderData.volume }}
            </p>
            <p class="text-gray-400 text-xs">{{ marketCurrency }}</p>
            <Button variant="ghost" size="icon" @click="refreshPrice()"
              ><rotate-cw
            /></Button>
          </div>
        </div>

        <div
          v-if="orderData.ord_type === 'price'"
          class="grid grid-cols-4 items-center gap-4 h-10"
        >
          <Label class="text-left">총액</Label>

          <div class="flex items-center justify-end w-full col-span-3 gap-2">
            <Input
              class="basis-3/4"
              id="total"
              placeholder="수량"
              v-model="orderData.total"
              @input="updateVolume"
            />
            <div class="basis-1/4">
              <Select v-model="selectedRatio">
                <SelectTrigger>
                  <SelectValue placeholder="비율" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="max">최대</SelectItem>
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2 flex-row">
      <Button class="basis-1/3" variant="outline" size="lg" @click="submitOrder"
        >초기화</Button
      >
      <Button class="basis-2/3 bg-red-500" size="lg" @click="submitOrder"
        >매수</Button
      >
    </div>
    <div
      style="background-color: yellow"
      v-if="orderStore.orderStatus !== null"
    >
      <p>Order Status: {{ orderStore.orderStatus }}</p>
      <p v-if="orderStore.orderResponse">
        Order Response: {{ orderStore.orderResponse }}
      </p>
      <p v-if="orderStore.orderErrorMessage">
        Error: {{ orderStore.orderErrorMessage }}
      </p>
    </div>
    <!-- 주문 결과 출력 -->
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, computed, watch } from "vue";
import { useOrderStore } from "@/stores/order-store";
import { useAccountStore } from "@/stores/account-store";
import { RotateCw } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderAccount from "@/components/OrderAccount";

const props = defineProps({
  market: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: false,
  },
  side: {
    type: String,
    required: true,
  },
});

const orderStore = useOrderStore();
const accountStore = useAccountStore();

const accountData = ref(accountStore.accountData); // accountStore에서 accountData 가져오기

const orderData = ref({
  market: props.market,
  side: props.side,
  volume: 0,
  price: 0,
  total: 0, // 초기 값
  ord_type: "limit",
});

const krwBalance = computed(() => {
  // accountData 배열에서 currency가 "KRW"인 항목을 찾아 balance 값만 반환
  const krwAccount = accountData.value.find(
    (account) => account.currency === "KRW"
  );
  return krwAccount ? Math.floor(Number(krwAccount.balance)) : 0; // 소수점 버림 처리
});

const marketLocked = computed(() => {
  const marketCurrency = props.market.split("-")[1]; // 'KRW-'를 제거한 나머지 값 (예: XTZ)
  const lockedAccount = accountData.value.find(
    (account) => account.currency === marketCurrency
  );
  return lockedAccount ? Number(lockedAccount.locked) : 0; // locked 값이 있으면 그것을 반환, 없으면 0 반환
});

const marketCurrency = computed(() => {
  return props.market.replace("KRW-", "");
});

const updateVolume = () => {
  if (orderData.value.price && orderData.value.total) {
    orderData.value.volume = +(
      orderData.value.total / orderData.value.price
    ).toFixed(8);
  }
};

const submitOrder = () => {
  orderStore.createOrder(orderData.value);
};

const setInitialPrice = () => {
  if (props.currentPrice) {
    orderData.value.price = props.currentPrice;
    updateVolume();
  }
};

const refreshPrice = () => {
  if (props.currentPrice) {
    orderData.value.price = props.currentPrice;
    updateVolume();
  }
};

const selectedRatio = ref(""); // 기본 비율을 '최대'로 설정
watch(selectedRatio, () => {
  updateTotalFromRatio();
});
const updateTotalFromRatio = () => {
  let total = 0;

  if (selectedRatio.value === "max") {
    total = krwBalance.value; // KRW 전체 잔액
  } else if (selectedRatio.value === "75") {
    total = krwBalance.value * 0.75; // 75%
  } else if (selectedRatio.value === "50") {
    total = krwBalance.value * 0.5; // 50%
  } else if (selectedRatio.value === "25") {
    total = krwBalance.value * 0.25; // 25%
  } else if (selectedRatio.value === "10") {
    total = krwBalance.value * 0.1; // 10%
  }

  // 소수점 아래 제거
  orderData.value.total = Math.floor(total); // 소수점 아래 제거
  updateVolume(); // total이 변경되었으므로 volume도 자동으로 업데이트
};

onMounted(() => {
  setInitialPrice();
});
</script>
