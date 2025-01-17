<template>
  <header class="p-4 bg-blue-500 text-white">
    <h1 class="text-xl font-bold">My Tailwind App</h1>
    
    <!-- 로그인 상태에 따라 버튼을 다르게 표시 -->
    <button 
      v-if="!authStore.isAuthenticated" 
      @click="goToLogin" 
      class="mr-2 bg-green-500 px-4 py-2 rounded"
    >
      로그인
    </button>
    
    <button 
      v-if="authStore.isAuthenticated" 
      @click="logout" 
      class="bg-red-500 px-4 py-2 rounded"
    >
      로그아웃
    </button>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();
const router = useRouter();

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push("/login");
};

// 로그아웃 처리 함수
const logout = () => {
  authStore.logout(); // Pinia에서 상태 초기화
  router.push("/"); // 홈 페이지로 리다이렉트
};
</script>

<style scoped>
/* 헤더 스타일 추가 */
</style>
