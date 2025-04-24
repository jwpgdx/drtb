<template>
  <div class="container">
    <div class="relative flex w-full flex-col gap-6 lg:flex-row">
      <div
        class="relative flex flex-1 flex-col items-center justify-center text-center text-white lg:items-start lg:text-left"
      >
        <h1 class="mb-4 text-6xl font-semibold">DROP THE BIT</h1>
        <p class="mb-8 text-xl text-zinc-400">
          가장 빠르게, 가장 정확하게 실시간 에어드랍 정보로 누구보다 먼저 기회를
          잡으세요.
        </p>
        <button
          class="h-12 rounded-3xl border border-orange-500 px-4 text-orange-500"
          @click="onButtonClick"
        >
          에어드랍 정보 보기
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

<style scoped></style>
