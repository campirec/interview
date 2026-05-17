import { describe, it, expect, vi } from 'vitest'
import { EventEmitter } from './event-emitter'

describe('EventEmitter', () => {
  it('on + emit：订阅后被触发', () => {
    const ee = new EventEmitter()
    const fn = vi.fn()
    ee.on('greet', fn)
    ee.emit('greet', 'hi')
    expect(fn).toHaveBeenCalledWith('hi')
  })

  it('emit 传递多个参数', () => {
    const ee = new EventEmitter()
    const fn = vi.fn()
    ee.on('data', fn)
    ee.emit('data', 1, 2, 3)
    expect(fn).toHaveBeenCalledWith(1, 2, 3)
  })

  it('同一事件多个监听器都被触发', () => {
    const ee = new EventEmitter()
    const a = vi.fn()
    const b = vi.fn()
    ee.on('tick', a).on('tick', b)
    ee.emit('tick')
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
  })

  it('off 取消指定监听器', () => {
    const ee = new EventEmitter()
    const fn = vi.fn()
    ee.on('x', fn)
    ee.off('x', fn)
    ee.emit('x')
    expect(fn).not.toHaveBeenCalled()
  })

  it('once 只触发一次', () => {
    const ee = new EventEmitter()
    const fn = vi.fn()
    ee.once('one', fn)
    ee.emit('one', 'a')
    ee.emit('one', 'b')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('a')
  })

  it('emit 未订阅的事件不抛错', () => {
    const ee = new EventEmitter()
    expect(() => ee.emit('nothing')).not.toThrow()
  })

  it('off 未订阅的事件不抛错', () => {
    const ee = new EventEmitter()
    expect(() => ee.off('nothing', () => {})).not.toThrow()
  })

  it('on/emit/once 支持链式调用', () => {
    const ee = new EventEmitter()
    expect(ee.on('a', () => {})).toBe(ee)
    expect(ee.emit('a')).toBe(ee)
    expect(ee.once('b', () => {})).toBe(ee)
  })
})
