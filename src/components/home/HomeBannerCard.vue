<template>
  <div
    class="relative w-48 lg:w-52 h-64 lg:h-72  p-2 lg:p-4 rounded-md transition-colors duration-300 m-3 bg-zinc-900"
    :class="[selected ? 'border border-zinc-800' : '']"
  >
    <div
      class="flex flex-col h-full rounded-lg overflow-hidden"
    >
      <div class="p-4 flex flex-col gap-2 w-[90%] break-keep">
        <h3 class="text-lg font-bold text-white ">{{ title }}</h3>
        <p class="text-sm text-zinc-400">{{ content }}</p>
      </div>
      <img 
      class="absolute right-0 bottom-0 w-[80%] h-auto" 
      :src="`/images/home-banner-${image}.webp`"
      alt="banner" />
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

<style>

</style>