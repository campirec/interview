import { describe, it, expect } from 'vitest'
import './call'

describe('Function.prototype.myCall', () => {
  it('改变 this 指向', () => {
    function getName(this: { name: string }) {
      return this.name
    }
    expect(getName.myCall({ name: 'Alice' })).toBe('Alice')
  })

  it('传递参数', () => {
    function add(this: unknown, a: number, b: number) {
      return a + b
    }
    expect(add.myCall(null, 1, 2)).toBe(3)
  })

  it('ctx 为 null 时按裸函数调用（strict 下 this 为 undefined）', () => {
    function getThis(this: unknown) {
      return this
    }
    expect(getThis.myCall(null)).toBeUndefined()
    expect(getThis.myCall(undefined)).toBeUndefined()
  })

  it('基本类型 ctx 会被包装成对象', () => {
    function getThisType(this: unknown) {
      return typeof this
    }
    expect(getThisType.myCall(42)).toBe('object')
  })

  it('调用后清理临时 Symbol 键，不污染原对象', () => {
    function noop(this: unknown) {}
    const ctx: Record<PropertyKey, unknown> = { foo: 1 }
    noop.myCall(ctx)
    const symbolKeys = Object.getOwnPropertySymbols(ctx)
    expect(symbolKeys).toHaveLength(0)
    expect(ctx).toEqual({ foo: 1 })
  })
})
