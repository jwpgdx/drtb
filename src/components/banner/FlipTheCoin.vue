<template>
    <!-- Lottie 애니메이션 붙일 대상 -->
    <div ref="lottieContainer" style="height: 36px;"></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import lottie, { AnimationItem } from "lottie-web";
  import animationData from '@/assets/animations/airdrop.json'; // json 파일 경로
  
  const lottieContainer = ref<HTMLDivElement | null>(null);
  let animationInstance: AnimationItem | undefined;
  
  onMounted(() => {
    if (!lottieContainer.value) return;
    animationInstance = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet'
      }
    });
    
    // 혹시 JSON 내부 설정이 영향을 준다면 강제 재설정
    if (animationInstance) {
      animationInstance.loop = false;
      animationInstance.play();
    }
  });
  </script>
  