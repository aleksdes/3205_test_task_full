<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import { computed, useCssModule } from 'vue'
import { useRoute } from 'vue-router'
import { useJobs } from '@/entities/jobs'
import { useAsyncOperation } from '@/shared/lib/async-operation'
import { dayjs } from '@/shared/lib/dayjs'
import { AsyncWrapper } from '@/shared/ui/async-wrapper'

const styles = useCssModule()
const route = useRoute()

const { fetchJobDetail } = useJobs()
const { jobDetail } = storeToRefs(useJobs())

const params = computed(() => ({
  jobId: String(route.params.id),
}))

const {
  call: _refetchJob,
  error: fetchJobError,
  updating: updatingJob,
  loading: fetchJobLoading,
} = useAsyncOperation(() => fetchJobDetail(params.value.jobId), {
  immediateCall: true,
  dependencies: [params],
})

const hasUrls = computed(() => (jobDetail.value?.urls?.length ?? 0) > 0)
</script>

<template>
  <div :class="styles['job-detail']">
    <div :class="styles['wrapper-card']">
      <AsyncWrapper
        :is-loading="fetchJobLoading"
        :error="fetchJobError"
        :is-updating="updatingJob"
        loading-label="Загрузка задач..."
        is-loading-fixed
        is-updating-fixed
        is-error-fixed
      >
        <div v-if="hasUrls">
          <DataTable
            :value="jobDetail?.urls"
            striped-rows
            size="small"
            scrollable
            scroll-height="700px"
            :pt="{
              wrapper: { class: 'overflow-x-auto' },
            }"
          >
            <Column header="URL" style="max-width:300px" :pt="{ headerCell: { style: 'max-width:300px' }, bodyCell: { style: { maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } } }">
              <template #body="{ data }">
                <a
                  :href="data.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 underline"
                >
                  {{ data.url }}
                </a>
              </template>
            </Column>
            <Column header="Дата начала проверки">
              <template #body="{ data }">
                <template v-if="data.startTimeJob">
                  {{ dayjs(data.startTimeJob).format('DD.MM.YYYY HH:mm') }}
                </template>
                <span v-else>—</span>
              </template>
            </Column>
            <Column header="Дата окончания проверки">
              <template #body="{ data }">
                <template v-if="data.status === 'in_progress'">
                  —
                </template>
                <template v-else-if="data.endTimeJob">
                  {{ dayjs(data.endTimeJob).format('DD.MM.YYYY HH:mm') }}
                </template>
                <span v-else>—</span>
              </template>
            </Column>
            <Column field="httpStatus" header="HTTP Status" body-style="text-align:center">
              <template #body="{ data }">
                <template v-if="data.httpStatus">
                  {{ data.httpStatus }}
                </template>
                <span v-else>—</span>
              </template>
            </Column>
            <Column header="Ошибка">
              <template #body="{ data }">
                <template v-if="data.errorMessage">
                  {{ data.errorMessage }}
                </template>
                <span v-else>—</span>
              </template>
            </Column>
            <Column field="status" header="Статус">
              <template #body="{ data }">
                <Tag
                  v-if="data.status"
                  :value="data.status"
                  :severity="
                    data.status === 'completed'
                      ? 'success'
                      : data.status === 'in_progress'
                        ? 'info'
                        : data.status === 'failed'
                          ? 'danger'
                          : 'warn'
                  "
                />
                <span v-else>—</span>
              </template>
            </Column>
          </DataTable>
        </div>

        <template v-else>
          <div :class="styles['empty-state']">
            <i class="pi pi-info-circle text-blue-500" style="font-size: 2rem" />
            <span class="text-xl font-semibold">Ничего не найдено</span>
            <span class="text-base">Попробуйте изменить запрос</span>
          </div>
        </template>
      </AsyncWrapper>
    </div>
  </div>
</template>

<style module lang="scss">
.job-detail {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

.wrapper-card {
  --card--padding: #{pxToRem(17px)} #{pxToRem(24px)};
  --card--padding-sm: #{pxToRem(18px)} #{pxToRem(18px)};

  padding: var(--card--padding-sm);
  width: 100%;

  @media (min-width: 768px) {
    padding: var(--card--padding);
  }
}

.empty-state {
  background: var(--p-zinc-100);
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
