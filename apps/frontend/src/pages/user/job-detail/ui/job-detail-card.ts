import type { JobTaskDetail } from '@/shared/generated/api'

export interface IJobDetailCardProps {
  dataJob: JobTaskDetail
}

export interface IJobDetailCardEmits {
  (e: 'deleteSuccess'): void
}
