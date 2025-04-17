<template>
  <div class="container">
    <Banner />
    <div class="tabs-container">
      <div class="relative w-full h-10 flex justify-between gap-6 text-base">
        <div class="flex gap-4 lg:gap-6 text-base">
          <button
            @click="activeTab = 'market'"
            :class="[
              'py-2 px-2 font-semibold focus:outline-none',
              activeTab === 'market'
                ? 'border-b-2 border-orange-500 text-white'
                : 'text-zinc-500 hover:text-zinc-700',
            ]"
          >
            원화 마켓
          </button>
          <button
            @click="activeTab = 'favorite'"
            :class="[
              'py-2 px-2 font-semibold focus:outline-none',
              activeTab === 'favorite'
                ? 'border-b-2 border-orange-500 text-white'
                : 'text-zinc-500 hover:text-zinc-700',
            ]"
          >
            즐겨찾기
          </button>
        </div>
        <!-- 검색 트리거 -->

        <div class="relative flex items-center h-10">
          <button
            v-if="!isSearchExpanded"
            @click="toggleSearch"
            class="flex items-center gap-2 p-2"
          >
            <Search class="size-4 text-muted-foreground" />
            <div class="text-sm text-muted-foreground">가상자산 검색</div>
          </button>

          <!-- 데스크탑 검색창 -->
          <div
            ref="searchContainer"
            class="flex absolute right-0 top-0 bg-background items-center transition-all duration-300 overflow-hidden"
            :class="[
              isSearchExpanded ? 'w-40 lg:w-56 opacity-100 ' : 'w-0 opacity-0 ',
            ]"
          >
            <Input
              v-model="filterQuery"
              placeholder="가상자산 검색"
              class="pl-8 border border-white focus-visible:ring-0"
            />
            <span class="absolute left-0 inset-y-0 flex items-center px-2">
              <Search class="size-4" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 탭 컨텐츠 -->
    <MarketList v-if="activeTab === 'market'" :filter-query="filterQuery" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

import Banner from "@/components/banner/Banner.vue";
import MarketList from "@/components/MarketList.vue";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";

const activeTab = ref("market");
const filterQuery = ref("");
const isSearchExpanded = ref(false);
const searchContainer = ref(null);

const toggleSearch = () => {
  console.log("가상자산");
  isSearchExpanded.value = !isSearchExpanded.value;
};

onClickOutside(searchContainer, (event) => {
  if (isSearchExpanded.value) {
    isSearchExpanded.value = false;
  }
});
</script>

<style scoped>
/* 추가 트랜지션 효과 */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.tabs-container {
  position: sticky;
  display: flex;
  align-items: flex-end;
  top: 0px;
  width: 100%;
  height: 144px;
  z-index: 50; /* 높은 값으로 변경 */
  padding: 32px 0;
  background: linear-gradient(
    to bottom,
    rgba(12, 12, 12, 1) 80%,
    rgba(12, 12, 12, 0) 100%
  );
}
</style>
