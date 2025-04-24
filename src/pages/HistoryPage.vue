<template>
  <div class="container">
    <!-- 탭 필터 -->

    <div class="relative mb-6 flex h-10 w-full items-center justify-between">
      <div class="flex gap-4 text-base lg:gap-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="setTab(tab.value)"
          :class="[
            'px-2 py-2 font-medium focus:outline-none',
            historyStore.selectedSide === tab.value
              ? 'border-b-2 border-orange-500 text-white'
              : 'text-zinc-500 hover:text-zinc-700',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input type="date" v-model="fromDate" class="input text-black" />
      <span class="">~</span>
      <input type="date" v-model="toDate" class="input text-black" />
      <button @click="applyDateFilter" class="btn px-3 py-1 text-sm">
        적용
      </button>
    </div>

    <!-- 날짜 필터 -->

    <!-- 이력 목록 -->
    <div class="w-full overflow-x-auto">
      <table class="w-full min-w-[800px] text-left">
        <thead class="border-b border-zinc-800 text-xs text-zinc-400">
          <tr>
            <th class="px-1 py-2 font-light">거래일시</th>
            <th class="px-1 py-2 font-light">자산</th>
            <th class="px-1 py-2 font-light">거래구분</th>
            <th class="px-1 py-2 font-light">거래수량</th>
            <th class="px-1 py-2 font-light">체결가격</th>
            <th class="px-1 py-2 font-light">거래금액</th>
          </tr>
        </thead>
        <tbody>
          <HistoryItem
            v-for="order in historyStore.orderHistory"
            :key="order.id"
            :order="order"
            @select="openModal"
          />
        </tbody>
      </table>
    </div>
    <!-- 관찰 지점 -->
    <div ref="loadMoreTrigger" class="h-10" />

    <div v-if="historyStore.loading" class="py-4 text-center text-gray-400">
      불러오는 중...
    </div>
    <div v-if="!historyStore.hasMore" class="py-4 text-center text-gray-400">
      모든 데이터를 불러왔습니다.
    </div>

    <v-dialog v-model="isDialogOpen">
      <HistoryItemDetail :order="selectedOrder" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useHistoryStore } from "@/stores/history-store";
import { useIntersectionObserver } from "@vueuse/core";
import HistoryItem from "@/components/history/HistoryItem.vue";
import HistoryItemDetail from "@/components/history/HistoryItemDetail.vue";
import VDialog from "@/v-components/v-dialog.vue";

const historyStore = useHistoryStore();

const isDialogOpen = ref(false);
const selectedOrder = ref<any>(null);

const openModal = (order: any) => {
  selectedOrder.value = order;
  isDialogOpen.value = true;
};

const tabs = [
  { label: "전체", value: "all" },
  { label: "매수", value: "bid" },
  { label: "매도", value: "ask" },
  { label: "취소", value: "cancel" },
];

const setTab = (value: string) => {
  if (["all", "bid", "ask", "cancel"].includes(value)) {
    historyStore.setSideFilter(value as "all" | "bid" | "ask" | "cancel");
  }
};

const fromDate = ref<string | null>(null);
const toDate = ref<string | null>(null);

const applyDateFilter = () => {
  const from = fromDate.value ? new Date(fromDate.value) : null;
  const to = toDate.value ? new Date(toDate.value) : null;
  historyStore.setDateFilter(from, to);
};

// 무한스크롤 감지
const loadMoreTrigger = ref<HTMLElement | null>(null);

useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      historyStore.fetchMoreOrderHistory();
    }
  },
  {
    threshold: 0.5,
  },
);

const formatDate = (timestamp: any) => {
  return timestamp?.toDate?.().toLocaleString() || "-";
};
</script>

<style scoped>
.input {
  @apply rounded border px-2 py-1 text-sm;
}
.btn {
  @apply rounded bg-blue-500 text-white hover:bg-blue-600;
}
</style>
