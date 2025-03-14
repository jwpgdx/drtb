<template>
  <div>
    <Banner />
    <Apikey/>
    <MarketList class="mt-8" />
  </div>
</template>

<script lang="ts" setup>
import MarketList from "@/components/MarketList.vue";  // MarketList 컴포넌트 추가
import Banner from "@/components/banner/Banner.vue";  // MarketList 컴포넌트 추가
import Apikey from "@/components/banner/Apikey.vue";  // MarketList 컴포넌트 추가

</script>