<template>
  <div>
    <div
      v-for="item in store.questions"
      :key="item.id"
      class="border-b border-zinc-800"
    >
      <!-- 토글 헤더 -->
      <button
        class="flex items-center gap-2 w-full text-left text-[13px] text-zinc-300 hover:bg-zinc-900 rounded-[4px] transition py-4"
        @click="toggle(item.id)"
      >
        <ChevronRight
          :class="[
            'size-3 transition-transform',
            openId === item.id ? 'rotate-90 ' : 'text-zinc-500',
          ]"
        />
        {{ item.createdAt?.toDate().toLocaleString() }}
      </button>

      <!-- 토글 콘텐츠 -->
      <div v-if="openId === item.id" class="ml-5 mt-2 text-sm">
        <div class="mb-4 whitespace-pre-wrap text-zinc-300">
          {{ item.content }}
        </div>

        <div
          v-if="item.response"
          class="flex items-start gap-2 whitespace-pre-wrap mb-4"
        >
          <CornerDownRight class="size-3 mt-1 flex-shrink-0" />
          <div class="text-zinc-100">
            {{ item.response }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuestionStore } from "@/stores/question-store";
import { ChevronRight, CornerDownRight } from "lucide-vue-next";

const store = useQuestionStore();
const openId = ref<string | null>(null);

const toggle = (id: string) => {
  openId.value = openId.value === id ? null : id;
};

onMounted(() => {
  store.fetchMyQuestions();
});
</script>
