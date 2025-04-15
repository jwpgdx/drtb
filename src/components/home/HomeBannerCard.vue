<template>
  <div
    class="relative w-48 lg:w-52 h-64 lg:h-72  p-2 lg:p-4 rounded-md transition-colors duration-300 m-3"
    :class="[selected ? 'bg-stone-800' : 'bg-stone-900']"
  >
    <div
      class="flex flex-col h-full rounded-lg overflow-hidden"
    >
      <div class="p-4 flex flex-col gap-2 w-[90%] break-keep">
        <h3 class="text-lg font-bold text-white ">{{ title }}</h3>
        <p class="text-sm text-zinc-400">{{ content }}</p>
      </div>
      <img class="absolute right-4 bottom-4 w-[80%] h-auto" :src="image" alt="banner" />
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