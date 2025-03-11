<template>
  <div class="grid w-full gap-4">
    <div class="flex flex-col items-center justify-center w-full h-auto">
      <img
        src="/images/apiKey.png"
        alt="Profile Edit"
        class="max-w-72"
      />
      <div class="flex flex-col gap-y-1.5 text-center">
        <h2 class="text-5xl leading-tight font-semibold tracking-tight">
          API 키 등록이 필요합니다
        </h2>
        <p class="text-sm text-muted-foreground">
          <span @click="openBithumbApi" class="underline text-orange-600"
            >빗썸 API</span
          >
          서비스를 이용하기 위해서는 API 키 등록이 필요합니다. 액세스 키와 시크릿 키를 입력해주세요.
        </p>
      </div>
    </div>

    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Access Key</Label>
        <div class="flex items-center justify-end w-full col-span-3 gap-2">
          <Input
            class="font-mono"
            id="accessKey"
            placeholder="Access Key를 입력하세요"
            v-model="formData.accessKey"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Secret Key</Label>
        <div class="flex items-center justify-end w-full col-span-3 gap-2">
          <Input
            class="font-mono"
            id="secretKey"
            placeholder="Secret Key를 입력하세요"
            v-model="formData.secretKey"
            required
          />
        </div>
      </div>

      <!-- 동의 체크박스 추가 -->
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="agreeToTerms"
          v-model="agreeToTerms"
        />
        <label for="agreeToTerms" class="text-sm">
          <ApiAgreement/> 및 <span class="text-blue-600">개인정보 보호정책</span>에 동의합니다.
        </label>
      </div>
    </div>

    <!-- 로딩 메시지 표시 및 슬라이드 업 애니메이션 적용 -->
    <transition name="slide-up" mode="out-in">
      <div
        v-if="loadingMessage"
        :key="loadingMessage"
        class="text-center text-sm text-gray-600"
      >
        {{ loadingMessage }}
      </div>
    </transition>

    <!-- 로그인 버튼 활성화 -->
    <Button size="lg" :disabled="!agreeToTerms || isLoading" @click="handleSubmit">
      <LoaderCircle v-if="isLoading" :class="{ 'animate-spin': isLoading }" />{{ isLoading ? "인증 중..." : "인증하기" }}
    </Button>
    
    <ApiGuide />
    <h3>⚠️ 주의 사항</h3>
    <ul>
      <li>본 서비스는 API 키를 클라이언트에서 처리합니다</li>
      <li>반드시 <strong>출금 권한 없는 키</strong>를 사용하세요</li>
      <li>공용 PC/모바일에서는 사용을 금지합니다</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useApiStore } from "@/stores/api-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast/use-toast";
import ApiGuide from "./ApiGuide.vue";
import ApiAgreement from "./ApiAgreement.vue";
import { LoaderCircle } from 'lucide-vue-next';

const apiStore = useApiStore();
const isLoading = computed(() => apiStore.isLoading);
const loadingMessage = computed(() => apiStore.loadingMessage);
const errorMessage = computed(() => apiStore.errorMessage);
const successMessage = computed(() => apiStore.successMessage);

const formData = ref({
  accessKey: "",
  secretKey: "",
});

const agreeToTerms = ref(false);
const { toast } = useToast();

async function handleSubmit() {
  try {
    await apiStore.saveApiKey(formData.value.accessKey, formData.value.secretKey);
    if (errorMessage.value) {
      toast({
        title: "API Key 저장 실패",
        description: errorMessage.value || "API Key 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } else if (successMessage.value) {
      toast({
        title: "API Key 저장 성공",
        description: successMessage.value,
        variant: "default",
      });
    }
  } catch (error: any) {
    toast({
      title: "API Key 저장 실패",
      description: error.message || "API Key 저장 중 오류가 발생했습니다.",
      variant: "destructive",
    });
  } finally {
    await apiStore.fetchApiKeyStatus();
  }
}

const openBithumbApi = () => {
  window.open("https://www.bithumb.com/react/api-support/management-api", "_blank");
};
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
.slide-up-enter-to, .slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
