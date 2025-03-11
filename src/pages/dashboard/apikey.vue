<template>
  <div class="grid w-full gap-4">
    <ApiList v-if="isAuthenticated" />

    <ApiInput v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useApiStore } from "@/stores/api-store";
import ApiInput from "@/components/api/ApiInput.vue";
import ApiList from "@/components/api/ApiList.vue";

const apiStore = useApiStore();
const isAuthenticated = computed(() => apiStore.isAuthenticated);

onMounted(async () => {
  try {
    await apiStore.fetchApiKeyStatus();
  } catch (error) {
    console.error("Failed to fetch API keys status:", error);
  }
});
</script>

<style scoped>
/* 추가 스타일 필요시 여기에 작성 */
</style>
