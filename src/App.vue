<script setup lang="ts">
</script>

<template>
  <div class="app min-h-screen bg-gray-50 text-gray-900">
    <header class="p-4 bg-blue-500 text-white">
      <h1 class="text-xl font-bold">My Tailwind App</h1>
    </header>

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
