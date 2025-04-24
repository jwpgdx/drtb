<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <!-- 주문 종류 -->
    <!--
    <div class="bg-zinc-100 p-4 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">주문 종류</h2>
      <RadioGroup v-model="orderData.ord_type">
        <div class="grid grid-cols-2 items-center gap-4">
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="limit" value="limit" />
            <Label for="limit" class="text-lg text-zinc-700">지정</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="price" value="price" />
            <Label for="price" class="text-lg text-zinc-700">시장</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
-->

    <!-- 지갑 정보 -->
    <div v-if="isAuthenticated" class="flex items-center  p-4 rounded-lg">
      <p v-if="isBid" class="text-xl font-semibold text-zinc-600">
        주문가능 {{ formattedBidBalance }} (단위: {{ bidCurrency }})
      </p>
      <p v-if="isAsk" class="text-xl font-semibold text-zinc-600">
        주문가능 {{ askBalance }} (단위: {{ askCurrency }})
      </p>
      <Button variant="ghost" @click="handleFetchOrderChance" :disabled="isLoading">
        <RefreshCw :class="{ 'animate-spin': isLoading }" />
      </Button>
    </div>

    <!-- 거래 정보 -->
    <div v-if="isLimit" class="grid items-start gap-4">
      <div class="grid gap-2">
        <Label>거래 수량</Label>
        <div class="flex gap-4">
          <Input
            readonly
            v-model="orderData.volume"
            @click="handleOpenTempOrder('volume')"
          />
          <OrderRatio />
        </div>
      </div>

      <div class="grid gap-2">
        <Label>거래 가격</Label>
        <div class="flex gap-4">
          <Input
            readonly
            v-model="formattedPrice"
            @click="handleOpenTempOrder('price')"
          />
          <Button @click="handleSetOrderDataTradePrice()">현재가 갱신</Button>
        </div>
      </div>

      <div class="grid gap-2">
        <Label>총액 (단위: {{ bidCurrency }})</Label>
        <Input
          readonly
          v-model="formattedTotal"
          @click="handleOpenTempOrder('total')"
        />
      </div>
    </div>

    <!-- 거래 정보 -->

    <div v-if="isPrice && isBid" class="grid items-start gap-4">
      <div class="grid gap-2">
        <Label>총액 (단위: {{ bidCurrency }})</Label>
        <div class="flex gap-4">
          <Input
            readonly
            v-model="formattedTotal"
            @click="handleOpenTempOrder('total')"
          />
          <OrderRatio />
        </div>
      </div>

      <div class="grid gap-2">
        <Label>예상 수량</Label>
        <p class="text-xl font-semibold">
          {{ orderData.volume }} (단위: {{ askCurrency }})
        </p>
      </div>
    </div>

    <div v-if="isPrice && isAsk" class="grid items-start gap-4">
      <div class="grid gap-2">
        <Label>거래 수량</Label>
        <div class="flex gap-4">
          <Input
            readonly
            v-model="orderData.volume"
            @click="handleOpenTempOrder('volume')"
          />
          <OrderRatio />
        </div>
      </div>

      <div class="grid gap-2">
        <Label>예상 금액</Label>
        <p class="text-xl font-semibold">
          {{ formattedTotal }} (단위: {{ bidCurrency }})
        </p>
      </div>
    </div>



<div class="flex flex-col gap-4" v-if="isAuthenticated">
    <div class="flex gap-4">
      <Button variant="outline" class="w-full" @click="handleSetOrderData">
        초기화
      </Button>
      <Button
        @click="openDrawer"
        class="w-full"
        :class="
          isBid
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        "
      >
        {{ isBid ? "매수" : "매도" }}
      </Button>
    </div>
    <Button class="w-full" @click="handleCurrentPriceTrade">
      현재가 {{ isBid ? "전액 매수" : "전량 매도" }}
    </Button>
    <!-- 주문 버튼 -->

  </div>

