<template>
  <button
    @click="goToApi"
    :class="[
      isLoading ? 'opacity-50 cursor-not-allowed' : '',
      isAuthenticated ? 'text-green-600' : ' text-red-600',
    ]"
    class="flex items-center gap-1 px-3 py-2 text-[13px]"
    :disabled="isLoading"
  >
    <LoaderCircle v-if="isLoading" class="animate-spin h-3 w-3" />
    <KeyRound v-if="!isLoading && isAuthenticated" class="h-3 w-3" />
    <OctagonX v-if="!isLoading && !isAuthenticated" class="h-3 w-3" />
    <span v-if="isLoading">API KEY 로딩 중...</span>
    <span v-else-if="isAuthenticated">API 키 활성화</span>
    <span v-else>API 키 비활성화</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/api-store";
import { LoaderCircle, KeyRound, OctagonX } from "lucide-vue-next";

const apiStore = useApiStore();
const router = useRouter();

const isAuthenticated = computed(() => apiStore.isAuthenticated);
const isLoading = computed(() => apiStore.isLoading);

const goToApi = () => {
  router.push({ name: "Apikey" });
};
</script>
