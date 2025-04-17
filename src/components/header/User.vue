<template>
  <div class="relative">
    <!-- 데스크탑 + 로그인 O -->

    <!-- 데스크탑 + 로그인 X -->
    <div
      v-if="!authStore.isAuthenticated"
      class="hidden lg:flex items-center h-12 gap-6 pl-6 pr-2 bg-black rounded-xl"
    >
      <button @click="goToLogin" class="text-sm">로그인</button>
      <button
        @click="goToLogin"
        class="text-sm text-black bg-white rounded-sm h-8 px-3"
      >
        회원가입
      </button>
    </div>
    <!-- 모바일 + 로그인 O -->
    <button
      v-if="authStore.isAuthenticated"
      @click="toggleMenu"
      class="flex items-center justify-end w-16 lg:w-8 focus:outline-none"
      ref="profileRef"
    >
      <img
        :src="
          isMenuOpen ? '/images/icon-smile-orange.webp' : '/images/icon-smile-white.webp'
        "
        alt="User Profile"
        class="w-8 h-8 rounded-full object-cover"
      />
    </button>
    <!-- 모바일 + 로그인 X -->
    <button
      v-if="!authStore.isAuthenticated"
      @click="goToLogin"
      class="lg:hidden text-sm text-black bg-white rounded-sm w-16 h-8 px-3"
    >
      로그인
    </button>

    <!-- 드롭다운 메뉴 -->
    <div
      v-if="isMenuOpen"
      ref="menuRef"
      class="absolute right-0 mt-4 w-48 bg-zinc-900 rounded-md shadow-lg z-50 p-2 overflow-hidden"
    >
      <!-- 사용자 정보 섹션 -->
      <div class="py-2 px-3">
        <p class="text-xs text-white">
          {{ authStore.user?.displayName || "사용자" }}
        </p>
        <p class="text-xs text-zinc-400">
          {{ authStore.user?.email || "" }}
        </p>
      </div>

      <!-- 메뉴 항목 -->
      <div class="py-2">
        <ApiKey />
        <button
          @click="goToDashboard"
          class="block px-3 py-2 text-white text-[13px]"
        >
          대시보드
        </button>
        <button
          @click="handleLogout"
          class="w-full text-left px-3 py-2 text-white text-[13px]"
        >
          로그아웃
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "vue-router";
import { onClickOutside, useEventListener, useTransition } from "@vueuse/core";
import ApiKey from "./ApiKey.vue";

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);
const profileRef = ref(null);
const menuRef = ref(null);

// VueUse의 onClickOutside를 사용하여 외부 클릭 감지
onClickOutside(menuRef, (event) => {
  // 프로필 버튼 클릭은 무시 (toggleMenu에서 처리)
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    isMenuOpen.value = false;
  }
});

// ESC 키 감지하여 메뉴 닫기
useEventListener(document, "keydown", (e) => {
  if (e.key === "Escape" && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
});

// 드롭다운 메뉴 토글
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 로그아웃 처리
const handleLogout = async () => {
  try {
    await authStore.logout();
    isMenuOpen.value = false;
    router.push({ name: "Home" });
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};
const goToDashboard = () => {
  router.push({ name: "Dashboard" });
  isMenuOpen.value = false;
};
const goToLogin = () => {
  router.push({ name: "Login" });
  isMenuOpen.value = false;
};
</script>
