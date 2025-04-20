<template>
  <div
    class="relative m-3 h-64 w-48 rounded-md bg-zinc-900 p-2 transition-colors duration-300 lg:h-72 lg:w-52 lg:p-4"
    :class="[selected ? 'border border-zinc-800' : '']"
  >
    <div class="flex h-full flex-col overflow-hidden rounded-lg">
      <div
        style="z-index: 2"
        class="flex w-[90%] flex-col gap-2 break-keep p-4"
      >
        <h3 class="text-lg font-bold text-white">{{ title }}</h3>
        <p class="text-sm text-zinc-400">{{ content }}</p>
      </div>
      <img
        class="absolute bottom-0 right-2 h-auto w-[70%] lg:w-[80%]"
        :src="`/images/home-banner-${image}.webp`"
        alt="banner"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  content: string;
  image: string;
  selected?: boolean;
}>();
</script>

<style></style>
