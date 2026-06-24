import { describe, expect, it, vi } from 'vitest'
import { useAsyncOperation } from '@/shared/lib/async-operation'

describe('shared/lib/async-operation/useAsyncOperation', () => {
  it('tracks loading and updating across calls', async () => {
    vi.useFakeTimers()

    const op = useAsyncOperation(async (x: number) => {
      await new Promise<void>(resolve => setTimeout(resolve, 10))
      return x + 1
    })

    expect(op.loading.value).toBe(false)
    expect(op.updating.value).toBe(false)

    const p1 = op.call(1)
    expect(op.loading.value).toBe(true)
    expect(op.updating.value).toBe(false)

    await vi.advanceTimersByTimeAsync(10)
    await expect(p1).resolves.toBe(2)
    expect(op.loading.value).toBe(false)
    expect(op.updating.value).toBe(false)

    const p2 = op.call(2)
    expect(op.loading.value).toBe(true)
    expect(op.updating.value).toBe(true)

    await vi.advanceTimersByTimeAsync(10)
    await expect(p2).resolves.toBe(3)
    expect(op.loading.value).toBe(false)
    expect(op.updating.value).toBe(false)

    vi.useRealTimers()
  })
})
