<script setup lang="ts">
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import Toaster from '@/components/ui/toast/Toaster.vue'

const router = useRouter();


</script>

<template>
  <div class="app min-h-screen ">
    <Toaster />
    <Header />
    <main class="p-4">
      <RouterView />
    </main>

   
  </div>
</template>

<style scoped>
.app {
  background-color: #f7f7f7;
}</style>
