type ThrottleFn = (...args: unknown[]) => unknown

export function throttle(fn: ThrottleFn, duration: number) {
    let previous = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    let savedArgs: unknown[] | null = null
    let savedThis: unknown = null

    return function(this: unknown, ...args: unknown[]) {
        const now = Date.now()
        const remaining = duration - (now - previous)

        if (remaining <= 0 || remaining > duration) {
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            previous = now
            fn.apply(this, args)
        } else if (!timer) {
            savedArgs = args
            savedThis = this
            timer = setTimeout(() => {
                previous = Date.now()
                timer = null
                const argsToUse = savedArgs as unknown[]
                const thisToUse = savedThis
                savedArgs = null
                savedThis = null
                fn.apply(thisToUse, argsToUse)
            }, remaining)
        } else {
            savedArgs = args
            savedThis = this
        }
    }
}
