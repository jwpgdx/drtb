<template>
    <div class="flex flex-col items-center justify-center bg-white p-8 rounded-3xl">
      <img
        src="https://i.pinimg.com/736x/cc/fd/90/ccfd9013f33a45d95aceb89023a5de2a.jpg"
        alt="404 이미지"
        class="w-80 h-auto"
      />
      <div class="text-center">
        <p class="text-lg font-semibold text-gray-700 mt-4">
            준비중인 서비스입니다.
        </p>
        <p class="mt-2 text-gray-500">
            빠른 시일 내에 업데이트 예정입니다.
        </p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const goHome = () => {
    router.push("/");
  };
  </script>
  
  <style scoped>
  </style>
  