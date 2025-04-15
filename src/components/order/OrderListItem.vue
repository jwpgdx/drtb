<template>
  <div class="p-6 rounded-lg shadow-md space-y-4">
    <!-- 주문 사이드와 생성 날짜 -->
    <div class="flex justify-between items-center text-sm text-zinc-600">
      <p :class="getOrderStateClass(order.state)" class="text-base font-bold">
        {{ getOrderStateText(order.state) }}
      </p>
    </div>

    <div class="flex justify-between items-center text-sm text-zinc-600">
      <div :class="getOrderSideClass(order.side)" class="font-medium">
        {{ getOrderSideText(order.side) }}
      </div>
      <div>{{ formatDate(order.created_at) }}</div>
    </div>
    
    <!-- 마켓 -->
    <div class="flex justify-between items-center text-sm text-zinc-600">
      <div class="font-medium text-zinc-800">마켓</div>
      <div><i
        :class="`cf cf-${
          order.market.replace('KRW-', '').toLowerCase() || 'btc'
        }`"
      ></i> {{ order.market }}</div>
    </div>

    <!-- 체결 가격 -->
    <div class="flex justify-between items-center text-sm text-zinc-600">
      <div class="font-medium text-zinc-800">체결가격</div>
      <div class="text-blue-500">{{ orderPrice }} KRW</div>
    </div>

    <!-- 체결 수량 -->
    <div class="flex justify-between items-center text-sm text-zinc-600">
      <div class="font-medium text-zinc-800">체결수량</div>
      <div>{{ order.volume }}</div>
    </div>

    <!-- 체결 금액 -->
    <div class="flex justify-between items-center text-sm text-zinc-600">
      <div class="font-medium text-zinc-800">체결금액</div>
      <div class="font-semibold text-blue-500">{{ orderAmount(order.price, order.volume) }} KRW</div>
    </div>

    <!-- 주문 유형 -->
    <div class="flex justify-between items-center text-sm text-zinc-600">
      <div class="font-medium text-zinc-800">주문 유형</div>
      <div>{{ getOrderOrdTypeText(order.ord_type) }}</div>
    </div>

    <!-- 추가 슬롯을 위한 공간 -->
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { formatPrice, formatTotal } from "@/utils/format";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});


// 생성 날짜 포맷 함수
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(date).toLocaleString("ko-KR", options);
};


const orderPrice = computed(() => formatPrice(props.order.price));

// 체결금액 계산 함수 (3자리마다 쉼표 추가)
const orderAmount = (price: number, volume: number) => {
  const amount = price * volume;
  return formatPrice(amount); // 여기서 다시 숫자로 변환하여 사용
};







// 주문 상태 텍스트 변환
const getOrderStateText = (state: string) => {
  switch (state) {
    case "done":
      return "체결 완료";
    case "cancel":
      return "주문 취소";
    case "wait":
      return "미채결";
    default:
      return "알 수 없음";
  }
};

// 주문 종류 텍스트 변환
const getOrderSideText = (side: string) => {
  switch (side) {
    case "bid":
      return "매수";
    case "ask":
      return "매도";
    default:
      return "알 수 없음";
  }
};

// 주문 종류에 따른 색상 클래스 반환
const getOrderSideClass = (side: string) => {
  switch (side) {
    case "bid":
      return "text-blue-500";  // 매수는 초록색
    case "ask":
      return "text-red-500";    // 매도는 빨간색
    default:
      return "text-zinc-600";   // 알 수 없는 상태는 회색
  }
};

// 주문 유형 텍스트 변환
const getOrderOrdTypeText = (ordType: string) => {
  switch (ordType) {
    case "limit":
      return "지정가 주문";
    case "price":
      return "시장가 매수";
    case "market":
      return "시장가 매도";
    default:
      return "알 수 없음";
  }
};
const getOrderStateClass = (state: string) => {
  switch (state) {
    case "done":
      return "text-blue-500";  // 체결 완료는 초록색
    case "cancel":
      return "text-red-500";    // 주문 취소는 빨간색
    case "wait":
      return "text-zinc-500";   // 미채결은 회색
    default:
      return "text-zinc-600";   // 알 수 없는 상태는 회색
  }
};
</script>
