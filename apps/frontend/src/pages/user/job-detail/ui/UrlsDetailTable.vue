<script setup lang="ts">
import type { IUrlsDetailTableProps } from './urls-detail-table'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import { computed, toRefs, useCssModule } from 'vue'
import { dayjs } from '@/shared/lib/dayjs'

const props = withDefaults(defineProps<IUrlsDetailTableProps>(), {
  dataUrls: () => [],
})
const styles = useCssModule()

const { dataUrls } = toRefs(props)
const hasUrls = computed(() => (dataUrls.value?.length ?? 0) > 0)
</script>

<template>
  <Card :class="styles['urls-card']">
    <template #title>
      Привязанные URL
    </template>
    <template #content>
      <div v-if="hasUrls">
        <DataTable
          :value="dataUrls"
          striped-rows
          size="small"
          scrollable
          scroll-height="700px"
          class="urls-table"
          :pt="{
            wrapper: { class: 'overflow-x-auto' },
          }"
        >
          <Column
            header="URL"
            style="max-width: 300px"
            :pt="{
              headerCell: { style: 'max-width:300px' },
              bodyCell: {
                style: {
                  maxWidth: '300px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              },
            }"
          >
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
          <Column
            field="httpStatus"
            header="HTTP Status"
            body-style="text-align:center"
            header-class="urls-table__header-center"
          >
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
                  data.status === 'success'
                    ? 'success'
                    : data.status === 'in_progress'
                      ? 'info'
                      : data.status === 'error'
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
    </template>
  </Card>
</template>

<style lang="scss" scoped>
:deep(.urls-table__header-center div) {
  justify-content: center;
}
</style>

<style module lang="scss">
.urls-card {
  box-shadow:
    0 1px 10px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1) !important;
  margin: 15px;
}
.empty-state {
  background: var(--p-zinc-100);
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
