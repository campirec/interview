import { describe, it, expect } from 'vitest'
import { deepClone } from './deep-clone'

describe('deepClone', () => {
  it('基本类型直接返回', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(null)).toBeNull()
    expect(deepClone(undefined)).toBeUndefined()
    expect(deepClone(true)).toBe(true)
  })

  it('普通对象：值相同但引用独立', () => {
    const src = { a: 1, b: { c: 2 } }
    const cloned = deepClone(src)
    expect(cloned).toEqual(src)
    expect(cloned).not.toBe(src)
    expect(cloned.b).not.toBe(src.b)
  })

  it('数组：值相同但引用独立', () => {
    const src = [1, [2, 3], { x: 4 }]
    const cloned = deepClone(src)
    expect(cloned).toEqual(src)
    expect(cloned).not.toBe(src)
    expect(cloned[1]).not.toBe(src[1])
  })

  it('Date 对象', () => {
    const src = new Date('2026-05-17T00:00:00Z')
    const cloned = deepClone(src)
    expect(cloned).toBeInstanceOf(Date)
    expect(cloned.getTime()).toBe(src.getTime())
    expect(cloned).not.toBe(src)
  })

  it('RegExp 对象', () => {
    const src = /hello/gi
    const cloned = deepClone(src)
    expect(cloned).toBeInstanceOf(RegExp)
    expect(cloned.source).toBe('hello')
    expect(cloned.flags).toBe('gi')
    expect(cloned).not.toBe(src)
  })

  it('Set / Map 深拷贝', () => {
    const inner = { v: 1 }
    const set = new Set([inner])
    const map = new Map<string, { v: number }>([['k', inner]])

    const clonedSet = deepClone(set)
    const clonedMap = deepClone(map)

    expect(clonedSet).toBeInstanceOf(Set)
    expect(clonedMap).toBeInstanceOf(Map)
    expect([...clonedSet][0]).not.toBe(inner)
    expect(clonedMap.get('k')).not.toBe(inner)
    expect(clonedMap.get('k')).toEqual({ v: 1 })
  })

  it('循环引用不爆栈', () => {
    const src: Record<string, unknown> = { name: 'cycle' }
    src.self = src
    const cloned = deepClone(src) as Record<string, unknown>
    expect(cloned.name).toBe('cycle')
    expect(cloned.self).toBe(cloned)
    expect(cloned).not.toBe(src)
  })

  it('Symbol 属性也会被拷贝', () => {
    const sym = Symbol('k')
    const src = { [sym]: { v: 1 } }
    const cloned = deepClone(src)
    expect((cloned as any)[sym]).toEqual({ v: 1 })
    expect((cloned as any)[sym]).not.toBe(src[sym])
  })

  it('函数直接返回原引用（不深拷贝）', () => {
    const fn = () => 1
    const src = { fn }
    const cloned = deepClone(src)
    expect(cloned.fn).toBe(fn)
  })
})
