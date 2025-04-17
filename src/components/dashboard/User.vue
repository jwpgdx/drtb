<template>
  <div class="user">
    <!-- 유저 프로필 이미지 -->
    <img
      :src="authStore.user?.photoURL || '/images/icon-smile-white.webp'"
      alt="User Profile"
      class="size-8 rounded-full object-cover border border-white/20"
    />

    <!-- 유저 정보 -->
    <div class="flex flex-col text-sm">
      <span class="font-semibold">
        {{ authStore.user?.displayName || "사용자" }}
      </span>
      <span class="text-zinc-400 text-xs">
        {{ authStore.user?.email || "이메일 없음" }}
      </span>
    </div>
    <!-- 로그아웃 버튼 -->
    <button
      @click="handleLogout"
      class="ml-auto flex items-center w-auto h-8 px-4 gap-2 bg-zinc-800 text-[13px] rounded-sm"
    >
      로그아웃
      <ChevronRight class="size-4" />
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "vue-router";
import { ChevronRight } from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push({ name: "Home" });
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};
</script>

<style lang="scss" scoped>
.user {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  background: hsla(0, 0%, 100%, 0.03);
}
</style>
