<template>
  <button class="dashboard-card">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <img :src="image" class="size-7" alt="" />
        <h3 class="text-base font-semibold text-white">{{ title }}</h3>
        <ChevronRight class="ml-auto size-5" />
      </div>
      <p class="text-sm ml-9 mr-7 text-zinc-400">{{ content }}</p>
    </div>
    <slot name="actions" />
  </button>
</template>

<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";

defineProps<{
  image: string;
  title?: string;
  content: string;
  buttonLabel?: string; // 
}>();
</script>

<style lang="scss" scoped>
.dashboard-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  text-align: left;
  padding: 16px 16px 20px 12px;
  border-radius: 12px;
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  background: hsla(0, 0%, 100%, 0.03);
}
</style>
