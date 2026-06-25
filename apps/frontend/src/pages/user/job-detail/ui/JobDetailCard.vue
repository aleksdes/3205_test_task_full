<script setup lang="ts">
import type { IJobDetailCardProps } from './job-detail-card'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import { computed, toRefs, useCssModule } from 'vue'
import { dayjs } from '@/shared/lib/dayjs'

const props = defineProps<IJobDetailCardProps>()
const styles = useCssModule()

const { dataJob } = toRefs(props)

const urlsTotal = computed(() => dataJob.value?.urls?.length ?? 0)
const urlsProcessed = computed(
  () => dataJob.value?.urls?.filter(u => u.status && u.status !== 'pending').length ?? 0,
)
const progressPercent = computed(() =>
  urlsTotal.value > 0 ? Math.round((urlsProcessed.value / urlsTotal.value) * 100) : 0,
)
</script>

<template>
  <Card :class="styles['job-card']">
    <template #title>
      Детальная информация: {{ dataJob.id }}
    </template>
    <template #content>
      <div :class="styles['card-content']">
        <div :class="styles['left-block']">
          <div :class="styles['info-field']">
            <span :class="styles['info-label']">Дата создания</span>
            <span :class="styles['info-value']">{{
              dayjs(dataJob.createdAt).format('DD.MM.YYYY HH:mm')
            }}</span>
          </div>
          <div :class="styles['info-field']">
            <span :class="styles['info-label']">Статус обработки</span>
            <Tag
              v-if="dataJob.status"
              :value="dataJob.status"
              :severity="
                dataJob.status === 'completed'
                  ? 'success'
                  : dataJob.status === 'in_progress'
                    ? 'info'
                    : dataJob.status === 'failed'
                      ? 'danger'
                      : 'warn'
              "
            />
            <span v-else>—</span>
          </div>
          <div :class="styles['info-field']">
            <span :class="styles['info-label']">Статус</span>
            <Tag
              v-if="dataJob.stats"
              :value="dataJob.stats"
              :severity="
                dataJob.stats === 'success'
                  ? 'success'
                  : dataJob.stats === 'error'
                    ? 'danger'
                    : 'warn'
              "
            />
            <span v-else>—</span>
          </div>
        </div>
        <div :class="styles['right-block']">
          <span :class="styles['info-label']">Обработано URL</span>
          <div class="flex flex-row items-center gap-3">
            <ProgressBar :value="progressPercent" :class="styles['progress-bar']" />
            <span :class="styles['progress-text']">{{ urlsProcessed }} / {{ urlsTotal }}</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style module lang="scss">
.job-card {
  box-shadow:
    0 1px 10px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1) !important;
  margin: 15px;
}

.card-content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: flex-start;
}

.left-block {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}

.right-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 350px;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: auto;
}

.info-label {
  font-size: 12px;
  color: var(--p-text-muted-color);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
}

.progress-bar {
  height: 12px;
  width: 100%;
}

.progress-text {
  font-size: 13px;
  color: var(--p-text-muted-color);
  text-align: center;
  white-space: nowrap;
}
</style>
