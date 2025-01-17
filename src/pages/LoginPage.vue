// LoginPage.vue
<template>
  <div>
    <input v-model="accessKey" placeholder="Enter Access Key" />
    <input v-model="secretKey" placeholder="Enter Secret Key" />
    <button @click="handleLogin">LOGIN</button>
    <p v-if="authStore.errorMessage" style="color: red">
      {{ authStore.errorMessage }}
    </p>
    <p v-if="authStore.successMessage" style="color: green">
      {{ authStore.successMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // router 사용
import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();
const router = useRouter(); // router 인스턴스 가져오기

const accessKey = ref("");
const secretKey = ref("");

// 로그인 처리 함수
const handleLogin = async () => {
  await authStore.fetchApiKeyList(accessKey.value, secretKey.value);

  if (authStore.isAuthenticated) {
    // 로그인 성공 시, 홈 페이지로 이동
    const redirectUrl = router.currentRoute.value.query.redirect || "/"; // redirect가 없으면 기본 홈 페이지로
    router.push(redirectUrl as string);
  }
};
</script>
