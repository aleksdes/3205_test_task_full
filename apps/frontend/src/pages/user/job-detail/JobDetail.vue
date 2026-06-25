<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, ref, useCssModule, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useJobs } from '@/entities/jobs'
import { useAsyncOperation } from '@/shared/lib/async-operation'
import { AsyncWrapper } from '@/shared/ui/async-wrapper'
import JobDetailCard from './ui/JobDetailCard.vue'
import UrlsDetailTable from './ui/UrlsDetailTable.vue'

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

const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)

function startPolling() {
  stopPolling()
  pollingInterval.value = setInterval(() => {
    fetchJobDetail(params.value.jobId)
  }, 5000)
}

function stopPolling() {
  if (pollingInterval.value !== null) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

watch(jobDetail, (detail) => {
  if (detail && detail.status === 'in_progress') {
    startPolling()
  }
  else {
    stopPolling()
  }
}, { immediate: true })

onUnmounted(stopPolling)
</script>

<template>
  <div :class="styles['job-detail']">
    <div :class="styles['wrapper-card']">
      <AsyncWrapper
        :is-loading="fetchJobLoading"
        :error="fetchJobError"
        :is-updating="updatingJob"
        loading-label="Загрузка данных задачи..."
        is-loading-fixed
        is-updating-fixed
        is-error-fixed
      >
        <template v-if="jobDetail">
          <JobDetailCard :data-job="jobDetail" />
          <UrlsDetailTable :data-urls="jobDetail?.urls || []" />
        </template>

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
  height: 700px;
}
</style>
