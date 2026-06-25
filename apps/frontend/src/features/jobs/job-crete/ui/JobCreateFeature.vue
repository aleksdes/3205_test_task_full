<script setup lang="ts">
import type { IJobCreateStepFeatureEmits, IJobCreateStepFeatureSlots } from './job-create-feature'
import { toTypedSchema } from '@vee-validate/zod'
import { useConfirmDialog } from '@vueuse/core'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import { Field, Form } from 'vee-validate'
import { computed, reactive, ref } from 'vue'
import { z } from '@/shared/lib/zod-validate'
import { FieldMessage } from '@/shared/ui'
import { useJobCreate } from '../model'

const emits = defineEmits<IJobCreateStepFeatureEmits>()
defineSlots<IJobCreateStepFeatureSlots>()

const state = reactive({
  urls: '',
})
const jobFormRef = ref()

const { createJobCall, createJobError, loadingCreateJob, createJobErrorMessage } = useJobCreate()

const { reveal: _reveal, isRevealed, onCancel, onConfirm, confirm, cancel } = useConfirmDialog()

async function reveal() {
  emits('open')
  _reveal()
}

const isVisible = computed({
  get() {
    return isRevealed.value
  },
  set() {
    if (isRevealed.value) cancel()
    else reveal()
  },
})

function cancelHandler() {
  emits('close')
}
onCancel(cancelHandler)

function confirmHandler() {
  emits('close')
}
onConfirm(confirmHandler)

const urlPattern = /^https?:\/\/.+\..+/

const stateSchema = z.object({
  urls: z
    .string()
    .min(1, 'Поле обязательно для заполнения')
    .refine(
      (val: string) => val.split(',').every((u: string) => urlPattern.test(u.trim())),
      'Каждая строка должна быть валидным URL (http:// или https://)',
    ),
})

const validationSchema = toTypedSchema(stateSchema)

async function sendForm() {
  if (!state.urls) return

  const { valid } = await jobFormRef.value.validate()

  if (!valid) return

  await createJobCall(state.urls.split(','))

  if (!createJobError.value) {
    confirm()
    emits('createSuccess')
  }
}
</script>

<template>
  <slot
    name="activator"
    v-bind="{
      reveal,
      isRevealed,
    }"
  >
    <Button
      size="small"
      class="create-job-activator"
      :loading="loadingCreateJob"
      aria-label="Создать задание"
      title="Создать задание"
      label="Создать задание"
      @click="reveal"
    />
  </slot>

  <Dialog
    v-model:visible="isVisible"
    modal
    header="Создание нового задания"
    style="max-width: 580px; width: 100%"
    :draggable="false"
    @close="cancel"
  >
    <Form
      ref="jobFormRef"
      v-slot="{ meta }"
      :validation-schema="validationSchema"
      @submit="sendForm"
    >
      <div class="mt-2">
        <Field v-slot="{ errors, field }" v-model="state.urls" name="urls">
          <FloatLabel variant="in">
            <Textarea
              id="name"
              v-bind="field"
              :model-value="field.value"
              :invalid="!!errors.length"
              :disabled="loadingCreateJob"
              class="w-full"
              rows="10"
              cols="30"
              style="resize: none; font-size: 12px"
            />
            <label for="urls">Urls</label>
          </FloatLabel>

          <FieldMessage
            id="name-error"
            :errors="[...errors, createJobErrorMessage || ''].filter(Boolean)"
          />
        </Field>
      </div>

      <Button
        type="submit"
        :loading="loadingCreateJob"
        aria-label="Подтвердить"
        title="Подтвердить"
        label="Подтвердить"
        :disabled="!meta.valid || loadingCreateJob"
      />
    </Form>
  </Dialog>
</template>

<style lang="scss" module></style>
