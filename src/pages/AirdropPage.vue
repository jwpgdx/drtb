<template>
  <div class="container">
    <!-- 탭 + 등록버튼 -->
    <div class="relative w-full h-10 flex justify-between items-center mb-6">
      <div class="flex gap-4 lg:gap-6 text-base">
        <button
          @click="tab = 'ongoing'"
          :class="[
            'py-2 px-2 font-medium focus:outline-none',
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
            'py-2 px-2 font-medium focus:outline-none',
            tab === 'ended'
              ? 'border-b-2 border-orange-500 text-white'
              : 'text-zinc-500 hover:text-zinc-700',
          ]"
        >
          종료
        </button>
      </div>
      <!-- admin만 등록버튼 표시 -->
      <button
        v-if="authStore.isAdmin"
        @click="goToAdd"
        class="bg-orange-600 text-white px-4 py-1.5 rounded text-sm"
      >
        + 등록하기
      </button>
    </div>

    <!-- 카드 목록 -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ErrorState
          class="col-span-3"
          v-if="filteredList.length === 0"
          image="content"
          title="진행중인 이벤트가 없습니다."
          content="새로운 이벤트가 곧 열릴 예정입니다!"
          />

        <div v-for="item in filteredList" :key="item.id" class="relative group">
          <AirdropCard :item="item" />
          <!-- admin만 수정/삭제 버튼 표시 -->
          <div
            v-if="authStore.isAdmin"
            class="absolute top-2 right-2 hidden group-hover:flex flex-col gap-1"
          >
            <button
              @click="goToEdit(item.id!)"
              class="bg-white/80 text-xs text-black px-2 py-1 rounded hover:bg-white"
            >
              수정
            </button>
            <button
              @click="deleteAirdrop(item.id!)"
              class="bg-red-600 text-xs text-white px-2 py-1 rounded hover:bg-red-700"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAirdropStore } from "@/stores/airdrop-store";
import { useAuthStore } from "@/stores/auth-store"; // auth store 추가
import AirdropCard from "@/components/airdrop/AirdropCard.vue";
import ErrorState from "@/components/ErrorState.vue";

const router = useRouter();
const store = useAirdropStore();
const authStore = useAuthStore(); // auth store 사용
const tab = ref<"ongoing" | "ended">("ongoing");

const filteredList = computed(() => {
  return tab.value === "ongoing" ? store.ongoingWithScheduled : store.ended;
});

onMounted(() => {
  store.fetchAirdrops();
});

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
</script>
