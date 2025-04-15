<template>
  <div class="flex flex-col md:flex-row items-start gap-8">
    <!-- 텍스트 컨텐츠 -->
    <div class="flex-1">
      <h1 class="text-3xl md:text-5xl font-bold mb-4">LIVE 에어드랍 목록</h1>
      <p class="text-base md:text-base mb-8">
        지금 진행 중인 모든 에어드랍 이벤트를 확인하세요!<br />
        <span class="text-orange-400 font-mono">매일 업데이트</span>
      </p>

      <!-- 이벤트 태그 목록 -->
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-zinc-700/50 rounded-full text-sm"
          >NFT 드랍</span
        >
        <span class="px-3 py-1 bg-zinc-700/50 rounded-full text-sm"
          >신규 프로젝트</span
        >
        <span class="px-3 py-1 bg-zinc-700/50 rounded-full text-sm"
          >거래 보상</span
        >
      </div>
    </div>

    <!-- 화살표 아이콘 -->
    <img
      src="/images/banner-airdrop.webp"
      alt="에어드랍 코인 이미지"
      class="w-72 h-72 mx-auto"
    />
  </div>
</template>

<script lang="ts" setup></script>
