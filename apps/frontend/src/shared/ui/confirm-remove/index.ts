import { useConfirm } from 'primevue/useconfirm'

export function useConfirmRemove() {
  const confirm = useConfirm()

  return (title?: string | null) =>
    new Promise<boolean>((resolve) => {
      confirm.require({
        message: title ?
          `Удалить "${title}"? Это действие нельзя отменить.` :
          'Удалить элемент? Это действие нельзя отменить.',
        header: 'Подтверждение удаления',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
          label: 'Отмена',
          severity: 'secondary',
          outlined: true,
        },
        acceptProps: {
          label: 'Удалить',
          severity: 'danger',
        },
        accept: () => {
          resolve(true)
        },
        reject: () => {
          resolve(false)
        },
      })
    })
}
