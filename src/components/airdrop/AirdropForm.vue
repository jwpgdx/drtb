<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <input v-model="title" placeholder="제목" class="input" required />
    <textarea v-model="description" placeholder="내용 (HTML 가능)" class="input" rows="4" required />
    
    <input type="file" @change="onFileChange" class="input" accept="image/*" required />
    
    <input v-model="market" placeholder="Market" class="input" required />

    <label class="block">시작 시간</label>
    <input type="datetime-local" v-model="startAt" class="input" required />

    <label class="block">종료 시간</label>
    <input type="datetime-local" v-model="endAt" class="input" required />

    <button type="submit" class="bg-orange-600 px-4 py-2 rounded text-white">등록하기</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAirdropStore } from "@/stores/airdrop-store";

const store = useAirdropStore();

const title = ref("");
const description = ref("");
const file = ref<File | null>(null);
const market = ref("");
const startAt = ref("");
const endAt = ref("");

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  file.value = target.files?.[0] || null;
};

const handleSubmit = async () => {
  if (!file.value) {
    alert("이미지를 선택해주세요.");
    return;
  }

  try {
    const imageUrl = await store.uploadImage(file.value);
    await store.addAirdrop({
      title: title.value,
      description: description.value,
      imageUrl,
      market: market.value,
      startAt: startAt.value,
      endAt: endAt.value,
    });

    alert("등록 완료!");

    title.value = "";
    description.value = "";
    file.value = null;
    market.value = "";
    startAt.value = "";
    endAt.value = "";
  } catch (err) {
    alert("등록 실패: " + (err as Error).message);
  }
};
</script>

<style scoped>
.input {
  @apply w-full p-2 border rounded text-sm bg-black text-white;
}
</style>
