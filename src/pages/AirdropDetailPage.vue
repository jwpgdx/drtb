<template>
  <div class="container py-8 text-white">
    <div v-if="!airdrop">
      <p>불러오는 중...</p>
    </div>

    <div v-else>
      <p class="mb-6" v-html="airdrop.description"></p>

      <!-- 관리자 버튼 -->
      <div v-if="authStore.isAdmin" class="flex gap-2">
        <button
          @click="goToEdit(airdrop.id!)"
          class="rounded bg-white/80 px-3 py-1 text-sm text-black hover:bg-white"
        >
          수정
        </button>
        <button
          @click="deleteAirdrop(airdrop.id!)"
          class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAirdropStore } from "@/stores/airdrop-store";
import { useAuthStore } from "@/stores/auth-store";

const route = useRoute();
const router = useRouter();
const store = useAirdropStore();
const authStore = useAuthStore();

const airdrop = ref<any | null>(null);
const id = route.params.id as string;

const fetchDetail = async () => {
  try {
    airdrop.value = await store.fetchAirdropById(id);
  } catch (err) {
    alert("에어드롭 정보를 불러오지 못했습니다.");
  }
};

const goToEdit = (id: string) => {
  router.push(`/airdrop/edit/${id}`);
};

const deleteAirdrop = async (id: string) => {
  const ok = confirm("정말 삭제할까요?");
  if (!ok) return;
  try {
    await store.deleteAirdrop(id);
    alert("삭제 완료");
    router.push("/airdrop");
  } catch (err) {
    alert("삭제 실패");
  }
};

onMounted(() => {
  fetchDetail();
});
</script>
