interface Function {
    myApply: (ctx: unknown, args: unknown[]) => unknown
}

Function.prototype.myApply = function(this: Function, ctx: unknown, params: unknown[]) {
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