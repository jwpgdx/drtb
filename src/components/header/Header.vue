<template>
  <header class="container">
    <ArrowLeft class="size-6 cursor-pointer" v-if="layoutMeta.showBack" @click="goBack" />
    <!-- 로고 -->
    <img
      v-if="layoutMeta.showLogo"
      class="h-10 w-auto cursor-pointer text-white lg:h-12"
      src="/images/icon-logo.svg"
      @click="goToRouter('Home')"
    />

    <!-- 페이지 정보 -->
    <div v-if="!isLoginPage" class="flex items-center space-x-4">
      <div v-if="isOrderPage" class="flex items-center space-x-2">
        <Coin :market="marketName" class="mr-4 h-8 w-8" />
        <h1 class="text-xl font-semibold">{{ marketName }}</h1>
      </div>
    </div>

    <!-- 메뉴 -->
    <div v-if="!isLoginPage" class="flex items-center gap-2">
      <div
        class="hidden h-12 items-center gap-7 rounded-xl bg-black px-6 lg:flex"
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
import { useHeaderStore } from "@/stores/header-store";
import { computed } from "vue";
import { toast } from "vue3-toastify";
import { h } from "vue";
import { ArrowLeft } from 'lucide-vue-next';

import MobileMenu from "./MobileMenu.vue";
import User from "./User.vue";
import Coin from "@/components/icons/Coin.vue";
const headerStore = useHeaderStore();
const menuItems = computed(() => headerStore.menuItems);

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 🔧 layoutMeta 타입 명시
interface LayoutMeta {
  showBack?: boolean;
  showLogo?: boolean;
  showMargin?: boolean;
}
const layoutMeta = computed<LayoutMeta>(
  () => (route.meta.layout as LayoutMeta) || {},
);

const isLoginPage = computed(() => router.currentRoute.value.path === "/login");
const isOrderPage = computed(() => router.currentRoute.value.name === "Order");

const marketName = computed(() => {
  const market = router.currentRoute.value.params.market;
  return Array.isArray(market) ? market[0] : market || "";
});

const goToRouter = (val: string) => {
  router.push({ name: val });
};

const logout = () => {
  authStore.logout();
  router.push("/");
  toast("성공적으로 로그아웃되었습니다.");
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
  z-index: 1000;
  color: white;
}
</style>
