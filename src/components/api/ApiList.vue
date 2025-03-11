<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">API Key 리스트</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full w-full table-fixed divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Access Key
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              만료일
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              인증상태
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <!-- Access Key: 길어지면 자동 줄바꿈 -->
            <td class="px-4 py-4 text-sm text-gray-900 whitespace-normal break-words w-48">
              {{ accessKey }}
            </td>
            <!-- 만료일: YYYY/MM/DD 포맷 -->
            <td class="px-4 py-4 text-sm text-gray-900 w-32">
              {{ formattedExpireAt }}
            </td>
            <!-- 인증상태: 한 줄 유지 -->
            <td class="px-4 py-4 text-sm w-24">
              <span :class="isAuthenticated ? 'text-green-500' : 'text-red-500'">
                {{ isAuthenticated ? '정상' : '비정상' }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm w-32">
              <Button 
                type="button" 
                variant="secondary" 
                @click="deleteApiKey"
                :disabled="isDeleting"
              >
              <LoaderCircle v-if="isDeleting" :class="{ 'animate-spin': isDeleting }" />{{ isDeleting ? '삭제 중...' : '삭제' }}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useApiStore } from "@/stores/api-store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { h } from "vue";
import ToastAction from "@/components/ui/toast/ToastAction.vue";
import { getFunctions, httpsCallable } from "firebase/functions";
import { LoaderCircle } from 'lucide-vue-next';

const apiStore = useApiStore();
const { toast } = useToast();
const isDeleting = ref(false);

const accessKey = computed(() => apiStore.accessKey);
const expireAt = computed(() => apiStore.expireAt);
const isAuthenticated = computed(() => apiStore.isAuthenticated);

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
  } catch (error: any) {
    console.error("API 키 삭제 실패:", error);
    
    // 실패 토스트 표시
    toast({
      title: "API 키 삭제 실패",
      description: error.message || "API 키 삭제 중 오류가 발생했습니다.",
      variant: "destructive",
      action: h(ToastAction, {
        altText: "다시 시도"
      }, () => "다시 시도"),
    });
  } finally {
    isDeleting.value = false;
  }
};

</script>