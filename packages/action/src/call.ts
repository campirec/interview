/** @file 
 * 请手写实现 call、apply、bind。先实现 call，要求：
    - 能改变函数的 this 指向
    - 能传入参数
    - 处理 this 为 null 的情况
 */


// function myCall(fn: (...args: unknown[]) => unknown, ctx: unknown, ...params: unknown[]) {
//     if (!ctx) {
//         return fn(...params)
//     }
    
//     if (typeof ctx === 'object' && ctx !== null) {
//         const fnCall = Symbol('fnCall')
//         ctx[fnCall] = fn
//         const res =  ctx.fn(...params)
//         delete ctx[fnCall]
//         return res
//     }
// }

// myCall(function() {}, window, 100, 223)


interface Function {
    myCall: (ctx: unknown, ...args: unknown[]) => unknown
}

Function.prototype.myCall = function(this: Function, ctx: unknown, ...params: unknown[]) {
    if (ctx === null || ctx === undefined) {
        return this(...params)
    }
    const _ctx: Record<PropertyKey, unknown> = Object(ctx)
    const key = Symbol()
    _ctx[key] = this
    const res = (_ctx[key] as typeof this)(...params)
    delete _ctx[key]
    return res

}
