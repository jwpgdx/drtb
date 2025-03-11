<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { type BadgeVariants, badgeVariants } from ".";
import { Primitive, type PrimitiveProps } from "reka-ui";

interface Props extends PrimitiveProps {
  variant?: BadgeVariants["variant"];
  class?: HTMLAttributes["class"];
}
const props = withDefaults(defineProps<Props>(), {
  as: "badge",
});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="asChild"
    :class="cn(badgeVariants({ variant }), props.class)"
  >
    <slot />
  </Primitive>
</template>
