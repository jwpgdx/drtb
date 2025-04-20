<template>
  <div
    class="flex flex-col gap-2 bg-black rounded-lg border border-zinc-800 min-h-[360px] overflow-hidden px-6 cursor-pointer"
  >
    <div
      v-if="item.status === 'scheduled'"
      class="text-xs px-2 py-1 rounded-full bg-yellow-600 text-white"
    >
      예정
    </div>

    <div class="flex flex-col mt-6 z-10">
      <div
        class="flex items-center gap-1 text-[11px] mb-1 tracking-wide text-zinc-500"
      >
        {{ formatDate(item.startAt) }}
        <span class="inline-block w-3 h-[1px] bg-zinc-500"></span>
        {{ formatDate(item.endAt) }}
      </div>
      <div class="text-xl font-semibold w-[80%] mb-3">{{ item.title }}</div>

      <div
        v-if="item.status"
        class="self-start text-xs px-2 py-1 rounded-full border tracking-wide"
        :class="{
          'border-orange-600 text-orange-600': item.status === 'ongoing',
          'border-zinc-600 text-zinc-600': item.status === 'ended',
          'border-green-600 text-green-600': item.status === 'scheduled',
        }"
      >
        {{
          item.status === "ongoing"
            ? "진행중"
            : item.status === "ended"
            ? "종료"
            : "예정"
        }}
      </div>
    </div>
    <img
      :src="item.imageUrl"
      alt="에어드랍 이미지"
      class="absolute bottom-0 right-0 m-auto w-[60%] lg:w-[70%] mr-2 mb-[1px] rounded-lg h-auto z-0"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  item: {
    title: string;
    status?: "scheduled" | "ongoing" | "ended";
    market: string;
    description: string;
    imageUrl: string;
    startAt: any;
    endAt: any;
  };
}>();

const formatDate = (ts: any) => {
  const date = ts?.toDate?.();
  if (!date) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day}`;
};
</script>
