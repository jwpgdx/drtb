<template>
  <div>
    <div class="flex gap-4 mb-6">
      <button @click="tab = 'ongoing'" :class="tab === 'ongoing' ? activeClass : inactiveClass">진행중</button>
      <button @click="tab = 'ended'" :class="tab === 'ended' ? activeClass : inactiveClass">종료</button>
    </div>

    <div class="space-y-6">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="border border-zinc-700 p-4 rounded-md bg-zinc-900 text-zinc-100"
      >
        <div class="flex items-center gap-2 mb-1">
          <div class="text-xl font-bold">{{ item.title }}</div>

          <span
            v-if="item.status === 'scheduled'"
            class="text-xs px-2 py-1 rounded-full bg-yellow-600 text-white"
          >예정</span>

          <span
            v-else-if="item.status === 'urgent'"
            class="text-xs px-2 py-1 rounded-full bg-red-600 text-white"
          >마감임박</span>
        </div>

        <div class="text-sm text-zinc-400">{{ item.market }}</div>
        <div class="my-2 text-sm prose prose-invert max-w-none" v-html="item.description" />
        <img :src="item.imageUrl" alt="에어드랍 이미지" class="w-full h-auto rounded" />

        <div class="text-xs mt-2 text-zinc-400">
          {{ formatDate(item.startAt) }} ~ {{ formatDate(item.endAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAirdropStore } from "@/stores/airdrop-store";

const store = useAirdropStore();
const tab = ref<"ongoing" | "ended">("ongoing");

const activeClass = "font-semibold text-white border-b-2 border-orange-500";
const inactiveClass = "text-zinc-400";

const filteredList = computed(() => {
  return tab.value === "ongoing" ? store.ongoingWithScheduled : store.ended;
});

onMounted(() => {
  store.fetchAirdrops();
});

const formatDate = (ts: any) =>
  ts?.toDate().toLocaleString("ko-KR", { hour12: false });
</script>
