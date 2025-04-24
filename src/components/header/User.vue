<template>
  <div class="relative">
    <!-- 데스크탑 + 로그인 O -->

    <!-- 데스크탑 + 로그인 X -->
    <div
      v-if="!authStore.isAuthenticated"
      class="hidden h-12 items-center gap-6 rounded-xl bg-black pl-6 pr-2 lg:flex"
    >
      <button @click="goToLogin" class="text-sm">로그인</button>
      <button
        @click="goToLogin"
        class="h-8 rounded-sm bg-white px-3 text-sm text-black"
      >
        회원가입
      </button>
    </div>
    <!-- 모바일 + 로그인 O -->
    <button
      v-if="authStore.isAuthenticated"
      @click="toggleMenu"
      class="flex size-10 items-center justify-center rounded-full focus:outline-none"
      ref="profileRef"
    >
      <img
        :src="
          isMenuOpen ? '/images/icon-my-on.webp' : '/images/icon-my-off.webp'
        "
        alt="User Profile"
        class="size-10 object-cover"
      />
    </button>
    <!-- 모바일 + 로그인 X -->
    <button
      v-if="!authStore.isAuthenticated"
      @click="goToLogin"
      class="h-8 w-16 rounded-sm bg-white px-3 text-sm text-black lg:hidden"
    >
      로그인
    </button>

    <!-- 드롭다운 메뉴 -->
    <div
      v-if="isMenuOpen"
      ref="menuRef"
      class="dropdown-menu absolute right-0 z-50 mt-2 min-w-48 rounded-md bg-zinc-800 px-2 py-2 shadow-lg lg:min-w-56"
    >
      <!-- 사용자 정보 섹션 -->
      <div class="flex items-center gap-2 border-b border-zinc-700 px-2 py-2">
        <div class="size-8 overflow-hidden rounded-full bg-orange-600">
          <img
            src="/images/icon-user-thumb.webp"
            class="h-auto w-full object-cover"
          />
        </div>

        <div class="text-xs">
          <p class="">
            {{ authStore.user?.displayName || "사용자" }}
          </p>
          <p class="text-xs text-zinc-400">
            {{ authStore.user?.email || "" }}
          </p>
        </div>
      </div>

      <!-- 메뉴 항목 -->

      <ApiKey />
      <div class="py-2">
        <button
          @click="goToDashboard"
          class="block w-full rounded-sm px-3 py-2 text-left text-[13px] text-white hover:bg-zinc-900"
        >
          대시보드
        </button>
        <button
          @click="handleLogout"
          class="w-full rounded-sm px-3 py-2 text-left text-[13px] text-white hover:bg-zinc-900"
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
<style scoped>
.dropdown-menu::before {
  content: "";
  position: absolute;
  top: -6px;
  right: 16px;
  width: 12px;
  height: 12px;
  background-color: #27272a; /* bg-zinc-800 */
  transform: rotate(45deg);
  z-index: -1;
}
</style>
