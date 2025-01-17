<template>
  <header class="p-4 bg-blue-500 text-white" >
    <button 
      v-if="!isMainPage"
      @click="goBack" 
      class="mr-2 bg-gray-500 px-4 py-2 rounded"
    >
      뒤로가기
    </button>

    <div v-if="!isLoginPage">
        <h1 class="text-xl font-bold">My Tailwind App</h1>
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

    </div>
      
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { computed } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const isLoginPage = computed(() => router.currentRoute.value.path === "/login");
const isMainPage = computed(() => router.currentRoute.value.path === "/");

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push("/login");
};

// 로그아웃 처리 함수
const logout = () => {
  authStore.logout(); // Pinia에서 상태 초기화
  router.push("/"); // 홈 페이지로 리다이렉트
};
const goBack = () => {
  // currentRoute를 통해 이전 경로를 확인
  const previousPath = router.currentRoute.value?.meta?.previousPath || null;

  // 이전 페이지가 로그인 페이지라면 홈으로 이동
  if (previousPath === "/login") {
    router.push("/");
  } else {
    router.back();
  }
};
</script>

<style scoped>
/* 헤더 스타일 추가 */
</style>
