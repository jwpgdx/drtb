<template>
  <div class="container">
    <HomeContent
      v-for="(item, index) in homeContents"
      :key="index"
      :tag="item.tag"
      :title="item.title"
      :content="item.content"
      :image="item.image"
    />
  </div>
</template>

<script lang="ts" setup>
import HomeContent from "@/components/home/HomeContent.vue"; // MarketList 컴포넌트 추가

const homeContents = [
  {
    tag: "강력한 보안",
    title: "안심하고 거래하세요",
    content:
      "실시간 이상 거래 탐지, 다중 인증 시스템, 데이터 암호화를 통해 회원님의 자산을 안전하게 보호합니다. 믿을 수 있는 거래 환경을 제공합니다.",
    image: "security",
  },
  {
    tag: "실시간 주문 체결",
    title: "실시간 체결, 빠른 반응",
    content:
      "시장가/지정가 주문을 원하는 타이밍에 바로 실행. 거래 속도에서 차이가 납니다.",
    image: "trade",
  },
];
</script>
