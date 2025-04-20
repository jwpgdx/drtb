<template>
  <div class="relative mx-auto">
    <HomeMain />
    <div class="h-12 lg:h-24" />
    <HomeBanners />
    <div class="h-12 lg:h-24" />
    <HomeContents />
    <div class="h-12 lg:h-24" />
    <HomeBanner />

   

    <div class="h-12 lg:h-24" />

    <div class="h-12 lg:h-24" />

    <div class="m-12 text-center text-2xl font-semibold lg:text-3xl">
      오늘의 시세를 확인해 보세요
    </div>

    <div class="relative max-h-[500px] overflow-y-hidden">
      <MarketList class="container" :filterQuery="''" />

      <div class="market-list-container container">
        <div class="market-list-button-container">
          <router-link
            style="z-index: 10"
            to="/order"
            class="market-list-button"
          >
            전체 시세 보기
          </router-link>
        </div>
      </div>
    </div>
    <div class="h-12 lg:h-24" />

    <div class="m-12 text-center text-2xl font-semibold lg:text-3xl">FAQ</div>
    <div class="container">
      <Faq />
    </div>
    <div class="h-12 lg:h-24" />
    <HomeFooter />
  </div>
</template>

<script lang="ts" setup>
import MarketList from "@/components/MarketList.vue"; // MarketList 컴포넌트 추가
import HomeMain from "@/components/home/HomeMain.vue"; // MarketList 컴포넌트 추가
import HomeBanner from "@/components/home/HomeBanner.vue"; // MarketList 컴포넌트 추가
import HomeBanners from "@/components/home/HomeBanners.vue"; // MarketList 컴포넌트 추가
import HomeFooter from "@/components/home/HomeFooter.vue"; // MarketList 컴포넌트 추가
import Faq from "@/components/faq/Faq.vue";
import HomeContents from "@/components/home/HomeContents.vue"; // MarketList 컴포넌트 추가
</script>

<style lang="scss" scoped>
.market-list-container {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 240px;
  background: linear-gradient(
    to bottom,
    rgba(12, 12, 12, 0) 0%,
    rgba(12, 12, 12, 1) 80%
  );
  pointer-events: none; /* 버튼 클릭 방지 해제 */
}

.market-list-button-container {
  pointer-events: auto;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 32px;
}
.market-list-button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 14px;
  background-color: #1d1c1c;
  cursor: pointer;
}
</style>
