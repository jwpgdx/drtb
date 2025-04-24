<template>
  <div
    class="flex min-h-[360px] cursor-pointer flex-col gap-2 overflow-hidden rounded-lg border border-zinc-800 bg-black px-6"
  >
    <div
      v-if="item.status === 'scheduled'"
      class="rounded-full bg-yellow-600 px-2 py-1 text-xs text-white"
    >
      예정
    </div>

    <div class="z-10 mt-6 flex flex-col">
      <div
        class="mb-1 flex items-center gap-1 text-[11px] tracking-wide text-zinc-500"
      >
        {{ formatDate(item.startAt) }}
        <span class="inline-block h-[1px] w-3 bg-zinc-500"></span>
        {{ formatDate(item.endAt) }}
      </div>
      <div class="mb-3 w-[80%] text-xl font-semibold">{{ item.title }}</div>

      <div
        v-if="item.status"
        class="self-start rounded-full border px-2 py-1 text-xs tracking-wide"
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
      class="absolute bottom-0 right-0 z-0 m-auto mb-[1px] mr-2 h-auto w-[60%] rounded-lg lg:w-[70%]"
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
