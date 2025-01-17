<script setup lang="ts">
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";

const router = useRouter();


</script>

<template>
  <div class="app min-h-screen bg-gray-50 text-gray-900">
    <Header />
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
