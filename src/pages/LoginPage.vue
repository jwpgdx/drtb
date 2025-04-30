<template>
  <div class="container">
    <div
      class="flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <img
        class="h-auto w-full max-w-xs lg:max-w-md"
        src="/images/image-login.webp"
      />

      <div class="login-text">
        Explore crypto galaxies.<br />Start on BITFFY
      </div>
      <div class="h-8" />
      <button
        @click="handleGoogleLogin"
        class="flex h-12 w-full max-w-xs items-center justify-between rounded-3xl border px-4"
      >
        <img
          src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-1024.png"
          alt="Google G Logo"
          class="h-5 w-5"
        />

        <span class="text-m">Continue with Google</span>
        <span></span>
      </button>
      <div class="h-4" />
      <span @click="handleGoogleLogin" class="text-sm">Log in</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { toast } from "vue3-toastify";
import { h, computed } from "vue";
import { useApiStore } from "@/stores/api-store";

// Store와 router 가져오기
const router = useRouter();
const authStore = useAuthStore();
const apiStore = useApiStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Google 로그인 처리
const handleGoogleLogin = async () => {
  try {
    const userCredential = await authStore.loginWithGoogle();
    const user = userCredential.user;
    apiStore.fetchApiKeyStatus();

    // URL에 쿼리 스트링으로 ?redirect=/order/KRW-BTC 이런식으로 있잖아?
    // 그 값을 가져와서, 없으면 기본값 '/'로 리다이렉트~
    const redirectRoute = router.currentRoute.value.query.redirect;
    const redirectPath =
      typeof redirectRoute === "string" ? redirectRoute : "/";
    router.replace(redirectPath);
    toast("구글 계정으로 성공적으로 로그인했습니다.");
  } catch (error) {
    toast("로그인에 실패했습니다. 다시 시도해 주세요.");
  }
};
</script>
<style lang="scss" scoped>
.login-text {
  font-family: "SamsungSharpSans", sans-serif;
  @apply text-center text-3xl font-bold;
}
</style>
