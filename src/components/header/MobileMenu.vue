<template>
  <div class="lg:hidden">
    <!-- 햄버거 버튼 (SVG 사용) -->
    <button
      @click="toggleMenu"
      class="relative z-[51] p-2 text-white focus:outline-none"
      aria-label="메뉴 열기"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        class="transition-transform duration-300"
        :class="{ 'rotate-90': isOpen }"
      >
        <!-- 상단 줄 -->
        <path
          d="M4 6H16"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          :style="{
            transform: isOpen ? 'rotate(45deg) translate(0px, 4px)' : 'none',
            'transform-origin': '10px 10px',
            transition: 'transform 0.3s ease',
          }"
        ></path>
        <path
          d="M4 14H16"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          :style="{
            transform: isOpen ? 'rotate(-45deg) translate(0px, -4px)' : 'none',
            'transform-origin': '10px 10px',
            transition: 'transform 0.3s ease',
          }"
        ></path>
      </svg>
    </button>

    <!-- 메뉴 오버레이 및 내용 -->
    <div
      class="fixed inset-0 z-50 transition-opacity duration-300"
      :class="{
        'pointer-events-auto opacity-100': isOpen,
        'pointer-events-none opacity-0': !isOpen,
      }"
      @click="closeMenu"
    >
      <!-- 오버레이 배경 -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <!-- 메뉴 내용 -->
      <div
        class="absolute left-0 top-0 h-full w-64 transform bg-black shadow-lg transition-transform duration-300"
        :class="{ 'translate-x-0': isOpen, '-translate-x-full': !isOpen }"
        @click.stop
      >
        <div class="h-24" />
        <nav class="p-2">
          <ul>
            <li
              v-for="(item, index) in menuItems"
              :key="index"
              @click="goToRouter(item.value)"
            >
              <router-link
                :to="{ name: item.value }"
                custom
                v-slot="{ isActive }"
              >
                <a
                  :class="{
                    'bg-zinc-900 text-orange-600': isActive,
                    'text-white hover:bg-zinc-950': !isActive,
                  }"
                  class="flex items-center rounded-md px-4 py-3 transition-colors"
                >
                  <component
                    :is="item.icon"
                    class="mr-3 h-5 w-5"
                    :class="{
                      'text-orange-500': isActive,
                      'text-zinc-400': !isActive,
                    }"
                  />
                  <span>{{ item.label }}</span>
                  <span
                    v-if="isActive"
                    class="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500"
                  ></span>
                </a>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useHeaderStore } from "@/stores/header-store";

const headerStore = useHeaderStore();
const menuItems = computed(() => headerStore.menuItems);

const router = useRouter();

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMenu = () => {
  isOpen.value = false;
  document.body.style.overflow = "";
};
const goToRouter = (val) => {
  router.push({ name: val });
  closeMenu();
};
</script>
