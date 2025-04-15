<template>
  <div class="flex flex-col">
    <div class="relative grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white">
      <!-- Access Key -->
      <div class="flex flex-col">
        <span class="text-zinc-500 text-xs mb-2">Access Key</span>
        {{ accessKey ? accessKey : "-" }}
      </div>

      <!-- Expire Date -->
      <div class="flex flex-col">
        <span class="text-zinc-500 text-xs mb-2">만료일</span>
        <span>{{ formattedExpireAt ? formattedExpireAt : "-" }}</span>
      </div>

      <!-- 인증상태 + 에러메시지 -->
      <div class="flex flex-col">
        <span class="text-zinc-500 text-xs mb-2">인증상태</span>
        <span :class="isAuthenticated ? 'text-green-500' : 'text-red-500'">
          {{ isAuthenticated ? "정상" : "비정상" }}
        </span>

        <p
          v-if="!isAuthenticated && errorMessage"
          class="text-red-500 text-xs mt-1"
        >
          {{ errorMessage }}
        </p>
      </div>
      <div class="absolute hidden lg:block top-0 left-0 w-full h-5 border-b-[1px] border-zinc-800 "/>
    </div>

    <!-- ✅ 삭제 버튼은 아래쪽에 따로 배치 -->
    <div class="flex w-full flex-col items-center gap-2 mt-24">
      <button
        @click="deleteApiKey"
        :disabled="isDeleting"
        class="max-w-sm flex w-full items-center justify-center h-12 px-4 gap-2 border border-orange-600 text-orange-600 rounded-full text-[13px]"
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
        class="max-w-sm flex w-full items-center justify-center h-12 px-4 gap-2 bg-orange-600 text-black rounded-full text-[13px]"
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
import { useToast } from "@/components/ui/toast/use-toast";
import { h } from "vue";
import ToastAction from "@/components/ui/toast/ToastAction.vue";
import { getFunctions, httpsCallable } from "firebase/functions";
import { LoaderCircle } from "lucide-vue-next";

const apiStore = useApiStore();
const { toast } = useToast();
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
    toast({
      title: "API 키 삭제 완료",
      description: "API 키가 성공적으로 삭제되었습니다.",
      variant: "default",
      action: h(ToastAction, { altText: "확인" }, { default: () => "확인" }),
    });
    router.push({ name: "Apikey" });
  } catch (error: any) {
    console.error("API 키 삭제 실패:", error);

    // 실패 토스트 표시
    toast({
      title: "API 키 삭제 실패",
      description: error.message || "API 키 삭제 중 오류가 발생했습니다.",
      variant: "destructive",
      action: h(
        ToastAction,
        {
          altText: "다시 시도",
        },
        () => "다시 시도"
      ),
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>
