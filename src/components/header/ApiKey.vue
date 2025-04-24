<template>
  <div class="relative border-b border-zinc-700 py-2">
    <span class="px-3 text-[11px] text-zinc-400">API 키 상태</span>

    <button
      @click="goToApi"
      :class="[
        isLoading ? 'cursor-not-allowed text-black' : '',
        isAuthenticated ? 'text-green-600' : 'text-red-600',
      ]"
      class="flex w-full items-center justify-between gap-1 rounded-sm px-3 py-2 text-[13px] hover:bg-zinc-900"
      :disabled="isLoading"
    >
      <span v-if="isLoading">상태 확인 중...</span>
      <span v-else-if="isAuthenticated">이용 가능 - 키 관리</span>
      <span v-else>이용 제한 - 확인 필요</span>
      <LoaderCircle v-if="isLoading" class="h-3 w-3 animate-spin" />
      <ChevronRight v-else class="size-3" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/api-store";
import {
  LoaderCircle,
  KeyRound,
  OctagonX,
  ChevronRight,
} from "lucide-vue-next";

const apiStore = useApiStore();
const router = useRouter();

const isAuthenticated = computed(() => apiStore.isAuthenticated);
const isLoading = computed(() => apiStore.isLoading);

const goToApi = () => {
  router.push({ name: "Apikey" });
};
</script>
