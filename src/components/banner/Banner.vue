<template>
  <div
    class="relative bg-cover bg-center w-full h-48 md:h-64 rounded-lg shadow-lg overflow-hidden"
    :style="`background-image: url(${backgroundImage})`"
  >
    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <!-- Text Content -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4"
    >
      <h1 class="text-xl md:text-3xl font-bold mb-2">Welcome!</h1>
      <p class="text-sm md:text-lg">
        빗썸 API 거래와 에어드랍을 즐기세요
      </p>
      <Airdrop class="mt-4" @click="onButtonClick" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import Airdrop from "@/components/banner/Airdrop.vue";  // MarketList 컴포넌트 추가

const backgroundImage =
  "https://i.pinimg.com/736x/8f/c8/34/8fc834e5b840b2b5ce5fe0c24a186bd1.jpg";

// Handle button click (e.g., navigate to another page)
const onButtonClick = () => {
  console.log("Button clicked!");
  // Perform your desired action here, such as `router.push('/start')`
};
</script>

<style scoped></style>
