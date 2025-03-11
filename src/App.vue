<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useMarketStore } from "@/stores/market-store";

import Header from "@/components/header/Header.vue";
import Toaster from "@/components/ui/toast/Toaster.vue";

const marketStore = useMarketStore();

onBeforeMount(() => {
  marketStore.fetchMarkets();
});
</script>

<template>
  <div vaul-drawer-wrapper id="app" class="min-h-screen">
    <Toaster />
    <Header />
    <main class="p-4">
      <div class="router-view-wrapper">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  background-color: #f7f7f7;
}

.router-view-wrapper {
  max-width: 560px; /* 원하는 max-width 값 */
  margin: 0 auto; /* 가운데 정렬 */
}
</style>
