<template>
  <div class="container">
    <div class="relative flex flex-col gap-10 md:flex-row w-full">
      <div
        class="relative flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left text-white"
      >
        <h1 class="text-3xl md:text-5xl font-bold mb-4">
          NFT is Life Evolution
        </h1>
        <p class="text-base md:text-lg mb-8">
          The 'Evolution of Life' as told by NILE. Be a part of the dawn of a
          new civilization.
        </p>
        <button
          class="h-12 px-4 border border-orange-500 text-orange-500 rounded-3xl"
          @click="onButtonClick"
        >
          Pay with Bitcoin
        </button>
      </div>

      <div class="flex-1 flex justify-center items-center">
        <img
          class="w-full max-w-xs md:max-w-md h-auto"
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
