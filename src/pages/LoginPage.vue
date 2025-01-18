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
import { useRouter, useRoute } from "vue-router";

import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();
const router = useRouter(); // router 인스턴스 가져오기
const route = useRoute(); // 현재 라우트 정보 조회

const accessKey = ref("");
const secretKey = ref("");

// 로그인 처리 함수
const handleLogin = async () => {
  await authStore.fetchAccountInfo(accessKey.value, secretKey.value);

  if (authStore.isAuthenticated) {
    // 쿼리에서 redirect 경로 가져오기
    const redirectPath = route.query.redirect || "/";

    // 로그인 성공 후 히스토리 스택을 대체
    router.replace(redirectPath as string);
  }
};
</script>
