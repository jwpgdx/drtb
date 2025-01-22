<template>
    <div class="grid gap-4">
      <!-- 주문 가능 금액 (KRW) 또는 잠금 금액 (Market Currency) -->
      <div v-if="side === 'bid'" class="grid grid-cols-4 items-center gap-4">
        <Label class="text-left">주문 가능</Label>
        <div class="flex items-center justify-end col-span-3 gap-1">
          <p class="font-medium font-mono text-base">{{ krwBalance }}</p>
          <p class="text-gray-400 text-xs">KRW</p>
        </div>
      </div>
  
      <div v-if="side === 'ask'" class="grid grid-cols-4 items-center gap-4">
        <Label class="text-left">주문 가능</Label>
        <div class="flex items-center justify-end col-span-3 gap-1">
          <p class="font-medium font-mono text-base">{{ marketLocked }}</p>
          <p class="text-gray-400 text-xs">{{ marketCurrency }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineProps, computed } from "vue";
  import { useAccountStore } from "@/stores/account-store";
  import { Label } from "@/components/ui/label";
  
  const props = defineProps({
    market: {
      type: String,
      required: true,
    },
    side: {
      type: String,
      required: true,
    },
  });
  
  const accountStore = useAccountStore();
  const accountData = ref(accountStore.accountData); // accountStore에서 accountData 가져오기
  
  // KRW 잔액 계산
  const krwBalance = computed(() => {
    const krwAccount = accountData.value.find(
      (account) => account.currency === "KRW"
    );
    return krwAccount ? Math.floor(Number(krwAccount.balance)) : 0; // 소수점 버림 처리
  });
  
  // Market에 해당하는 잠금 금액 계산
  const marketLocked = computed(() => {
    const marketCurrency = props.market.split("-")[1]; // 'KRW-'를 제거한 나머지 값 (예: XTZ)
    const lockedAccount = accountData.value.find(
      (account) => account.currency === marketCurrency
    );
    return lockedAccount ? Number(lockedAccount.locked) : 0; // locked 값이 있으면 그것을 반환, 없으면 0 반환
  });
  
  // Market의 통화 명 (예: XTZ, BTC)
  const marketCurrency = computed(() => {
    return props.market.replace("KRW-", "");
  });
  </script>
  