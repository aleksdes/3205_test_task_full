<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Paginator from 'primevue/paginator'
import { computed, useCssModule } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobs } from '@/entities/jobs'
import { useAsyncOperation } from '@/shared/lib/async-operation'
import { AsyncWrapper } from '@/shared/ui/async-wrapper'

const styles = useCssModule()
const route = useRoute()
const router = useRouter()

const { fetchJobs } = useJobs()
const { jobs, metaJobs } = storeToRefs(useJobs())

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
        <div v-if="hasJobs" :class="styles['content-container']">
          <div :class="styles['jobs-table']">
            <div v-for="job in jobs" :key="job.id" :class="styles['jobs-table__row']">
              <div :class="styles['jobs-table__cell']">
                <span :class="styles['jobs-table__label']">ID</span>
                <span>{{ job.id }}</span>
              </div>
              <div :class="styles['jobs-table__cell']">
                <span :class="styles['jobs-table__label']">Статус</span>
                <span>{{ job.status ?? '—' }}</span>
              </div>
              <div :class="styles['jobs-table__cell']">
                <span :class="styles['jobs-table__label']">Создан</span>
                <span>{{ new Date(job.createdAt).toLocaleString() }}</span>
              </div>
            </div>
          </div>
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

    <div v-if="metaJobs && metaJobs.totalPages > 1" :class="styles['paginator-wrapper']">
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
  flex: 1;
  min-height: 0;

  @media (min-width: 768px) {
    padding: var(--card--padding);
  }
}

.content-container {
  height: 100%;
  overflow-y: auto;
}

.jobs-table {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__row {
    display: flex;
    gap: 16px;
    padding: 12px 16px;
    background: var(--p-zinc-100);
    border-radius: var(--radius-xl);
  }

  &__cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-size: 12px;
    color: var(--p-zinc-500);
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

.paginator-wrapper {
  flex-shrink: 0;
  padding: 12px 24px;
  border-top: 1px solid var(--p-zinc-200);
}
</style>
