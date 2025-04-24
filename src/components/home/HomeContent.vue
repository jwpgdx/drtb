<template>
  <div class="lg:py-30 grid grid-cols-1 gap-6 py-8 lg:grid-cols-12">
    <div
      class="relative my-auto flex aspect-square items-center lg:col-start-1 lg:col-end-7 lg:row-start-1"
    >
      <img
        :src="`/images/home-content-${image}.webp`"
        alt="이미지"
        class="h-[90%] w-auto px-8 object-cover"
      />
    </div>

    <div
      class="flex flex-col items-start justify-center lg:col-start-8 lg:col-end-12 lg:row-start-1"
    >
      <p
        class="mb-4 text-base font-medium uppercase leading-[1.125rem] tracking-[0.1875rem] lg:mb-8"
      >
        {{ tag }}
      </p>
      <h1 class="mb-4 text-3xl font-semibold lg:mb-6 lg:text-4xl">
        {{ title }}
      </h1>
      <div class="mb-4 text-base text-zinc-400 lg:text-base">
        {{ content }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string;
  content: string;
  image: string;
  tag: string;
}>();
</script>
