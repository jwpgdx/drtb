<template>
  <div class="container">
    <div class="relative flex w-full flex-col gap-6 md:flex-row">
      <div
        class="relative flex flex-1 flex-col items-center justify-center text-center text-white md:items-start md:text-left"
      >
        <h1 class="mb-4 text-6xl font-semibold">NFT is Life Evolution</h1>
        <p class="mb-8 text-xl text-zinc-400">
          The 'Evolution of Life' as told by NILE. Be a part of the dawn of a
          new civilization.
        </p>
        <button
          class="h-12 rounded-3xl border border-orange-500 px-4 text-orange-500"
          @click="onButtonClick"
        >
          Pay with Bitcoin
        </button>
      </div>

      <div class="flex flex-1 items-center justify-center">
        <img
          class="h-auto w-full"
          src="/images/banner-main.webp"
        />
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
