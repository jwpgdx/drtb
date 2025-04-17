<template>
  <div class="container">
    <ErrorState
      v-if="!hasApiKey"
      image="apikey"
      title="API 키 등록이 필요합니다."
      content="서비스를 이용하기 위해서는 API 키 등록이 필요합니다. 액세스 키와 시크릿
      키를 입력해주세요."
    >
      <template #action>
        <button
          class="px-4 border border-orange-500 text-orange-500 text-sm rounded-3xl h-8"
          @click="goToApikeyRegister"
        >
          API 키 등록하기
        </button>
      </template>
    </ErrorState>

    <div v-if="hasApiKey" class="h-12 lg:h-14" />
    <div v-if="hasApiKey" class="text-3xl lg:text-4xl font-semibold">
      API 키 관리
    </div>
    <div v-if="hasApiKey" class="h-12 lg:h-24" />
    <ApikeyList v-if="hasApiKey" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/api-store";
import ApikeyList from "@/components/apikey/ApikeyList.vue";
import ErrorState from "@/components/ErrorState.vue";

const router = useRouter();
const apiStore = useApiStore();
const hasApiKey = computed(() => apiStore.hasApiKey);

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
</script>

<style scoped>
/* 추가 스타일 필요시 여기에 작성 */
</style>
