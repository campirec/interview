import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('在 delay 之前不触发', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()
  })

  it('在 delay 之后触发一次', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('连续调用只触发最后一次', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced(1)
    vi.advanceTimersByTime(50)
    debounced(2)
    vi.advanceTimersByTime(50)
    debounced(3)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(3)
  })

  it('正确传递 this 与参数', () => {
    const fn = vi.fn(function (this: unknown) {
      return this
    })
    const ctx = { tag: 'ctx' }
    const debounced = debounce(fn, 50)
    debounced.call(ctx, 'a', 'b')
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledWith('a', 'b')
    expect(fn.mock.instances[0]).toBe(ctx)
  })
})
