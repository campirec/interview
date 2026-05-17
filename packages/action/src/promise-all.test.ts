import { describe, it, expect } from 'vitest'
import './promise-all'

describe('Promise.myAll', () => {
  it('空数组立即 resolve 为空数组', async () => {
    await expect(Promise.myAll([])).resolves.toEqual([])
  })

  it('全部 resolve 时按输入顺序返回结果', async () => {
    const result = await Promise.myAll([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ])
    expect(result).toEqual([1, 2, 3])
  })

  it('保留乱序完成时的输入顺序', async () => {
    const delayed = <T>(value: T, ms: number) =>
      new Promise<T>(resolve => setTimeout(() => resolve(value), ms))
    const result = await Promise.myAll([
      delayed('a', 30),
      delayed('b', 10),
      delayed('c', 20),
    ])
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('支持非 Promise 值', async () => {
    const result = await Promise.myAll([1, 'two', { v: 3 }])
    expect(result).toEqual([1, 'two', { v: 3 }])
  })

  it('任一 reject 整体 reject', async () => {
    await expect(
      Promise.myAll([
        Promise.resolve(1),
        Promise.reject(new Error('boom')),
        Promise.resolve(3),
      ]),
    ).rejects.toThrow('boom')
  })

  it('与原生 Promise.all 行为一致（混合场景）', async () => {
    const input = [Promise.resolve(1), 2, Promise.resolve(3)]
    const [mine, native] = await Promise.all([
      Promise.myAll(input),
      Promise.all(input),
    ])
    expect(mine).toEqual(native)
  })
})
