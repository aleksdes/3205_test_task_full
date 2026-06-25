<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import { computed, useCssModule } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { JobDetailRoute } from '@/app/router-setup/routes/user-scope-routes'
import { useJobs } from '@/entities/jobs'
import { useJobActivation } from '@/features/jobs/job-activation'
import { JobCreateFeature } from '@/features/jobs/job-crete'
import { useAsyncOperation } from '@/shared/lib/async-operation'
import { dayjs } from '@/shared/lib/dayjs'
import { AsyncWrapper } from '@/shared/ui/async-wrapper'

const styles = useCssModule()
const route = useRoute()
const router = useRouter()

const { fetchJobs } = useJobs()
const { jobs, metaJobs } = storeToRefs(useJobs())
const { activateJob, activateJobError } = useJobActivation()

const params = computed(() => ({
  page: Number(route.query.page) || 1,
  limit: Number(route.query.limit) || 10,
}))

const {
  call: _refetchJobs,
  error: fetchJobsError,
  updating: updatingJobs,
  loading: fetchJobsLoading,
} = useAsyncOperation(() => fetchJobs(params.value), {
  immediateCall: true,
  dependencies: [params],
})

function onPageChange(event: { page: number; rows: number }) {
  router.replace({
    query: {
      ...route.query,
      page: event.page + 1,
      limit: event.rows,
    },
  })
}

const hasJobs = computed(() => jobs.value.length > 0)

const goToJobDetail = JobDetailRoute()
function goDetail(id: string) {
  goToJobDetail.push({ params: { id } })
}
async function onActivateJob(jobId: string) {
  await activateJob(jobId)
  if (!activateJobError.value) {
    _refetchJobs()
  }
}
</script>

<template>
  <div :class="styles['home-page']">
    <div :class="styles['wrapper-card']">
      <AsyncWrapper
        :is-loading="fetchJobsLoading"
        :error="fetchJobsError"
        :is-updating="updatingJobs"
        loading-label="Загрузка задач..."
        is-loading-fixed
        is-updating-fixed
        is-error-fixed
      >
        <JobCreateFeature @create-success="_refetchJobs" />
        <div v-if="hasJobs">
          <DataTable
            :value="jobs"
            striped-rows
            size="small"
            scrollable
            scroll-height="700px"
            :pt="{
              wrapper: { class: 'overflow-x-auto' },
              row: { class: 'cursor-pointer' },
            }"
            class="jobs-table"
            @row-click="(e) => goDetail(e.data.id)"
          >
            <Column field="id" header="ID">
              <template #body="{ data }">
                <span class="font-mono text-sm">{{ data.id }}</span>
              </template>
            </Column>
            <Column header="Дата создания">
              <template #body="{ data }">
                {{ dayjs(data.createdAt).format('DD.MM.YYYY HH:mm') }}
              </template>
            </Column>
            <Column
              header="Количество Url"
              header-class="jobs-table__header-center"
              body-style="text-align:center"
            >
              <template #body="{ data }">
                {{ data.urlIds?.length ?? 0 }}
              </template>
            </Column>
            <Column field="status" header="Статус обработки">
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
            <Column field="stats" header="Статус">
              <template #body="{ data }">
                <Tag
                  v-if="data.stats && data.status !== 'in_progress'"
                  :value="data.stats"
                  :severity="
                    data.stats === 'success'
                      ? 'success'
                      : data.stats === 'error'
                        ? 'danger'
                        : 'warn'
                  "
                />
                <span v-else>—</span>
              </template>
            </Column>
            <Column header="" body-style="text-align:end">
              <template #body="{ data }">
                <Button
                  label="Запустить проверку"
                  size="small"
                  severity="primary"
                  :disabled="data.status === 'in_progress'"
                  @click.stop="onActivateJob(data.id)"
                />
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

    <div v-if="metaJobs" :class="styles['paginator-wrapper']">
      <Paginator
        :first="(metaJobs.page - 1) * metaJobs.limit"
        :rows="metaJobs.limit"
        :total-records="metaJobs.total"
        :rows-per-page-options="[5, 10, 20, 50]"
        @page="onPageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.jobs-table__header-center div) {
  justify-content: center;
}
</style>

<style module lang="scss">
.home-page {
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
  height: 700px;
}

.paginator-wrapper {
  flex-shrink: 0;
  padding: 12px 24px;
  border-top: 1px solid var(--p-zinc-200);
}
</style>
