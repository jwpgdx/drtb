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
          Sign in with Bithumb
        </h2>
        <p class="text-sm text-muted-foreground">
          <span @click="openBithumbApi" class="underline text-orange-600"
            >빗썸 API</span
          >
          액세스 키와 시크릿 키를 입력해주세요
        </p>
      </div>
    </div>

    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Access Key</Label>
        <div class="flex items-center justify-end w-full col-span-3 gap-2">
          <Input
            class="font-mono"
            id="accessKey"
            placeholder="Enter Access Key"
            v-model="accessKey"
          />
        </div>
      </div>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="text-right">Secret Key</Label>
        <div class="flex items-center justify-end w-full col-span-3 gap-2">
          <Input
            class="font-mono"
            id="secretKey"
            placeholder="Enter Secret Key"
            v-model="secretKey"
          />
        </div>
      </div>
    </div>

    <Button size="lg" @click="handleLogin">LOGIN</Button>

    <Button class="text-sm font-medium underline" variant="link">
      <CircleHelp class="w-3 h-3" />Have an invite link?
    </Button>

  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleHelp } from "lucide-vue-next";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast/use-toast";
import { h } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const accessKey = ref("");
const secretKey = ref("");

const { toast } = useToast();

const handleLogin = async () => {
  await authStore.fetchApiKeyList(accessKey.value, secretKey.value);
  if (authStore.isAuthenticated) {
    const redirectPath = route.query.redirect || "/";
    router.replace(redirectPath as string);

    // 로그인 성공 토스트 메시지
    toast({
      title: "Login Successful",
      description: "계정에 성공적으로 로그인했습니다.",
      variant: "default", // 기본 스타일
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
  } else {
    // 로그인 실패 토스트 메시지
    toast({
      title: "Error",
      description: authStore.errorMessage || "Unknown error occurred.",
      variant: "destructive", // 에러 스타일
      action: h(
        ToastAction,
        {
          altText: "Try again",
        },
        {
          default: () => "Try again",
        }
      ),
    });
  }
};

const openBithumbApi = () => {
  window.open(
    "https://www.bithumb.com/react/api-support/management-api",
    "_blank"
  );
};
</script>
