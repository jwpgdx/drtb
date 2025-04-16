<template>
  <form @submit.prevent="submitForm">
    <input v-model="formData.title" placeholder="제목" class="input" required />
    <textarea v-model="formData.description" placeholder="내용 (HTML 가능)" class="input" rows="4" required />
    
    <input type="file" @change="handleFileChange" accept="image/*" />
    
    <input v-model="formData.market" placeholder="Market" class="input" required />

    <input type="datetime-local" v-model="formData.startAt" class="input" required />
    <input type="datetime-local" v-model="formData.endAt" class="input" required />

    <button type="submit" class="bg-orange-600 px-4 py-2 rounded text-white">등록하기</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAirdropStore } from '@/stores/airdrop-store';

const airdropStore = useAirdropStore();
const formData = ref({
  title: '',
  description: '',
  imageFile: null, // 파일 객체 저장
  market: '',
  startAt: '',
  endAt: '',
});

const handleFileChange = (event) => {
  formData.value.imageFile = event.target.files[0];
};
const submitForm = async () => {
  try {
    if (!formData.value.startAt || !formData.value.endAt) {
      throw new Error("시작/종료 시간이 입력되지 않았습니다.");
    }

    // datetime-local은 "2025-04-16T15:00" 이런 형태로 나옴 → 뒤에 초 붙여 안정화
    const payload = {
      ...formData.value,
      startAt: formData.value.startAt.includes(":") ? formData.value.startAt + ":00" : formData.value.startAt,
      endAt: formData.value.endAt.includes(":") ? formData.value.endAt + ":00" : formData.value.endAt,
    };

    await airdropStore.addAirdrop(payload);
    alert("등록 완료!");
  } catch (error) {
    console.error("등록 실패", error);
    alert(error.message || "등록 중 오류 발생");
  }
};
</script>

<style scoped>
.input {
  @apply w-full p-2 border rounded text-sm bg-black text-white;
}
</style>
