<template>
  <div
    class="flex flex-col items-center justify-center p-6 text-center "
  >
    <div class="h-6" />
      <img
      :src="`/images/error-${image}.webp`"
      :alt="title"
        class="w-56 lg:w-64 h-auto  relative object-contain animate-fadeIn"
      />
    <h2 class="text-lg font-semibold text-white mb-2">{{ title }}</h2>
    <p class="text-zinc-400 text-sm max-w-md">{{ content }}</p>
    <div class="h-8" />
    <!--
    <button
      class="px-4 border border-orange-500 text-orange-500 text-sm rounded-3xl h-8"
      @click="onButtonClick"
    >
    로그인하러 가기
    </button>
    -->

    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  image: {
    type: String,
    required: true,
    default: "list", // list, auth, wallet 등
  },
  title: {
    type: String,
    required: true,
    default: "오류가 발생했습니다",
  },
  content: {
    type: String,
    required: true,
    default: "페이지를 새로 고침하거나 나중에 다시 시도해주세요.",
  },
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
