<template>
  <Select v-model="ratio">
    <SelectTrigger>
      <SelectValue placeholder="비율" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="1">최대</SelectItem>
        <SelectItem value="0.75">75%</SelectItem>
        <SelectItem value="0.5">50%</SelectItem>
        <SelectItem value="0.25">25%</SelectItem>
        <SelectItem value="0.1">10%</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useOrderStore } from "@/stores/order-store";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderStore = useOrderStore();

const orderRatio = computed(() => orderStore.orderRatio);

// 이벤트를 정의
const ratio = computed({
  get: () => orderStore.orderRatio,
  set: (value) => orderStore.setRatioChange(value),
});

</script>
