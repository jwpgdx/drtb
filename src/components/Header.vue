<template>
  <header
    class="fixed top-0 left-0 right-0 p-4 bg-blue-500 text-white shadow-md z-50"
  >
    <div class="flex items-center justify-between">
      <!-- 이전으로 가기 버튼 -->
      <move-left
        class="w-6 h-6 mr-2 cursor-pointer"
        v-if="!isMainPage"
        @click="goBack"
      />

      <!-- 페이지별 헤더 내용 -->
      <div v-if="!isLoginPage" class="flex items-center space-x-4">
        <!-- OrderPage에서만 market 값 표시 -->
        <div v-if="isOrderPage" class="flex items-center space-x-2">
          <i
            :class="`cf cf-${getMarketSymbol(marketName)}`"
            class="coin-icon text-2xl"
          ></i>
          <h1 class="text-xl font-semibold">{{ marketName }}</h1>
        </div>
        <div v-else>
          <h1 class="text-xl font-semibold">DRTB Beta</h1>
        </div>

        <!-- 로그인/로그아웃 버튼 -->
        <div class="flex space-x-2">
          <Button v-if="!authStore.isAuthenticated" @click="goToLogin">
            로그인
          </Button>
          <div
            v-if="authStore.isAuthenticated"
            class="text-sm"
            @click="extendSession"
          >
            남은 시간: <span class="font-bold">{{ formattedTime }}</span>
          </div>
          <!-- 로그인된 경우 드롭다운 메뉴 표시 -->
          <DropdownMenu v-if="authStore.isAuthenticated">
            <DropdownMenuTrigger as-child>
              <Button size="icon">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User class="mr-2 h-4 w-4" />
                  <span>내정보</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="extendSession">
                  <TimerReset class="mr-2 h-4 w-4" />
                  <span>로그인 연장</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Coins class="mr-2 h-4 w-4" />
                  <span>자산현황</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings class="mr-2 h-4 w-4" />
                  <span>설정</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy class="mr-2 h-4 w-4" />
                  <span>고객센터</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem @click="logout">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- 타이머 표시 -->
        </div>
      </div>
    </div>
  </header>

  <!-- 본문 내용 -->
  <main class="pt-16">
    <!-- 페이지 콘텐츠 -->
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Coins,
  TimerReset,
  LifeBuoy,
  LogOut,
  Settings,
  User,
} from "lucide-vue-next";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast/use-toast";
import { h } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const { toast } = useToast();

// 현재 경로와 관련된 계산 속성
const isLoginPage = computed(() => router.currentRoute.value.path === "/login");
const isMainPage = computed(() => router.currentRoute.value.path === "/");
const isOrderPage = computed(() => router.currentRoute.value.name === "Order");

// OrderPage일 경우 :market 값을 가져오기
const marketName = computed(() => {
  const market = router.currentRoute.value.params.market;
  return Array.isArray(market) ? market[0] : market || "";
});

const getMarketSymbol = (market: string): string => {
  return market.replace('KRW-', '').toLowerCase() || 'btc';
};

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push("/login");
};

// 로그아웃 처리 함수
const logout = () => {
  authStore.logout(); // Pinia에서 상태 초기화
  router.push("/"); // 홈 페이지로 리다이렉트

  // 로그아웃 성공 토스트 메시지
  toast({
    title: "Logged out",
    description: "성공적으로 로그아웃되었습니다.",
    variant: "default",
    action: h(
      ToastAction,
      {
        altText: "확인",
      },
      {
        default: () => "확인", // 버튼 텍스트를 "확인"으로
      }
    ),
  });
};

// 뒤로 가기 버튼 처리 함수
const goBack = () => {
  const previousPath = router.currentRoute.value?.meta?.previousPath || null;

  if (previousPath === "/login") {
    router.push("/");
  } else {
    router.back();
  }
};

// 남은 시간을 "MM:SS" 형식으로 변환
const formattedTime = computed(() => {
  const minutes = Math.floor(authStore.remainingTime / 60);
  const seconds = authStore.remainingTime % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
});

// 세션 연장 처리
const extendSession = () => {
  authStore.extendSession();

  // 세션 연장 성공 토스트 메시지
  toast({
    title: "Session extended",
    description: "로그인 세션이 연장되었습니다.",
    variant: "default",
    action: h(
      ToastAction,
      {
        altText: "확인",
      },
      {
        default: () => "확인", // 버튼 텍스트를 "확인"으로
      }
    ),
  });
};
</script>

<style scoped>
/* 헤더 스타일 */
.coin-icon {
  font-size: 2rem;
}

/* 본문 내용이 헤더에 가리지 않도록 padding 추가 */
main {
  padding-top: 4rem; /* 헤더 높이만큼 여백 추가 */
}
</style>
