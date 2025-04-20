<template>
  <div class="container">
    <form @submit.prevent="submitForm">
      <input
        v-model="formData.title"
        placeholder="제목"
        class="input"
        required
      />
      <textarea
        v-model="formData.description"
        placeholder="내용 (HTML 가능)"
        class="input"
        rows="4"
        required
      />
      <input type="file" @change="handleFileChange" accept="image/*" />
      <input
        v-model="formData.market"
        placeholder="Market"
        class="input"
        required
      />
      <input
        type="datetime-local"
        v-model="formData.startAt"
        class="input"
        required
      />
      startAt: {{ formData.startAt }}
      <input
        type="datetime-local"
        v-model="formData.endAt"
        class="input"
        required
      />
      endAt: {{ formData.endAt }}<br />
      <button type="submit" class="rounded bg-orange-600 px-4 py-2 text-white">
        {{ isEditMode ? "수정하기" : "등록하기" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAirdropStore } from "@/stores/airdrop-store";

const airdropStore = useAirdropStore();
const route = useRoute();
const id = route.params.id as string | undefined;

const isEditMode = ref(!!id);

const formData = ref({
  id: "",
  title: "",
  description: "",
  imageFile: null as File | null,
  market: "",
  startAt: "",
  endAt: "",
});
/*
onMounted(async () => {
  if (id) {
    if (!airdropStore.airdrops.length) await airdropStore.fetchAirdrops();
    const item = airdropStore.airdrops.find((a) => a.id === id);
    if (item) {
      formData.value = {
        id: item.id || "",
        title: item.title,
        description: item.description,
        imageFile: null,
        market: item.market,
        startAt: item.startAt.toDate().toISOString().slice(0, 16),
        endAt: item.endAt.toDate().toISOString().slice(0, 16),
      };
    }
  }
});
*/
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    formData.value.imageFile = target.files[0];
  }
};

const submitForm = async () => {
  try {
    const payload = {
      ...formData.value,
      startAt: formData.value.startAt + ":00",
      endAt: formData.value.endAt + ":00",
    };

    if (isEditMode.value && payload.id) {
      await airdropStore.updateAirdrop(payload);
      alert("수정 완료!");
    } else {
      await airdropStore.addAirdrop(payload);
      alert("등록 완료!");
    }
  } catch (error) {
    console.error(error);
    alert("오류 발생!");
  }
};
</script>

<style scoped>
.input {
  @apply w-full rounded border bg-black p-2 text-sm text-white;
}
</style>
