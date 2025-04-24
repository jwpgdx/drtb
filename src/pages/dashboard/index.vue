<template>
  <div class="container">
    <h1 class="text-3xl lg:text-4xl font-semibold">대시보드</h1>
    <div class="h-12" />
    <User />
    <div class="h-12" />

    <div class="px-5">
      <div class="text-base">대시보드 주요 기능</div>
      <div class="text-sm text-muted-foreground">
        암호화폐 자산 관리를 위한 핵심 기능입니다.
      </div>
      <div class="h-8" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 m-auto">
      <DashboardCard
        image="/images/icon-apikey.webp"
        title="API 키 관리"
        :content="computedContent"
        @click="goToApikey"
      />
      <DashboardCard
        image="/images/icon-assets.webp"
        title="자산 관리"
        content="보유한 암호화폐 자산을 한눈에 확인할 수 있습니다."
        @click="goToAssets"
      />
      <DashboardCard
        image="/images/icon-history.webp"
        title="거래 내역"
        content="API를 통해 수집된 거래 기록을 확인할 수 있습니다."
        @click="goToHistory"
      />
      <DashboardCard
        :icon="ScrollText"
        title="1:1 문의 내역"
        image="/images/icon-faq.webp"
        content="문의한 내용과 답변을 확인할 수 있습니다."
        @click="handleButtonClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useRouter, useRoute } from "vue-router";
import { useApiStore } from "@/stores/api-store";

import { KeyRound, Coins, ScrollText, ChevronRight } from "lucide-vue-next";

import User from "@/components/dashboard/User.vue";
import DashboardCard from "@/components/dashboard/DashboardCard.vue";

const router = useRouter();
const route = useRoute();
const apiStore = useApiStore();


const goToApikey = () => {
  router.push({ name: 'Apikey' });
};
const goToAssets = () => {
  router.push({ name: 'Assets' });
};
const goToHistory = () => {
  router.push({ name: 'History' });
};
const goToLogin = () => {
  router.replace(`/login?redirect=${route.fullPath}`);
};



const computedContent = computed(() => {
  if (!apiStore.isAuthenticated && apiStore.errorMessage) {
    return apiStore.errorMessage;
  } else if (apiStore.isAuthenticated) {
    return "등록된 API 키가 있습니다.";
  } else {
    return "거래를 위해 API 키를 등록하세요.";
  }
});

const handleButtonClick = () => {
  alert("버튼 클릭됨!");
};
</script>
