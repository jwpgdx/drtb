<template>
  <div class="space-y-6">
    <div
      v-for="question in store.questions"
      :key="question.id"
      class="border p-4 rounded shadow-sm"
    >
      <div class="font-semibold text-lg">1112</div>
      <div class="text-sm text-zinc-500">
        {{ question.createdAt?.toDate().toLocaleString() }} / 사용자 ID:
        {{ question.userId }}
      </div>
      <p class="mt-2 whitespace-pre-wrap">{{ question.content }}</p>

      <div v-if="question.response" class="mt-4 bg-green-50 p-3 rounded">
        <div class="text-sm font-semibold text-green-700">운영자 답변</div>
        <div class="text-zinc-700 whitespace-pre-wrap">
          {{ question.response }}
        </div>
      </div>

      <div v-else class="mt-4">
        <textarea
          v-model="responses[question.id]"
          rows="3"
          class="w-full p-2 border rounded resize-none"
          placeholder="여기에 답변을 작성하세요"
        ></textarea>
        <button
          class="mt-2 bg-orange-600 text-white px-3 py-1 rounded text-sm"
          @click="submitResponse(question.id)"
        >
          답변 등록
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useQuestionStore } from "@/stores/question-store";

const store = useQuestionStore();
const responses = reactive<{ [id: string]: string }>({});

const submitResponse = async (id: string) => {
  if (!responses[id]) return alert("답변 내용을 입력해주세요.");
  await store.respondToQuestion(id, responses[id]);
  await store.fetchMyQuestions(); // 관리자용이지만 이름 재활용 가능
  responses[id] = "";
};

onMounted(() => {
  store.fetchMyQuestions();
});
</script>
