type ThrottleFn = (...args: unknown[]) => unknown

export function throttle(fn: ThrottleFn, duration: number) {
    let previous = 0

    return function(this: unknown, ...args: unknown[]) {
        const now = Date.now()
        if (now - previous <= duration) {
            return
        }
        previous = now
        fn.apply(this, args)
    }
}