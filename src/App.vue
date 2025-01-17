<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";

const router = useRouter();
const isLoginPage = computed(() => router.currentRoute.value.path === "/login");


// 로그인 버튼 클릭 시 로그인 페이지로 이동
const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div class="app min-h-screen bg-gray-50 text-gray-900">
    <Header v-if="!isLoginPage" />
    <main class="p-4">
      <RouterView />
    </main>

    <footer class="p-4 bg-gray-800 text-white text-center">
      <p>© 2025 My App. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
/* Scoped 스타일이 필요하면 여기 추가 */
</style>
