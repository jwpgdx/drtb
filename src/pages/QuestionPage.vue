<template>
  <div class="container">
    <div class="relative flex flex-col lg:flex-row gap-8 lg:gap-16 justify-between">
      <!-- 왼쪽: 제목/설명 -->
      <div class="relative flex flex-col gap-4 w-full lg:w-[30%]">
        <h1 class="text-3xl lg:text-4xl font-semibold">궁금한 점이 있으신가요?</h1>
        <div class="text-[15px] text-zinc-200">
          서비스 이용 중 불편 사항이나 문의가 있다면 언제든지 알려주세요.
          피드백도 언제든 환영합니다.
        </div>

        <div class="lex flex-col gap-3 mt-8 lg:mt-12 text-zinc-400">
          <div class="text-[15px]">
            비즈니스 제휴 및 제안 관련 문의는<br />아래 이메일로 연락해 주세요.
          </div>
          <a
            href="mailto:jwpgdev@google.com"
            class="flex items-center gap-3 text-sm py-2 hover:text-zinc-300 transition"
          >
            이메일로 문의하기 <ChevronRight class="size-4" />
          </a>
        </div>
      </div>

      <!-- 오른쪽: 폼 -->
      <div class="w-full lg:w-[50%]">
        <QuestionForm />
      </div>

    </div>
    <div class="h-12 lg:h-24" />

    <div class="text-2xl font-semibold mb-4">내 문의 내역</div>
    <QuestionList />
  </div>
</template>

<script lang="ts" setup>
import QuestionForm from "@/components/question/QuestionForm.vue";
import QuestionList from "@/components/question/QuestionList.vue";

import { ChevronRight } from "lucide-vue-next";
</script>

<style lang="scss" scoped></style>
