<template>
  <div class="mx-auto p-4">
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div
        v-for="(account, index) in accountStore.accountData"
        :key="index"
        class="rounded-lg p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      >
        <h3 class="mb-3 text-2xl font-bold">
          {{ account.currency }}
        </h3>
        <ul class="space-y-2">
          <li>
            <span class="font-semibold">Balance:</span> {{ account.balance }}
          </li>
          <li>
            <span class="font-semibold">Locked:</span> {{ account.locked }}
          </li>
          <li>
            <span class="font-semibold">Avg Buy Price:</span>
            {{ account.avg_buy_price }}
          </li>
          <li>
            <span class="font-semibold">Unit:</span> {{ account.unit_currency }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useAccountStore } from "@/stores/account-store";

const accountStore = useAccountStore();

// 컴포넌트 마운트 되자마자 계좌 정보 GET! (바로 갱신됨)
onMounted(() => {
  accountStore.fetchAccountData();
});
</script>

<style scoped>
/* 추가 스타일 넣고 싶으면 여기다가 쏘옥! */
</style>
