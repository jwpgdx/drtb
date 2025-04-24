<template>
  <div class="w-full text-sm">
    <div class="text-3xl font-semibold">주문 상세</div>

    <ErrorState
      v-if="historyStore.isDetailLoading"
      image="loading"
      title="불러오는 중..."
      content="잠시만 기다려주세요."
    />

    <div v-else-if="historyStore.orderDetailError" class="text-red-500">
      {{ historyStore.orderDetailError }}
    </div>

    <div v-else-if="detail">
      <!-- 주문 기본 정보 -->
      <table class="w-full border-separate border-spacing-y-1">
        <tbody>
          <tr>
            <td class="text-zinc-400">UUID</td>
            <td>{{ detail.uuid }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">마켓</td>
            <td>{{ detail.market }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">거래유형</td>
            <td>{{ sideText }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">주문방식</td>
            <td>{{ detail.ord_type }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">상태</td>
            <td>{{ detail.state }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">주문가격</td>
            <td>{{ formatNumber(detail.price) }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">주문수량</td>
            <td>{{ detail.volume }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">체결수량</td>
            <td>{{ detail.executed_volume }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">남은수량</td>
            <td>{{ detail.remaining_volume }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">거래금액</td>
            <td>{{ formatNumber(detail.locked) }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">예약 수수료</td>
            <td>{{ detail.reserved_fee }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">사용된 수수료</td>
            <td>{{ detail.paid_fee }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">잔여 수수료</td>
            <td>{{ detail.remaining_fee }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">체결건수</td>
            <td>{{ detail.trades_count }}</td>
          </tr>
          <tr>
            <td class="text-zinc-400">주문시간</td>
            <td>{{ detail.created_at }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 체결 내역 -->
      <!-- 체결 내역 -->
      <div v-if="detail.trades?.length" class="mt-6 w-full text-sm">
        <h3 class="mb-2 text-base font-semibold">체결 내역</h3>
        <div
          v-for="trade in detail.trades"
          :key="trade.uuid"
          class="mb-6 w-full overflow-hidden rounded border border-zinc-700"
        >
          <table class="w-full border-collapse text-left text-sm text-white">
            <tbody>
              <tr class="border-b border-zinc-700">
                <th class="w-36 bg-zinc-800 px-3 py-2 text-zinc-400">
                  체결 ID
                </th>
                <td class="px-3 py-2">{{ trade.uuid }}</td>
              </tr>
              <tr class="border-b border-zinc-700">
                <th class="bg-zinc-800 px-3 py-2 text-zinc-400">체결 가격</th>
                <td class="px-3 py-2">{{ formatNumber(trade.price) }}</td>
              </tr>
              <tr class="border-b border-zinc-700">
                <th class="bg-zinc-800 px-3 py-2 text-zinc-400">체결 수량</th>
                <td class="px-3 py-2">{{ trade.volume }}</td>
              </tr>
              <tr class="border-b border-zinc-700">
                <th class="bg-zinc-800 px-3 py-2 text-zinc-400">
                  총 체결 금액
                </th>
                <td class="px-3 py-2">{{ formatNumber(trade.funds) }}</td>
              </tr>
              <tr class="border-b border-zinc-700">
                <th class="bg-zinc-800 px-3 py-2 text-zinc-400">거래 유형</th>
                <td
                  class="px-3 py-2"
                  :class="{
                    'text-blue-500': trade.side === 'bid',
                    'text-red-500': trade.side === 'ask',
                  }"
                >
                  {{ trade.side === "bid" ? "매수" : "매도" }}
                </td>
              </tr>
              <tr>
                <th class="bg-zinc-800 px-3 py-2 text-zinc-400">체결 시간</th>
                <td class="px-3 py-2">{{ trade.created_at }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="mt-4 text-zinc-400">체결 내역 없음</div>
    </div>

    <div v-else class="text-zinc-400">주문 데이터를 찾을 수 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useHistoryStore } from "@/stores/history-store";
import ErrorState from "@/components/ErrorState.vue";

const props = defineProps<{
  order: any;
}>();

const historyStore = useHistoryStore();

onMounted(async () => {
  if (props.order?.uuid) {
    await historyStore.fetchOrderDetailByUUID(props.order.uuid);
  }
});

const detail = computed(() => historyStore.selectedOrderDetail);

const sideText = computed(() => {
  switch (detail.value?.side) {
    case "bid":
      return "매수";
    case "ask":
      return "매도";
    case "cancel":
      return "취소";
    default:
      return detail.value?.side || "-";
  }
});

const formatNumber = (value: string | number) => {
  const num = parseFloat(value as string);
  return isNaN(num)
    ? "-"
    : num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
</script>
