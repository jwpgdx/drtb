<template>
  <div class="w-full mx-auto space-y-4">
    <div
      v-for="(faq, index) in faqStore.faqs"
      :key="faq.id"
      class="rounded-lg overflow-hidden transition-all duration-300"
      :class="{ 'bg-orange-500': faq.isOpen }"
    >
      <button
        @click="faqStore.toggleFaq(faq.id)"
        class="w-full px-4 py-4 text-left flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-5 h-5 rounded-[4px] flex items-center justify-center text-center text-xs"
            :class="{
              'border border-zinc-600': !faq.isOpen,
              'border-black bg-black': faq.isOpen,
            }"
          >
            {{ index + 1 }}
          </div>
          <span class="font-medium" :class="{ 'text-black': faq.isOpen }">{{
            faq.question
          }}</span>
        </div>

        <span
          :class="[
            'transform transition-transform duration-300',
            { 'rotate-180 text-black': faq.isOpen },
          ]"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-screen"
        leave-from-class="opacity-100 max-h-screen"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-show="faq.isOpen" class="px-11 pb-4 pt-2 text-zinc-800">
          {{ faq.answer }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFaqStore } from "@/stores/faq-store";

const faqStore = useFaqStore();
</script>
