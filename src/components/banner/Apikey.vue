<template>
    <div class="w-full bg-gradient-to-r from-indigo-400 to-purple-500 py-3 px-4">
      <div class="flex items-center justify-between gap-2">
        <!-- Text Content -->
        <div class="flex items-center gap-2">
          <KeyRound class="w-4 h-4 text-white" />
          <span class="text-sm text-white font-medium">
            거래 기능 사용을 위해 API 키를 등록해주세요
          </span>
        </div>
  
        <!-- Action Button -->
        <button 
          @click="goToApi"
          class="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
        >
          <span class="text-xs text-white font-semibold">설정하기</span>
          <MoveRight class="w-3 h-3 text-white" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  import { MoveRight, KeyRound } from "lucide-vue-next";
  
  const router = useRouter();
  
  const goToApi = () => {
    router.push({ name: "Apikey" });
  };
  </script>