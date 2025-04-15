<template>
  <teleport to="body" v-if="modelValue">
    <div class="v-overlay">
      <div class="v-overlay__container v-overlay--dialog">
        <div
          class="v-overlay__scrim"
          @click="handleClose"
          :class="{ 'v-overlay__scrim--active': loaded }"
        />

        <div
          class="v-dialog border border-zinc-800"
          :class="{
            'v-dialog--active': loaded,
          }"
        >
          <button
            class="v-dialog__close size-8 flex items-center justify-center"
            @click="handleClose"
          >
            <X class="size-6" />
          </button>
          <div class="v-dialog__container p-4 lg:p-6">
            <div class="v-dialog__body">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const loaded = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    loaded.value = true;
  });
});
const handleClose = () => {
  emit("update:modelValue", false);
};
</script>

<style lang="scss" scoped>
@use "./v-overlay.scss";
.v-overlay {
  &--dialog {
    align-items: center;
    justify-content: center;
    margin: auto;
  }
}
.v-dialog__container::-webkit-scrollbar {
  display: none;
}

.v-dialog {
  --mio-theme-padding-x: 1rem;
  max-height: calc(100% - 32px);
  width: calc(100% - 32px);
  height: auto;
  margin: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 1.5rem;
  outline: none;
  position: absolute;
  pointer-events: auto;
  contain: layout;
  background-color: #000;

  -webkit-box-shadow: 0 10px 20px -10px #000;
  box-shadow: 0 10px 20px -10px #000;
  overflow: hidden;
  max-width: 580px;
  &__close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 2;
  }
  &__container {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
  }
  &__body {
    position: relative;
    display: block;
    padding: 2rem 0 1rem;
    width: 100%;
    height: auto;
  }
}
</style>
