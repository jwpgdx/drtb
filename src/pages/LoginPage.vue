<template>
  <div class="container">
    <div
      class="flex flex-col items-center justify-center w-full h-screen text-white"
    >
      <img
        class="w-full max-w-xs md:max-w-md h-auto"
        src="/images/image-login.webp"
      />

      <div class="text-3xl font-semibold text-center">
        Millions of songs.<br />Free on Spotify
      </div>
      <div class="h-8" />
      <button
        @click="handleGoogleLogin"
        class="flex items-center justify-between w-full max-w-xs h-12 px-4 border rounded-3xl"
      >
        <img
          src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-1024.png"
          alt="Google G Logo"
          class="w-5 h-5"
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
import { useToast } from "@/components/ui/toast/use-toast";
import { h, computed } from "vue";
import ToastAction from "@/components/ui/toast/ToastAction.vue";
import { useApiStore } from "@/stores/api-store";

// Store와 router 가져오기
const router = useRouter();
const authStore = useAuthStore();
const apiStore = useApiStore();

const { toast } = useToast();

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

    toast({
      title: user.email,
      description: "구글 계정으로 성공적으로 로그인했습니다.",
      variant: "default",
      action: h(ToastAction, { altText: "확인" }, { default: () => "확인" }),
    });
  } catch (error) {
    console.log("Google login error:", error);
    toast({
      title: "Login Failed",
      description: "로그인에 실패했습니다. 다시 시도해 주세요.",
      variant: "destructive",
      action: h(
        ToastAction,
        { altText: "Try again" },
        { default: () => "Try again" }
      ),
    });
  }
};
</script>
