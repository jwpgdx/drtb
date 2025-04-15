<template>
  <div vaul-drawer-wrapper id="app" class="min-h-screen">
    <Toaster />
    <Header />
    <div class="h-32 lg:h-32" v-if="layoutMeta.showMargin" />
    <div class="router-view-wrapper">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, computed } from "vue";
import { useRoute } from "vue-router";
import { useMarketStore } from "@/stores/market-store";
import Header from "@/components/header/Header.vue";
import Toaster from "@/components/ui/toast/Toaster.vue";

const marketStore = useMarketStore();
const route = useRoute();
const layoutMeta = computed(() => route.meta.layout || {});

onBeforeMount(() => {
  marketStore.fetchMarkets();
});
</script>
<style lang="scss" scoped>
#app {
  background-color: #0c0c0c;
}

.router-view-wrapper {
  margin: 0 auto; /* 가운데 정렬 */
 //overflow-x: hidden;
}
</style>
