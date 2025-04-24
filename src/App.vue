<template>
  <div vaul-drawer-wrapper id="app" class="min-h-screen">
    <Header />
    <div class="h-20 lg:h-32" v-if="layoutMeta.showMargin" />
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

const marketStore = useMarketStore();
const route = useRoute();

// ✅ layout meta 타입 정의 추가
interface LayoutMeta {
  showMargin?: boolean;
  showBack?: boolean;
  showLogo?: boolean;
}
const layoutMeta = computed<LayoutMeta>(() => route.meta.layout as LayoutMeta || {});

onBeforeMount(() => {
  marketStore.fetchMarkets();
});
</script>

<style lang="scss" scoped>
#app {
  background-color: #0c0c0c;
}

.router-view-wrapper {
  margin: 0 auto;
}
</style>
