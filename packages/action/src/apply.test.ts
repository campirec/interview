import { describe, it, expect } from 'vitest'
import './apply'

describe('Function.prototype.myApply', () => {
  it('改变 this 指向', () => {
    function getName(this: { name: string }) {
      return this.name
    }
    expect(getName.myApply({ name: 'Bob' }, [])).toBe('Bob')
  })

  it('以数组形式传参', () => {
    function sum(this: unknown, ...nums: number[]) {
      return nums.reduce((a, b) => a + b, 0)
    }
    expect(sum.myApply(null, [1, 2, 3, 4])).toBe(10)
  })

  it('ctx 为 null/undefined 时直接调用', () => {
    function getThis(this: unknown) {
      return this
    }
    expect(getThis.myApply(null, [])).toBeUndefined()
    expect(getThis.myApply(undefined, [])).toBeUndefined()
  })

  it('基本类型 ctx 会被包装成对象', () => {
    function getThisType(this: unknown) {
      return typeof this
    }
    expect(getThisType.myApply('hello', [])).toBe('object')
  })

  it('调用后不污染 ctx', () => {
    function noop(this: unknown) {}
    const ctx: Record<PropertyKey, unknown> = { a: 1 }
    noop.myApply(ctx, [])
    expect(Object.getOwnPropertySymbols(ctx)).toHaveLength(0)
  })
})
