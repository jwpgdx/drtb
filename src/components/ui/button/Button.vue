<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps as RadixPrimitiveProps } from 'radix-vue'
import { type ButtonVariants, buttonVariants } from '.'

// PrimitiveProps 확장
interface PrimitiveProps extends RadixPrimitiveProps {
  as?: string
  asChild?: boolean
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

// 기본값 설정
const props = withDefaults(defineProps<PrimitiveProps>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
