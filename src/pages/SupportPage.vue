<template>
  <div class="container">
    <img
      src="/images/page-support.webp"
      alt="에어드랍 코인 이미지"
      class="w-64 lg:w-72 h-auto mx-auto"
    />
    <!-- 텍스트 컨텐츠 -->
    <div class="w-full flex flex-col items-center gap-6 text-center">
      <h1 class="text-3xl lg:text-4xl font-semibold">How can we help?</h1>
      <h1 class="text-xl max-w-[90%] lg:max-w-[60%] text-zinc-400">
        Get in touch with our sales and support teams for demos, onboarding
        support, or product questions.
      </h1>
    </div>
    <div class="h-12 lg:h-24" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8  m-auto">
      <FaqCard
        :icon="Mail"
        title="제휴 & 제안"
        content="비즈니스 제휴 및 제안 관련 문의는 아래 이메일로 연락해 주세요."
        buttonLabel="이메일 보내기"
        :onClick="handleButtonClick"
      />
      <FaqCard
        :icon="MessageCircle"
        title="궁금한 점이 있으신가요?"
        content="서비스 이용 중 불편 사항이나 문의가 있다면 언제든지 알려주세요. 피드백도 언제든 환영합니다."
        buttonLabel="1:1 문의하기"
        :onClick="goToQuestion"
      />
    </div>
    <div class="h-12 lg:h-24" />

    <h1 class="text-xl lg:text-xl font-bold mb-8 px-4">FAQ</h1>
    <Faq />
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";

import { MessageCircle, Mail } from "lucide-vue-next";
import Faq from "@/components/faq/Faq.vue";
import FaqCard from "@/components/faq/FaqCard.vue";

const router = useRouter();
const route = useRoute();

const goToQuestion = () => {
  router.push({ name: 'Question' });
};

const handleButtonClick = () => {
  window.location.href = "mailto:jwpgdx@gmail.com";
};
</script>

<style lang="css" scoped>
.support-card {
  padding: 32px;
  border-radius: 16px;
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  background: hsla(0, 0%, 100%, 0.03);
}
</style>
