export interface IJobCreateStepFeatureEmits {
  (e: 'close'): void
  (e: 'open'): void
  (e: 'createSuccess'): void
}

export interface IJobCreateStepFeatureSlots {
  activator: (args: { reveal: CallableFunction; isRevealed: boolean }) => void
}
