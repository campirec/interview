type DebounceFn = (...args: unknown[]) => unknown

export function debounce(fn: DebounceFn, delay: number) {
    let timer: ReturnType<typeof setTimeout> | null = null
    return function(this: unknown, ...args: unknown[]) {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }    
}


// const debounceFn = debounce((100) => {}, 500)
