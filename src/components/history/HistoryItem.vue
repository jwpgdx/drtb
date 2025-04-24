<template>
  <tr
    class="cursor-pointer border-b border-zinc-900 text-[13px] transition hover:bg-zinc-900"
    @click="$emit('select', order)"
  >
    <td class="px-1 py-3">{{ formattedDate }}</td>
    <td class="px-1 py-3">{{ order.market }}</td>
    <td
      class="px-1 py-3"
      :class="{
        'text-blue-500': order.side === 'bid',
        'text-red-500': order.side === 'ask',
        'text-zinc-400': order.side === 'cancel',
      }"
    >
      {{ sideText }}
    </td>
    <td class="px-1 py-3">{{ order.volume }}</td>
    <td class="px-1 py-3">{{ priceText }}</td>
    <td class="px-1 py-3">{{ totalText }}</td>
  </tr>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps<{
  order: any;
}>();

const formattedDate = computed(() => {
  return props.order.timestamp?.toDate?.().toLocaleString() || "-";
});

const sideText = computed(() =>
  props.order.side === "bid"
    ? "매수"
    : props.order.side === "ask"
      ? "매도"
      : props.order.side === "cancel"
        ? "취소"
        : "-",
);

const totalText = computed(() => {
  const volume = parseFloat(props.order.volume);
  const price = parseFloat(props.order.price);
  const total = volume * price;
  return isNaN(total) ? "-" : Math.floor(total).toLocaleString();
});

const priceText = computed(() => {
  const price = parseFloat(props.order.price);
  return isNaN(price) ? "-" : price.toLocaleString();
});
</script>
