/**
 * 请手写实现一个发布订阅模式（EventEmitter），要求：
    - on(event, fn)：订阅事件
    - emit(event, ...args)：触发事件
    - off(event, fn)：取消订阅
    - once(event, fn)：只订阅一次
 */

class EventEmitter {
  private eventMap: Record<PropertyKey, Function[]> = {};

  on(event: string, fn: Function) {
    if (!this.eventMap[event]) {
      this.eventMap[event] = [];
    }
    this.eventMap[event].push(fn);
    return this;
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.eventMap[event]) {
      return this;
    }
    [...this.eventMap[event]].forEach((fn) => {
      fn(...args);
    });
    return this;
  }

  off(event: string, fn: Function) {
    if (!this.eventMap[event]) return;
    this.eventMap[event] = this.eventMap[event].filter((_fn) => _fn !== fn);
    return this;
  }

  once(event: string, fn: Function) {
    const wrapper = (...args: unknown[]) => {
      fn(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
    return this;
  }
}
