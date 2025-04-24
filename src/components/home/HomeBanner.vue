<template>
  <div class="container">
    <div
      @click="goToAirdrop"
      class="relative flex min-h-24 flex-row items-center gap-8 overflow-visible rounded-md bg-black px-4 py-6 lg:px-8"
    >
      <!-- 기존 컨텐츠 유지 -->
      <div class="z-10 max-w-[60%]">
        <h1 class="mb-2 text-xl font-semibold">
          <span class="text-orange-600">LIVE</span> 에어드랍 목록
        </h1>
        <p class="text-sm text-zinc-400">
          지금 진행 중인 모든 에어드랍 이벤트를 확인하세요!
        </p>
      </div>
      <img
        src="/images/home-banner-airdrop.webp"
        alt="에어드랍 코인 이미지"
        class="absolute bottom-0 right-2 h-44 w-auto lg:right-4 lg:h-52"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const goToAirdrop = () => {
  router.push({ name: "Airdrop" });
};
</script>
<style>
:root {
  --color-start: #e4ae4e; /* yellow-400 */
  --color-via: #eb7832; /* amber-400 */
  --color-end: #dd9b90; /* red-500 */
}

.gradient-bg {
  background-image: linear-gradient(
    135deg,
    var(--color-start) 0%,
    var(--color-via) 50%,
    var(--color-end) 100%
  );
  background-size: 400% 400%;
}

@keyframes gradient {
  0% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 100% 0%;
  }
}

.animate-gradient {
  animation: gradient 12s ease infinite;
  transition: background-position 0.5s ease;
}
</style>
