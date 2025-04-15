<template>
  <div
    @click="goToAirdrop"
    class="flex flex-row items-center gap-8 rounded-md py-4 px-6 lg:px-8 relative overflow-hidden gradient-bg animate-gradient"
  >
    <!-- 기존 컨텐츠 유지 -->
    <div class="flex-1">
      <h1 class="text-xl font-semibold mb-2 text-black">
        <span class="text-orange-600">LIVE</span> 에어드랍 목록
      </h1>
      <p class="text-sm text-zinc-800 opacity-90">
        지금 진행 중인 모든 에어드랍 이벤트를 확인하세요!<br />
      </p>
    </div>

    <img
      src="/images/banner-airdrop.webp"
      alt="에어드랍 코인 이미지"
      class="w-24 h-24 mx-auto"
    />
  </div>
</template>

<style>
:root {
  --color-start: #e4ae4e;   /* yellow-400 */
  --color-via: #eb7832;     /* amber-400 */
  --color-end: #dd9b90;     /* red-500 */
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
  0% { background-position: 100% 0%; }
  50% { background-position: 0% 100%; }
  100% { background-position: 100% 0%; }
}

.animate-gradient {
  animation: gradient 12s ease infinite;
  transition: background-position 0.5s ease;
}
</style>