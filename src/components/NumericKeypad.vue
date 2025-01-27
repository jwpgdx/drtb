<template>
  <div>
  <div class="grid grid-cols-3 gap-2 p-4">
    <button v-for="num in keypadButtons" :key="num" @click="handleClick(num)" class="button">
      {{ num }}
    </button>
  </div>
</div>
</template>

<script lang="ts" setup>
import { useOrderStore } from "@/stores/order-store"; // Pinia store 가져오기
import { ref, defineProps, defineEmits, watch, computed } from "vue";

const orderStore = useOrderStore();
const tempOrderData = computed(() => orderStore.tempOrderData);

// 키패드 버튼 배열
const keypadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

// 숫자와 삭제 버튼 처리
const handleClick = (value: string) => {
  orderStore.updateTempOrderData(value)
};

</script>

