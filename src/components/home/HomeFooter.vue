<template>
  <div class="container">
    <div
      class="flex py-12 px-4 lg:px-0 flex-col lg:flex-row items-start gap-8 lg:items-center justify-between w-full"
    >
      <div class="text-4xl">Plan the present. Build the future.</div>
      <div class="flex gap-2">
        <div class="gradient-content">
          <button class="gradient-button">Get Started</button>
          <div class="gradient-glow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.gradient-content {
  position: relative;
  height: 40px;
  width: 120px;
  border-radius: 24px;
}
.gradient-button {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  z-index: 2;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  font-size: 14px;
  background-color: #000;
}
.gradient-glow {
  position: absolute;
  content: "";
  top: 8px;
  left: 0;
  right: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  transform: scale(0.9) translateZ(0);
  filter: blur(15px);
  background: linear-gradient(
    to left,
    #ff5770,
    #e4428d,
    #c42da8,
    #9e16c3,
    #6501de,
    #9e16c3,
    #c42da8,
    #e4428d,
    #ff5770
  );
  background-size: 200% 200%;
  animation: animateGlow 1.25s linear infinite;
}

@keyframes animateGlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