<div v-else>
  <Button class="w-full" @click="goToLogin">
    <Lock />
    로그인 하러 가기
    </Button>
  </div>



    <Drawer v-if="drawer" v-model:open="drawer">
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <div class="p-4 pb-0">
            <p>{{ orderData.ord_type === "limit" ? "지정가" : "시장가" }}</p>
            <p>거래 가격: {{ formattedPrice }}</p>
            <p>거래 수량: {{ orderData.volume }}</p>
            <p>주문 금액: {{ formattedTotal }} (단위: {{ bidCurrency }})</p>
          </div>
        </div>
        <DrawerFooter>
          <Button
            :class="
              isBid
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            "
            @click="handleCreateOrder"
            >{{ isBid ? "매수 확인" : "매도 확인" }}</Button
          >
          <DrawerClose as-child>
            <Button variant="outline"> 취소 </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOrderStore } from "@/stores/order-store";
import { useOrderChanceStore } from "@/stores/order-chance-store";
import { useAuthStore } from "@/stores/auth-store"; // Pinia store 가져오기
import { RefreshCw, Lock} from "lucide-vue-next";

import { formatPrice, formatTotal } from "@/utils/format";
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
import { useRouter, useRoute } from "vue-router";

import OrderRatio from "@/components/order/OrderRatio.vue";
import { toast } from "vue3-toastify";
import { h } from "vue";

const orderStore = useOrderStore();
const orderChanceStore = useOrderChanceStore();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const orderData = computed(() => orderStore.orderData);
const bidBalance = computed(() => orderChanceStore.bidBalance);
const bidCurrency = computed(() => orderChanceStore.bidCurrency);
const askBalance = computed(() => orderChanceStore.askBalance);
const askCurrency = computed(() => orderChanceStore.askCurrency);
const isLoading = computed(() => orderChanceStore.isLoading);

// 조건 계산
const isBid = computed(() => orderData.value.side === "bid");
const isAsk = computed(() => orderData.value.side === "ask");
const isLimit = computed(() => orderData.value.ord_type === "limit");
const isPrice = computed(() => orderData.value.ord_type === "price");

// 거래 처리 함수
const handleOpenTempOrder = (value: string) => {
  orderStore.openTempOrder(value);
};

function handleSetOrderData() {
  orderStore.setOrderData();
}
const router = useRouter();
const route = useRoute();
const marketParam = computed(() => route.params.market as string);
// 보유 자본 새로고침

const handleFetchOrderChance = () => {
  orderChanceStore.fetchOrderChance(marketParam.value);
};
const handleSetOrderDataTradePrice = () => {
  orderStore.setOrderDataTradePrice();
};

const handleCurrentPriceTrade = () => {
  orderStore.setOrderDataTradePrice();
  orderStore.setRatioChange("1");
  openDrawer(); // 화살표 함수에서도 호출 가능
};

// 포맷팅 계산
const formattedBidBalance = computed(() => formatTotal(bidBalance.value));
const formattedPrice = computed(() => formatPrice(orderData.value.price));
const formattedTotal = computed(() => formatTotal(orderData.value.total));

// Drawer
const drawer = ref(false);

const openDrawer = () => {
  if (orderData.value?.volume === "0") {
    toast("주문수량을 입력해주세요.");
    return; // 수량이 0이면 Drawer를 열지 않음
  }
  drawer.value = true;
};
const closeDrawer = () => {
  drawer.value = false;
  document.body.style.pointerEvents = "auto";
};

const orderSuccess = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const handleCreateOrder = () => {
  closeDrawer();
  orderStore.createOrder().then(() => {
    // 주문 성공 여부와 상관없이 잔고 새로고침 실행
    handleFetchOrderChance();

    if (orderStore.orderErrorMessage) {
      toast(orderStore.orderErrorMessage);
    } else {
      toast("주문이 성공적으로 접수되었습니다.");
    }
  });
};



const goToLogin = () => {
    router.replace(`/login?redirect=${route.fullPath}`);
  };
</script>
