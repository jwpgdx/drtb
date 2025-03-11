<template>
  <img :src="coinImageUrl" alt="coin icon" />
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import md5 from "crypto-js/md5";

const props = defineProps<{ market: string }>();

// 코인 이미지 URL 생성
const coinImageUrl = computed(() => {
  const symbol = props.market.replace("KRW-", ""); // 'KRW-BTC' -> 'BTC'
  const hash = md5(symbol).toString(); // MD5 해시 값 생성
  return `https://content.bithumb.com/resources/img/coin/coin-${hash}.png`;
});
</script>
