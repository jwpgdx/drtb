<template>
  <div class="question-form border border-zinc-700 bg-zinc-950">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="text-sm text-zinc-500">
        서비스 이용 중 궁금한 점, 불편한 점, 개선 의견이 있다면 편하게 작성해
        주세요. 가능한 빠르게 확인하고 답변드릴게요.
      </div>
      <textarea
        v-model="content"
        placeholder="내용"
        class="w-full p-2 border rounded bg-zinc-900 border-zinc-800 resize-none text-sm"
        rows="5"
        required
      />
      <div class="flex w-full justify-end">
        <button
          type="submit"
          class="h-8 text-[13px] bg-zinc-800 px-3 rounded-sm"
        >
          문의 등록
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuestionStore } from "@/stores/question-store";
import { toast } from "vue3-toastify";

const content = ref("");
const store = useQuestionStore();

const handleSubmit = async () => {
  if (!content.value.trim()) return;

  await store.submitQuestion(content.value);
  content.value = "";
  toast("문의가 등록되었습니다.");
  // ✅ 등록 후 목록 다시 불러오기
  await store.fetchMyQuestions();
};
</script>

<style scoped>
.question-form {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 8px;
}
</style>
