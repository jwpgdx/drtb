<template>
  <div class="grid w-full gap-4">
    <div class="grid gap-4 py-4">
      <Button size="lg" @click="goToApikey">API 키 관리</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { Button } from "@/components/ui/button";

const router = useRouter();
const route = useRoute();

const goToApikey = () => {
  router.replace("/dashboard/apikey");
};

const goToLogin = () => {
  router.replace(`/login?redirect=${route.fullPath}`);
};
</script>
