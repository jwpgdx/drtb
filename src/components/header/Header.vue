<template>
  <header>
    <!-- 이전으로 가기 버튼 -->
    <img
      class="w-12 h-12 cursor-pointer "
      src="/icons/arrow-left.webp"
      v-if="layoutMeta.showBack"
      @click="goBack"
    />

    <img
      v-if="layoutMeta.showLogo"
      class="w-auto h-10 lg:h-12 cursor-pointer "
      src="/images/logo.webp"
      @click="goToRouter('Home')"
    />

    <div v-if="!isLoginPage" class="flex items-center space-x-4">
      <!-- OrderPage에서만 market 값 표시 -->
      <div v-if="isOrderPage" class="flex items-center space-x-2">
        <Coin :market="marketName" class="w-8 h-8 mr-4" />
        <h1 class="text-xl font-semibold">{{ marketName }}</h1>
      </div>
    </div>

    <div v-if="!isLoginPage" class="flex gap-2 items-center">
      <div
        class="hidden lg:flex items-center h-12 gap-7 px-6 bg-black rounded-xl"
      >
        <button
          v-for="(item, index) in menuItems"
          :key="index"
          class="text-sm"
          @click="goToRouter(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
      <User />
      <MobileMenu />
    </div>

    <!-- 페이지별 헤더 내용 -->
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { computed } from "vue";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast/use-toast";
import { h } from "vue";
import MobileMenu from "./MobileMenu.vue";
import User from "./User.vue";
import Coin from "@/components/icons/Coin.vue"; // MD5 해시 생성용 라이브러리

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { toast } = useToast();


// 현재 경로와 관련된 계산 속성
const layoutMeta = computed(() => route.meta.layout || {});
const isLoginPage = computed(() => router.currentRoute.value.path === "/login");
const isMainPage = computed(() => router.currentRoute.value.path === "/");
const isOrderPage = computed(() => router.currentRoute.value.name === "Order");
const isAssetsPage = computed(
  () => router.currentRoute.value.name === "Assets"
);

// OrderPage일 경우 :market 값을 가져오기
const marketName = computed(() => {
  const market = router.currentRoute.value.params.market;
  return Array.isArray(market) ? market[0] : market || "";
});

const getMarketSymbol = (market: string): string => {
  return market.replace("KRW-", "").toLowerCase() || "btc";
};

const menuItems = [
  { value: "Orders", label: "거래소" },
  { value: "Assets", label: "자산" },
  { value: "Airdrop", label: "에어드랍" },
  { value: "Support", label: "고객센터" },
];

// 로그인 페이지로 이동
const goToRouter = (val) => {
  router.push({ name: val });
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
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding: 0 16px;
  z-index: 1000;
  color: white;
  //grid-column-gap: 1rem;
  //grid-template-columns: repeat(6, 1fr);
  @include desktop {
    padding: 0 32px;

    //grid-column-gap: 1.5rem;
    //grid-template-columns: repeat(12, 1fr);
  }
}
</style>
