<template>
  <div class="container h-screen flex flex-col justify-center max-w-md">
    <div class="text-2xl mb-6 text-center">API 키 등록이 필요합니다</div>
    <div class="text-sm mb-8 text-center text-muted-foreground">
      <button
        class="inline-flex items-center gap-1 underline text-blue-600"
        @click="openBithumbApi"
      >
        빗썸 API <ExternalLink class="w-4 h-4" />
      </button>
      서비스를 이용하기 위해서는 API 키 등록이 필요합니다. 액세스 키와 시크릿
      키를 입력해주세요.
    </div>

    <form
      class="flex gap-6 flex-col w-full items-center"
      @submit.prevent="handleSubmit"
    >
      <div class="api-card text-sm text-zinc-400">
        <div>
          <label for="first_name" class="block mb-1 text-[13px] font-semibold"
            >Access Key</label
          >
          <input
            type="text"
            id="accessKey"
            v-model="formData.accessKey"
            class="font-mono bg-zinc-900 border border-zinc-700 text-white text-sm rounded-sm p-2.5 w-full focus:outline-none focus:ring-3 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        <div>
          <label for="first_name" class="block mb-1 text-[13px] font-semibold"
            >Secret Key</label
          >
          <input
            type="text"
            id="secretKey"
            v-model="formData.secretKey"
            class="font-mono bg-zinc-900 border border-zinc-700 text-white text-sm rounded-sm p-2.5 w-full focus:outline-none focus:ring-3 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                class="w-4 h-4 border border-zinc-300 rounded-sm bg-zinc-50 focus:ring-3 focus:ring-blue-300 dark:bg-zinc-700 dark:border-zinc-600 dark:focus:ring-blue-600 dark:ring-offset-zinc-800"
                required
              />
            </div>
            <label for="remember" class="ms-2 font-semibold"
              >I agree with the
              <a
                href="#"
                class="text-blue-600 hover:underline dark:text-blue-500"
                >terms and conditions</a
              >.</label
            >
          </div>

          <div class="cursor-pointer" @click="handleClickEvent()">
            <CircleHelp class="size-4 text-zinc-500" />
            <v-dialog v-model="dialog">
              <ApikeyGuide @close="dialog = false" />
            </v-dialog>
          </div>
        </div>
      </div>
      <button
        class="w-[340px] h-12 flex items-center gap-2 justify-center max-w-[90%] rounded-sm bg-orange-500 text-black"
        type="submit"
      >
        <LoaderCircle
          v-if="isLoading"
          class="size-4"
          :class="{ 'animate-spin': isLoading }"
        />
        <transition name="slide-up" mode="out-in">
          <span v-if="loadingMessage" :key="loadingMessage">
            {{ loadingMessage }}
          </span>
        </transition>
        <span>
          {{ isLoading ? "" : "인증하기" }}
        </span>
      </button>
    </form>
    <div class="flex flex-col items-center text-[13px] mt-2">
      <div>
        반드시
        <span class="font-semibold">출금 권한 없는 키</span>를 사용하세요.
      </div>
      <div>
        <span class="font-semibold">공용 PC/모바일</span>에서는 사용을 금지합니다.
      </div>
    </div>
    <!-- 로딩 메시지 표시 및 슬라이드 업 애니메이션 적용 -->

    <!-- 로그인 버튼 활성화 -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useApiStore } from "@/stores/api-store";
import { toast } from "vue3-toastify";
import { LoaderCircle, ExternalLink, CircleHelp } from "lucide-vue-next";
import VDialog from "@/v-components/v-dialog.vue";

const apiStore = useApiStore();
const isLoading = computed(() => apiStore.isLoading);
const loadingMessage = computed(() => apiStore.loadingMessage);
const errorMessage = computed(() => apiStore.errorMessage);
const successMessage = computed(() => apiStore.successMessage);
const router = useRouter();

const dialog = ref(false);
const handleClickEvent = () => {
  dialog.value = true;
};

const formData = ref({
  accessKey: "",
  secretKey: "",
});

const agreeToTerms = ref(false);

async function handleSubmit() {
  try {
    await apiStore.saveApiKey(
      formData.value.accessKey,
      formData.value.secretKey
    );
    if (errorMessage.value) {
      console.log('errorMessage', errorMessage.value);
      toast(errorMessage.value || "API Key 저장 중 오류가 발생했습니다.");
    } else if (successMessage.value) {
      toast(successMessage.value);
      router.push({ name: 'Apikey' });
    }
  } catch (error: any) {
    console.log('catcherrorMessage', error.message);
    toast(error.message || "API Key 저장 중 오류가 발생했습니다.");
  } finally {
    await apiStore.fetchApiKeyStatus();
  }
}

const openBithumbApi = () => {
  window.open(
    "https://www.bithumb.com/react/api-support/management-api",
    "_blank"
  );
};

const ApikeyGuide = defineAsyncComponent(
  () => import("@/components/apikey/ApikeyGuide.vue")
);
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.api-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  width: 100%;
  max-width: 90vw;
  border-radius: 12px;
  background: lch(8.3 1.867 272);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 20px;
  overflow: hidden;
}
</style>
