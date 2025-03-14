<template>
  <div class="grid w-full gap-4">
    <div class="flex flex-col items-center justify-center w-full h-auto">
      <img
        src="https://i.pinimg.com/originals/64/05/eb/6405ebec3e689409a6cedc8b561cbb68.gif"
        alt="Profile Edit"
        class="max-w-72"
      />
      <div class="flex flex-col gap-y-1.5 text-center">
        <h2 class="text-5xl leading-tight font-semibold tracking-tight">
          Sign in with Google
        </h2>
        <p class="text-sm text-muted-foreground">
          구글 계정으로 로그인해 주세요.
        </p>
      </div>
    </div>

    <div class="grid gap-4 py-4">
      <Button size="lg" @click="handleGoogleLogin">Google Login</Button>
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
