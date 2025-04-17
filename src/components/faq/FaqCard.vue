<template>
  <div class="faq-card">
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <component :is="icon" class="size-5" />
        <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
      </div>
      <p class="text-sm text-zinc-400 mr-2">{{ content }}</p>
    </div>
    <button
      class="self-start flex items-center w-auto h-8 px-4 gap-2 bg-zinc-800 text-[13px] rounded-sm"
      @click="onClick"
    >
      {{ buttonLabel }}<ChevronRight class="size-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { ChevronRight } from "lucide-vue-next";

defineProps<{
  icon: Component;
  title: string;
  content: string;
  buttonLabel: string;
  onClick: () => void;
}>();
</script>

<style lang="scss" scoped>
.faq-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  background: hsla(0, 0%, 100%, 0.03);
}
</style>
