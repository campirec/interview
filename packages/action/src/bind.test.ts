import { describe, it, expect } from 'vitest'
import './bind'

describe('Function.prototype.myBind', () => {
  it('改变 this 指向', () => {
    function getName(this: { name: string }) {
      return this.name
    }
    const bound = getName.myBind({ name: 'Charlie' }) as () => string
    expect(bound()).toBe('Charlie')
  })

  it('支持柯里化：预设参数与后续参数拼接', () => {
    function add(this: unknown, a: number, b: number, c: number) {
      return a + b + c
    }
    const bound = add.myBind(null, 1, 2) as (c: number) => number
    expect(bound(3)).toBe(6)
  })

  it('返回的函数可重复调用，互不影响', () => {
    let count = 0
    function inc(this: unknown, step: number) {
      count += step
    }
    const bound = inc.myBind(null, 5) as () => void
    bound()
    bound()
    expect(count).toBe(10)
  })

  it('返回值是函数', () => {
    function fn(this: unknown) {}
    const bound = fn.myBind({})
    expect(typeof bound).toBe('function')
  })
})
