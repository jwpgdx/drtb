<template>
  <header>
    <!-- 이전으로 가기 버튼 -->
    <img
      class="w-12 h-12 cursor-pointer"
      src="/icons/arrow-left.webp"
      v-if="layoutMeta.showBack"
      @click="goBack"
    />

    <!-- 로고 -->
    <img
      v-if="layoutMeta.showLogo"
      class="w-auto h-10 lg:h-12 cursor-pointer"
      src="/images/logo.webp"
      @click="goToRouter('Home')"
    />

    <!-- 페이지 정보 -->
    <div v-if="!isLoginPage" class="flex items-center space-x-4">
      <div v-if="isOrderPage" class="flex items-center space-x-2">
        <Coin :market="marketName" class="w-8 h-8 mr-4" />
        <h1 class="text-xl font-semibold">{{ marketName }}</h1>
      </div>
    </div>

    <!-- 메뉴 -->
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
import Coin from "@/components/icons/Coin.vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { toast } = useToast();

// 🔧 layoutMeta 타입 명시
interface LayoutMeta {
  showBack?: boolean;
  showLogo?: boolean;
  showMargin?: boolean;
}
const layoutMeta = computed<LayoutMeta>(
  () => (route.meta.layout as LayoutMeta) || {}
);

const isLoginPage = computed(() => router.currentRoute.value.path === "/login");
const isOrderPage = computed(() => router.currentRoute.value.name === "Order");

const marketName = computed(() => {
  const market = router.currentRoute.value.params.market;
  return Array.isArray(market) ? market[0] : market || "";
});

const menuItems = [
  { value: "Orders", label: "거래소" },
  { value: "Assets", label: "자산" },
  { value: "Airdrop", label: "에어드랍" },
  { value: "Support", label: "고객센터" },
];

const goToRouter = (val: string) => {
  router.push({ name: val });
};

const logout = () => {
  authStore.logout();
  router.push("/");
  toast({
    title: "Logged out",
    description: "성공적으로 로그아웃되었습니다.",
    variant: "default",
    action: h(ToastAction, { altText: "확인" }, { default: () => "확인" }),
  });
};

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

  @include desktop {
    padding: 0 32px;
  }
}
</style>
