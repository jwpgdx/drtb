<template>
  <div class="flex flex-col">
    <div
      class="relative grid grid-cols-1 gap-4 text-sm text-white lg:grid-cols-4"
    >
      <!-- Access Key -->
      <div class="flex flex-col lg:col-span-2">
        <span class="mb-2 text-xs text-zinc-500">Access Key</span>
        <div class="py-2">{{ accessKey ? accessKey : "-" }}</div>
      </div>

      <!-- Expire Date -->
      <div class="flex flex-col">
        <span class="mb-2 text-xs text-zinc-500">만료일</span>
        <div class="py-2">
          {{ formattedExpireAt ? formattedExpireAt : "-" }}
        </div>
      </div>

      <!-- 인증상태 + 에러메시지 -->
      <div class="flex flex-col">
        <span class="mb-2 text-xs text-zinc-500">인증상태</span>
        <div
          class="py-2"
          :class="isAuthenticated ? 'text-green-500' : 'text-red-500'"
        >
          {{ isAuthenticated ? "정상" : "비정상" }}
        </div>

        <p
          v-if="!isAuthenticated && errorMessage"
          class="mt-1 text-xs text-red-500"
        >
          {{ errorMessage }}
        </p>
      </div>
      <div
        class="absolute left-0 top-0 hidden h-5 w-full border-b-[1px] border-zinc-800 lg:block"
      />
    </div>

    <!-- ✅ 삭제 버튼은 아래쪽에 따로 배치 -->
    <div class="mt-24 flex w-full flex-col items-center gap-2">
      <button
        @click="deleteApiKey"
        :disabled="isDeleting"
        class="flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full border border-orange-600 px-4 text-[13px] text-orange-600"
      >
        <LoaderCircle
          v-if="isDeleting"
          class="size-3"
          :class="{ 'animate-spin': isDeleting }"
        />
        {{ isDeleting ? "삭제 중..." : "삭제" }}
      </button>
      <button
        @click="deleteApiKey"
        :disabled="isDeleting"
        class="flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-orange-600 px-4 text-[13px] text-black"
      >
        빗썸 api 바로가기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useApiStore } from "@/stores/api-store";
import { toast } from "vue3-toastify";
import { h } from "vue";
import { getFunctions, httpsCallable } from "firebase/functions";
import { LoaderCircle } from "lucide-vue-next";

const apiStore = useApiStore();
const isDeleting = ref(false);
const router = useRouter();
const route = useRoute();

const accessKey = computed(() => apiStore.accessKey);
const expireAt = computed(() => apiStore.expireAt);

const isAuthenticated = computed(() => apiStore.isAuthenticated);
const errorMessage = computed(() => apiStore.errorMessage);

// YYYY/MM/DD 포맷 변환
const formattedExpireAt = computed(() => {
  if (!expireAt.value) return "";
  const d = new Date(expireAt.value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
});

const deleteApiKey = async () => {
  if (isDeleting.value) return;
  const confirmed = window.confirm("정말 API 키를 삭제하시겠습니까?");
  if (!confirmed) return;
  try {
    isDeleting.value = true;
    await apiStore.deleteApiKeys();
    // 성공 토스트 표시
    toast("API 키가 성공적으로 삭제되었습니다.");
    router.push({ name: "Apikey" });
  } catch (error: any) {
    console.error("API 키 삭제 실패:", error);

    // 실패 토스트 표시
    toast(error.message || "API 키 삭제 중 오류가 발생했습니다.");
  } finally {
    isDeleting.value = false;
  }
};
</script>
