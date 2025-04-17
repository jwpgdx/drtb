<template>
  <div>
    <div class="flex flex-col gap-4 items-start">
      <div class="text-3xl font-semibold">API 키 발급 가이드</div>
      <div class="text-[15px] text-zinc-400 leading-relaxed">
        빗썸에서 안전하게 API 키를 발급받고 거래 기능을 연동해보세요.<br />
        아래 단계별 가이드를 따라가면 누구나 쉽게 발급할 수 있습니다.
      </div>
    </div>

    <Tabs v-model="step" class="w-full">
      <TabsContent value="1">
        <img
          :src="`/public/images/apikey-guide-0${step}.webp`"
          class="w-full h-auto object-contain rounded-sm my-8"
        />

        <div class="text-xl lg:text-2xl font-semibold">
          빗썸 API 페이지 접속하기
        </div>
        <div class="text-zinc-400 text-[15px] mt-2">
          먼저, <span class="text-white underline">빗썸 API 페이지</span>에
          접속합니다. 이 페이지에서는 API 키 발급 절차 및 관련 정보를 확인할 수
          있습니다.​ API 키를 발급받기 위해서는 빗썸 계정에 로그인해야 하며,
          보안 인증 단계를 완료해야 합니다. 또한, API 키 발급은 PC 웹 환경에서만
          가능하므로 모바일 환경에서는 발급이 제한됩니다.
        </div>
      </TabsContent>

      <TabsContent value="2">
        <img
          :src="`/public/images/apikey-guide-0${step}.webp`"
          class="w-full h-auto object-contain rounded-sm my-8"
        />
        <div class="text-xl lg:text-2xl font-semibold">API 접근 권한 설정</div>
        <div class="text-zinc-400 text-[15px] mt-2">
          API 키를 생성할 때는 <span class="text-white">API 2.0</span>을
          선택하고,<br />
          아래 항목들의 접근 권한을 반드시 활성화해야 합니다.
          <div
            class="flex flex-col gap-1 mt-5 py-3 px-4 rounded-sm bg-zinc-800 border border-zinc-900"
          >
            <div>
              <span class="text-zinc-200 inline-flex items-center gap-1"
                ><CircleCheck class="size-3 text-orange-500" />자산조회</span
              >&nbsp;&nbsp;현재 보유 중인 암호화폐 및 잔고 정보를 조회합니다.
            </div>
            <div>
              <span class="text-zinc-200 inline-flex items-center gap-1"
                ><CircleCheck class="size-3 text-orange-500" />주문조회</span
              >&nbsp;&nbsp;과거 및 현재의 주문 내역을 확인할 수 있습니다.
            </div>
            <div>
              <span class="text-zinc-200 inline-flex items-center gap-1"
                ><CircleCheck class="size-3 text-orange-500" />주문하기</span
              >&nbsp;&nbsp;API를 통해 실시간 매수/매도 주문을 실행합니다.
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="3">
        <img
          :src="`/public/images/apikey-guide-0${step}.webp`"
          class="w-full h-auto object-contain rounded-sm my-8"
        />

        <div class="text-xl lg:text-2xl font-semibold">IP 주소 등록하기</div>
        <div class="text-zinc-400 text-[15px] mt-2">
          API 키를 안전하게 사용하기 위해 <strong>허용된 IP 주소</strong>를
          반드시 등록해야 합니다. 등록한 IP 주소에서만 해당 API 키를 사용할 수
          있으며, 다른 IP에서는 접근이 차단됩니다. 보안상의 이유로 외부 서비스나
          서버의 IP를 정확하게 입력하는 것이 중요하며, 추후 변경이 필요한
          경우에도 API 설정 페이지에서 수정 가능합니다.
        </div>

        <div
          class="text-white text-[15px] mt-5 flex items-center justify-between"
        >
          현재 접속 중인 IP
          <button
            class="text-green-500 text-xs flex items-center gap-1"
            @click="openNaverIPCheck"
          >
            네이버에서 확인하기 <ChevronRight class="size-3" />
          </button>
        </div>

        <div
          class="flex items-center justify-between mt-2 py-3 px-4 rounded-sm bg-zinc-800 border border-zinc-900"
        >
          <div class="text-sm font-mono text-white">
            {{
              loading
                ? "IP 정보를 불러오는 중입니다..."
                : error
                ? "IP 정보를 불러올 수 없습니다."
                : `${currentIP}`
            }}
          </div>
          <button
            @click="handleCurrentIPCopy"
            class="flex items-center w-auto h-8 px-4 gap-2 bg-zinc-900 text-[13px] rounded-full"
          >
            <Copy class="size-3" />
            복사
          </button>
        </div>

        <ul class="list-disc pl-5 space-y-1 text-sm text-zinc-600 mt-2">
          <li>
            IP가 유동적으로 변경되는 환경에서는 API 호출이 차단될 수 있습니다.
          </li>
          <li>가급적이면 고정 IP를 사용하는 환경에서 API를 이용하세요.</li>
          <li>집, 회사 등 안전한 네트워크에서 사용을 권장합니다.</li>
        </ul>
      </TabsContent>

      <TabsContent value="4">
        <img
          :src="`/public/images/apikey-guide-0${step}.webp`"
          class="w-full h-auto object-contain rounded-sm my-8"
        />

        <div class="text-xl lg:text-2xl font-semibold">
          약관에 동의하고 발급받기
        </div>
        <div class="text-zinc-400 text-[15px] mt-2">
          API 키를 생성하기 전에, 아래 약관에 대한 동의가 필요합니다. 모든
          항목은 필수로 동의해야 하며, 각 항목을 눌러 내용을 확인할 수 있습니다.
          <strong>‘모두 동의’</strong>를 선택하면 한 번에 전체 약관에 동의할 수
          있습니다.
        </div>
      </TabsContent>

      <TabsContent value="5">
        <img
          :src="`/public/images/apikey-guide-0${step}.webp`"
          class="w-full h-auto object-contain rounded-sm my-8"
        />

        <div class="text-xl lg:text-2xl font-semibold">
          Access Key & Secret Key 발급하기
        </div>
        <div class="text-zinc-400 text-[15px] mt-2">
          약관에 동의한 후 <strong>API Key 생성</strong> 버튼을 누르면
          <strong>Access Key</strong>와 <strong>Secret Key</strong>가
          발급됩니다. 이 키들은 추후 다시 확인할 수 없으므로 반드시 안전한 곳에
          복사해 두세요.
        </div>

        <ul class="list-disc pl-5 space-y-1 text-sm text-zinc-600 mt-2">
          <li>
            <strong class="text-red-500"
              >Secret Key는 최초 1회만 확인할 수 있습니다.</strong
            >
            발급 후에는 다시 조회할 수 없으므로, 반드시 안전한 곳에 별도로
            저장해두시기 바랍니다.
          </li>
          <li>
            발급된 API Key는 제3자에게 노출되지 않도록 주의하세요. 노출될 경우,
            자산이 탈취당할 수 있습니다.
          </li>
          <li>
            API 키를 사용하는 서비스는 반드시 신뢰할 수 있는 환경에서만
            이용하시기 바랍니다.
          </li>
          <li>
            키 유출이 의심되거나 불필요해진 경우 즉시 삭제하고 새로
            발급받으세요.
          </li>
        </ul>
      </TabsContent>
    </Tabs>

    <div class="flex gap-12 mt-8 justify-between">
      <!-- 이전 버튼 -->
      <button
        class="flex items-center text-zinc-400 text-sm justify-start w-full h-12 px-4 gap-2 rounded-sm border border-zinc-800"
        @click="prevStep"
        :disabled="step === '1'"
      >
        <ChevronLeft class="size-4" />
        이전
      </button>

      <!-- 다음 버튼 (마지막 스텝에서는 '완료'로 변경) -->
      <button
        class="flex items-center text-zinc-400 text-sm justify-end w-full h-12 px-4 gap-2 rounded-sm border border-zinc-800"
        @click="nextStep"
      >
        {{ step === "5" ? "완료" : "다음" }}
        <ChevronRight v-if="step < 5" class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, CircleCheck, Copy } from "lucide-vue-next";

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
const emit = defineEmits(["close"]);

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
  if (step.value === "5") {
    emit("close");
  } else {
    step.value = (parseInt(step.value) + 1).toString();
  }
};

const openNaverIPCheck = () => {
  window.open(
    "https://search.naver.com/search.naver?where=nexearch&sm=top_sly.hst&fbm=0&acr=1&acq=%EB%82%B4+%EC%95%84%EC%9D%B4%ED%94%BC+&qdt=0&ie=utf8&query=%EB%82%B4+%EC%95%84%EC%9D%B4%ED%94%BC+%EC%A3%BC%EC%86%8C+%ED%99%95%EC%9D%B8",
    "_blank"
  );
};
const handleCurrentIPCopy = async () => {
  if (!currentIP.value || error.value) return;

  try {
    await navigator.clipboard.writeText(currentIP.value);
    window.alert("IP 주소가 복사되었습니다.");
  } catch (e) {
    window.alert("IP 복사에 실패했습니다. 다시 시도해주세요.");
    console.error("IP 복사 실패:", e);
  }
};
</script>
