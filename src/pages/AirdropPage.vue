<template>
  <div class="container">
    <!-- 탭 + 등록버튼 -->
    <div class="relative mb-6 flex h-10 w-full items-center justify-between">
      <div class="flex gap-4 text-base lg:gap-6">
        <button
          @click="tab = 'ongoing'"
          :class="[
            'px-2 py-2 font-medium focus:outline-none',
            tab === 'ongoing'
              ? 'border-b-2 border-orange-500 text-white'
              : 'text-zinc-500 hover:text-zinc-700',
          ]"
        >
          진행중
        </button>
        <button
          @click="tab = 'ended'"
          :class="[
            'px-2 py-2 font-medium focus:outline-none',
            tab === 'ended'
              ? 'border-b-2 border-orange-500 text-white'
              : 'text-zinc-500 hover:text-zinc-700',
          ]"
        >
          종료
        </button>
      </div>
      <button
        v-if="authStore.isAdmin"
        @click="goToAdd"
        class="rounded bg-orange-600 px-4 py-1.5 text-sm text-white"
      >
        + 등록하기
      </button>
    </div>

    <!-- 카드 목록 -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ErrorState
          class="col-span-3"
          v-if="filteredList.length === 0"
          image="coin"
          title="이벤트가 없습니다."
          content="새로운 이벤트가 곧 열릴 예정입니다!"
        />

        <div
          v-for="item in filteredList"
          :key="item.id"
          class="group relative cursor-pointer"
          @click="goToDetail(item.id!)"
        >
          <AirdropCard :item="item" />
          <div
            v-if="authStore.isAdmin"
            class="absolute right-2 top-2 hidden flex-col gap-1 group-hover:flex"
          >
            <button
              @click="goToEdit(item.id!)"
              class="rounded bg-white/80 px-2 py-1 text-xs text-black hover:bg-white"
            >
              수정
            </button>
            <button
              @click="deleteAirdrop(item.id!)"
              class="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <!-- 로딩 스피너 -->
      <div class="mt-6 flex items-center justify-center" v-if="isFetching">
        <svg
          class="h-6 w-6 animate-spin text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      <!-- 감지용 div -->
      <div ref="loadTrigger" class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAirdropStore } from "@/stores/airdrop-store";
import { useAuthStore } from "@/stores/auth-store";
import AirdropCard from "@/components/airdrop/AirdropCard.vue";
import ErrorState from "@/components/ErrorState.vue";

const router = useRouter();
const store = useAirdropStore();
const authStore = useAuthStore();
const tab = ref<"ongoing" | "ended">("ongoing");

const filteredList = computed(() => {
  return tab.value === "ongoing" ? store.ongoingAirdrops : store.endedAirdrops;
});

const loadTrigger = ref<HTMLElement | null>(null);
const isFetching = ref(false);

// 탭 변경 시 초기화
watchEffect(() => {
  if (tab.value === "ongoing") {
    store.fetchOngoingAirdrops(6, false);
  } else {
    store.fetchEndedAirdrops(6, false);
  }
});

// 무한 스크롤 감지
useIntersectionObserver(
  loadTrigger,
  ([{ isIntersecting }]) => {
    if (!isIntersecting || isFetching.value) return;

    isFetching.value = true;

    if (tab.value === "ongoing" && store.hasMoreOngoing) {
      store.fetchOngoingAirdrops(6, true).finally(() => {
        isFetching.value = false;
      });
    } else if (tab.value === "ended" && store.hasMoreEnded) {
      store.fetchEndedAirdrops(6, true).finally(() => {
        isFetching.value = false;
      });
    } else {
      isFetching.value = false;
    }
  },
  { threshold: 0.5 },
);

const goToAdd = () => router.push("/airdrop/add");
const goToEdit = (id: string) => router.push(`/airdrop/edit/${id}`);

const deleteAirdrop = async (id: string) => {
  const ok = confirm("정말 삭제할까요?");
  if (!ok) return;
  try {
    await store.deleteAirdrop(id);
    alert("삭제 완료");
  } catch (err) {
    alert("삭제 실패");
  }
};
const goToDetail = (id: string) => {
  router.push(`/airdrop/${id}`);
};
</script>
