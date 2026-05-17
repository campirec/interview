import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from './throttle'

describe('throttle (leading + trailing)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('第一次调用立即触发（leading）', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('间隔内只调用一次时，不会有 trailing 补发', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('间隔内多次调用：leading 立即触发 + trailing 用最后一次参数补发', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled('a')
    vi.advanceTimersByTime(30)
    throttled('b')
    vi.advanceTimersByTime(40)
    throttled('c')
    vi.advanceTimersByTime(30)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenNthCalledWith(1, 'a')
    expect(fn).toHaveBeenNthCalledWith(2, 'c')
  })

  it('间隔结束之前 trailing 不会提前触发', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled('a')
    vi.advanceTimersByTime(20)
    throttled('b')
    vi.advanceTimersByTime(70)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('一个窗口结束后再次调用：又是 leading 立即触发', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    vi.advanceTimersByTime(150)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('leading 正确传递 this 与参数', () => {
    const fn = vi.fn(function (this: unknown) {
      return this
    })
    const ctx = { tag: 'ctx' }
    const throttled = throttle(fn, 100)
    throttled.call(ctx, 'x', 'y')
    expect(fn).toHaveBeenCalledWith('x', 'y')
    expect(fn.mock.instances[0]).toBe(ctx)
  })

  it('trailing 使用最后一次调用的 this 与参数', () => {
    const fn = vi.fn(function (this: unknown) {
      return this
    })
    const ctxA = { tag: 'A' }
    const ctxB = { tag: 'B' }
    const throttled = throttle(fn, 100)
    throttled.call(ctxA, 1)
    vi.advanceTimersByTime(50)
    throttled.call(ctxB, 2)
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenNthCalledWith(2, 2)
    expect(fn.mock.instances[1]).toBe(ctxB)
  })
})
