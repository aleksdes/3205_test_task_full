<script setup lang="ts">
import type { FieldMessageProps } from './field-message'
import { computed, useAttrs, useCssModule } from 'vue'

const props = withDefaults(defineProps<FieldMessageProps>(), {
  mergedError: false,
  mergedMessages: false,
})

const attrs: {
  [key: string]: unknown
} = useAttrs()

const styles = useCssModule()

const getErrors = computed(() => {
  if (!props?.errors)
    return ''
  if (props.mergedError)
    return props?.errors.join(', ')

  return props?.errors[0]
})

const getMessages = computed(() => {
  if (!props?.messages)
    return ''
  if (props.mergedMessages)
    return props.messages.join(', ')

  return props.messages[0]
})
</script>

<template>
  <div :class="[styles['field-messages'], { [styles['field-messages--errors']]: getErrors }]">
    <transition name="slide-fade">
      <small v-if="getErrors || getMessages" v-bind="attrs" class="">{{ getErrors || getMessages }}</small>
    </transition>
  </div>
</template>

<style module lang="scss">
.field-messages {
  --field-messages__color: gray;

  position: relative;
  color: var(--field-messages__color);
  display: flex;
  padding: 4px 12px;
  min-height: 24px;

  &--errors {
    --field-messages__color: red;
  }
}
</style>

<style lang="scss">
.slide-fade-enter-active {
  @include acceleratedTransition(all);
}

.slide-fade-leave-active {
  @include acceleratedTransition(all);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
