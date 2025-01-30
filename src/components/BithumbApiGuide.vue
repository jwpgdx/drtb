<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button class="text-sm font-medium underline" variant="link">
        <CircleHelp class="w-3 h-3" /> 빗썸 API 사용을 위한 API Key 발급방법
      </Button>
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>API Key 발급 방법</DialogTitle>
        <DialogDescription>
          단계별 가이드를 따라 API 키를 발급하세요.
        </DialogDescription>
      </DialogHeader>

      <!-- Step 표시 -->
      <Tabs v-model="step" class="w-full">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="1">Step 1</TabsTrigger>
          <TabsTrigger value="2">Step 2</TabsTrigger>
          <TabsTrigger value="3">Step 3</TabsTrigger>
          <TabsTrigger value="4">Step 4</TabsTrigger>
        </TabsList>

        <!-- Step 1 -->
        <TabsContent value="1">
          <div class="space-y-2">
            <h3 class="text-lg font-semibold">1. 빗썸 API 페이지 접속</h3>
            <p>
              <a
                href="https://www.bithumb.com/react/api-support/management-api"
                target="_blank"
                class="text-blue-600 underline"
              >
                빗썸 API 페이지
              </a>
              에 접속합니다.
            </p>
          </div>
        </TabsContent>

        <!-- Step 3 -->
        <TabsContent value="2">
          <div class="space-y-2">
            <h3 class="text-lg font-semibold">3. API 접근 권한 설정</h3>
            <p>
              API 2.0을 선택 한 후, API 활성 항목을 다음과 같이 설정 합니다.<br>
              <strong>✅ 자산조회</strong> <strong>✅ 주문조회</strong> <strong>✅ 주문하기</strong>
            </p>
            <img
                src="https://drtb.web.app/images/BithumbApiGuide-2.png"
                alt="API Key 발급 데모 이미지"
                class="w-full h-auto"
              />
          </div>
        </TabsContent>

        <!-- Step 2 -->
        <TabsContent value="3">
          <div class="space-y-2">
            <h3 class="text-lg font-semibold">
              2. Access Key & Secret Key 발급
            </h3>
            <p>
              API Key를 생성하고, <strong>Access Key</strong>와
              <strong>Secret Key</strong>를 복사해 둡니다.
            </p>
            <div class="mt-4">
              
            </div>
          </div>
        </TabsContent>

        

        <!-- Step 4: IP 주소 등록 -->
        <TabsContent value="4">
          <div class="space-y-2">
            <h3 class="text-lg font-semibold">4. IP 주소 등록</h3>
            <p>
              API 키를 사용할 IP 주소를 등록해야 합니다. 등록된 IP에서만 API를
              사용할 수 있습니다.
            </p>

            <div v-if="loading" class="text-gray-500 text-sm">
              IP 정보를 불러오는 중...
            </div>
            <div v-else-if="error" class="text-red-500 text-sm">
              IP 정보를 불러올 수 없습니다.
            </div>
            <div v-else class="bg-gray-100 p-2 rounded text-sm font-medium">
              현재 접속 중인 IP:
              <span class="text-blue-600">{{ currentIP }}</span>
            </div>

            <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
              <li>
                IP가 <strong>유동적으로 변경되는 환경</strong>에서는 API 호출이
                차단될 수 있습니다.
              </li>
              <li>
                가급적이면 <strong>고정 IP</strong>를 사용하는 환경에서 API를
                이용하세요.
              </li>
              <li>
                집, 회사 등 <strong>안전한 네트워크</strong>에서 사용을
                권장합니다.
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter class="flex justify-between">
        <!-- 이전 버튼 -->
        <Button variant="secondary" @click="prevStep" :disabled="step === '1'">
          이전
        </Button>

        <!-- 다음 버튼 (마지막 스텝에서는 '완료'로 변경) -->
        <Button variant="default" @click="nextStep">
          {{ step === "4" ? "완료" : "다음" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-vue-next";

const isOpen = ref(false);
const step = ref("1"); // 기본 Step 1부터 시작
const currentIP = ref(""); // 현재 IP 저장
const loading = ref(true);
const error = ref(false);

// IP 정보 가져오기
const fetchIP = async () => {
  try {
    loading.value = true;
    error.value = false;
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    currentIP.value = data.ip;
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 다이얼로그 열릴 때 IP 가져오기
onMounted(fetchIP);

// 이전 스텝으로 이동
const prevStep = () => {
  if (step.value !== "1") {
    step.value = (parseInt(step.value) - 1).toString();
  }
};

// 다음 스텝으로 이동
const nextStep = () => {
  if (step.value === "4") {
    isOpen.value = false; // 마지막 단계에서는 닫기
  } else {
    step.value = (parseInt(step.value) + 1).toString();
  }
};
</script>
