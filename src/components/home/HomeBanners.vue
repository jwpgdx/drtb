<template>
  <div class="relative w-full overflow-visible">
    <Flicking
      ref="flicking"
      class="container relative w-full"
      :options="{
        moveType: 'snap',
        bound: true,
        align: 'center',
        circular: false,
        renderOnlyVisible: false,
        defaultIndex: 0,
      }"
      :plugins="plugins"
    >
      <HomeBannerCard
        v-for="(item, index) in bannerCards"
        :key="index"
        :title="item.title"
        :content="item.content"
        :image="item.image"
        :selected="selectedIndex === index"
      />

      <template #viewport>
        <span class="flicking-arrow-prev"></span>
        <span class="flicking-arrow-next"></span>
        <div class="flicking-pagination"></div>
      </template>
    </Flicking>
    <div class="home-banners-gradient" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Flicking from "@egjs/vue3-flicking";
import { Arrow, Pagination } from "@egjs/flicking-plugins";
import HomeBannerCard from "./HomeBannerCard.vue";

const selectedIndex = ref(0);
const plugins = ref([new Arrow(), new Pagination({ type: "bullet" })]);

const bannerCards = [
  {
    title: "거래소 이동 지원금",
    content: "빗썸으로 이동하면 최소 100만원",
    image: "bithumb",
  },
  {
    title: "빗썸 멤버십",
    content: "등급별로 쌓이는 포인트, 리워드 혜택을 확인하세요",
    image: "bitcoin",
  },
  {
    title: "빗썸 10주년 기념",
    content: "국내 최저 수수료 최고의 멤버십 혜택",
    image: "chart",
  },
  {
    title: "웰컴 미션",
    content: "신규회원이라면? 미션 달성하고 2만원 받기",
    image: "date",
  },
  {
    title: "NFT 이벤트",
    content: "한정판 NFT 발행! 선착순 100명 한정",
    image: "security",
  },
];
</script>

<style>
.swiper-pagination-bullet {
  @apply m-2 h-2 w-2 bg-zinc-300 opacity-100;
}
.swiper-pagination-bullet-active {
  @apply scale-125 bg-orange-500;
}

/* 필요시 네비게이션 버튼의 활성 상태도 추가 */
.next:hover,
.prev:hover {
  @apply text-orange-500;
}

.home-banners-gradient {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100%;
  width: calc(100vw - 1024px);
  background: linear-gradient(
    to right,
    rgba(12, 12, 12, 0) 0%,
    rgba(12, 12, 12, 1) 50%
  );
  pointer-events: none; /* 버튼 클릭 방지 해제 */
  z-index: 2;
}
.flicking-pagination {
  position: relative;
  z-index: 3;
}
</style>
