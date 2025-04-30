<template>
  <div class="container">
    <div class="relative flex w-full flex-col gap-6 lg:flex-row">
      <div
        class="relative flex flex-1 flex-col items-center justify-center text-center text-white lg:items-start lg:text-left"
      >
        <h1 class="main-text">Explore Crypto Galaxies</h1>
        <p class="sub-text">
          다양한 에어드랍 이벤트를 참여하고, 미션과 보상으로 나만의 여정을 시작하세요.
          <!--
          The 'Evolution of Life' as told by BITFFY. Be a part of the dawn of a
          new civilization.
          -->
          <!--가장 빠르게, 가장 정확하게 실시간 에어드랍 정보로 누구보다 먼저 기회를
          잡으세요.-->
        </p>
        <button
          class="h-12 rounded-3xl border border-orange-500 px-4 text-orange-500"
          @click="onButtonClick"
        >
          에어드랍 이벤트 참여하기
        </button>
      </div>

      <div class="flex flex-1 items-center justify-center">
        <img class="h-auto w-full" src="/images/banner-main.webp" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Handle button click (e.g., navigate to another page)
const onButtonClick = () => {
  // Perform your desired action here, such as `router.push('/start')`
};
</script>

<style lang="scss" scoped>
.main-text {
  font-size: clamp(32px, 5.46875vw, 70px);
  line-height: 1.17143;
  font-weight: 700;
  //letter-spacing: -0.015em;
  margin-bottom: clamp(14px, 1.95312vw, 28px);
  font-family: "SamsungSharpSans", sans-serif;
}

.sub-text {
  font-size: clamp(16px, 1.875vw, 24px);
  line-height: clamp(1.5, 1.58333, 1.66667);
  font-weight: 400;
  letter-spacing: -0.015em;
  margin-bottom: clamp(20px, 3.51562vw, 60px);

  @apply text-zinc-400;
}
@media only screen and (max-width: 480px) {
  .main-text {
    margin-top: clamp(20px, 3.51562vw, 60px);
  }
}
</style>
