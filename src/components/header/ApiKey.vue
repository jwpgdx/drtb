<template>
  <Badge
    variant="outline"
    @click="goToApi"
    :class="
      isAuthenticated
        ? ''
        : 'opacity-50 '
    "
    class="text-white border-white"
  >
    <LoaderCircle v-if="isLoading" class="animate-spin mr-1 h-3 w-3" />
    <KeyRound v-else class="mr-1 h-3 w-3" />
    API
  </Badge>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/api-store";
import { LoaderCircle, KeyRound } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

const apiStore = useApiStore();
const router = useRouter();

const isAuthenticated = computed(() => apiStore.isAuthenticated);
const isLoading = computed(() => apiStore.isLoading);

const goToApi = () => {
  router.push({ name: "Apikey" });
};
</script>
