<template>
    <div class="flex flex-col items-center justify-center bg-white p-8 rounded-3xl">
      <!-- 이미지 -->
      <img
        src="https://i.pinimg.com/736x/e2/ef/2f/e2ef2f3b8d34bf4cb78deb1d857d6ecb.jpg"
        alt="404 이미지"
        class="w-80 h-auto"
      />
      <!-- 텍스트 -->
      <div class="text-center">
        <p class="text-lg font-semibold text-gray-700 mt-4">
            로그인이 필요한 서비스
        </p>
        <p class="mt-2 text-gray-500">
            이 페이지를 이용하려면 로그인이 필요합니다.
        </p>
        <Button
        @click="goToLogin"
        class="mt-6"
      >
        <Lock class="w-5 h-5 mr-2" />
        로그인 하러 가기
      </Button>
      </div>
    </div>
  </template>

  <script lang="ts" setup>
  import { useRouter, useRoute } from "vue-router";
  import { Lock } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  
  const router = useRouter();
  const route = useRoute();
  
  const goToLogin = () => {
    router.replace(`/login?redirect=${route.fullPath}`);
  };
  </script>
  
  <style scoped>
  /* 추가적인 스타일을 원하는 경우 여기에 작성 */
  </style>
  