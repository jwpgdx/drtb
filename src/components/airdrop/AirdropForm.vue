<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <input v-model="title" placeholder="제목" class="input" required />
      <textarea v-model="description" placeholder="내용 (HTML도 가능)" class="input" rows="4" required />
      <input type="file" @change="handleFileChange" accept="image/*" required class="input" />
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
  
  const title = ref("");
  const description = ref("");
  const market = ref("");
  const startAt = ref("");
  const endAt = ref("");
  const imageFile = ref<File | null>(null);
  
  const store = useAirdropStore();
  
  const handleFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) {
      imageFile.value = files[0];
    }
  };
  
  const handleSubmit = async () => {
    if (!imageFile.value) return alert("이미지를 선택하세요");
  
    const imageUrl = await store.uploadImage(imageFile.value);
  
    await store.addAirdrop({
      title: title.value,
      description: description.value,
      imageUrl,
      market: market.value,
      startAt: startAt.value,
      endAt: endAt.value,
    });
  
    // reset
    title.value = "";
    description.value = "";
    market.value = "";
    startAt.value = "";
    endAt.value = "";
    imageFile.value = null;
  
    alert("등록 완료!");
  };
  </script>
  
  <style scoped>
  .input {
    @apply w-full p-2 border rounded text-sm bg-black text-white;
  }
  </style>
  