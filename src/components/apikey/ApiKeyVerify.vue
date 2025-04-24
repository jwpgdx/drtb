<template>
  <div class="container">
    <ErrorState
      v-if="apiState === 'missing'"
      image="apikey"
      title="API 키 등록이 필요합니다."
      content="서비스를 이용하기 위해서는 API 키 등록이 필요합니다. 액세스 키와 시크릿 키를 입력해주세요."
    >
      <template #action>
        <button
          class="h-8 rounded-3xl border border-orange-500 px-4 text-sm text-orange-500"
          @click="goToApikeyRegister"
        >
          API 키 등록하기
        </button>
      </template>
    </ErrorState>

    <ErrorState
      v-else-if="apiState === 'error'"
      image="error"
      title="API 키 검증 실패"
      :content="apiStore.errorMessage || 'API 키 검증 중 오류가 발생했습니다.'"
    >
      <template #action>
        <button
          class="h-8 rounded-3xl border border-orange-500 px-4 text-sm text-orange-500"
          @click="goToApikey"
        >
          API 키 관리하기
        </button>
      </template>
    </ErrorState>

    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/api-store";
import ErrorState from "@/components/ErrorState.vue";

const router = useRouter();
const apiStore = useApiStore();

const apiState = computed(() => {
  if (!apiStore.hasApiKey) return "missing";
  if (apiStore.hasApiKey && !apiStore.isAuthenticated) return "error";
  return "ok";
});

onMounted(async () => {
  try {
    await apiStore.fetchApiKeyStatus();
  } catch (error) {
    console.error("Failed to fetch API keys status:", error);
  }
});

const goToApikeyRegister = () => {
  router.push({ name: "ApikeyRegister" });
};
const goToApikey = () => {
  router.push({ name: "Apikey" });
};
</script>

<style scoped>
/* 추가 스타일 필요시 여기에 작성 */
</style>
