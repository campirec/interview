function deepClone<T>(obj: T, cache = new WeakMap<object, unknown>()): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }

    if (cache.has(obj)) {
        return cache.get(obj) as T
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags) as T
    }

    if (obj instanceof Function) {
        return obj
    }

    if (obj instanceof Set) {
        const set = new Set()
        cache.set(obj, set)
        obj.forEach(value => {
            set.add(deepClone(value, cache))
        })
        return set as T
    }

    if (obj instanceof Map) {
        const map = new Map()
        cache.set(obj, map)
        obj.forEach((value, key) => {
            map.set(deepClone(key, cache), deepClone(value, cache))
        })
        return map as T
    }

    if (Array.isArray(obj)) {
        const ary: unknown[] = []
        cache.set(obj, ary)
        for (let i = 0; i < obj.length; i++) {
            ary[i] = deepClone(obj[i], cache)
        }
        return ary as T
    }

    const result: Record<keyof T, any> = {} as T
    cache.set(obj, result)
    
    for (let key in obj) {
        if (Object.hasOwn(obj, key)) {
            result[key] = deepClone(obj[key], cache)
        }
    }

    for (const sym of Object.getOwnPropertySymbols(obj)) {
        result[sym as keyof T] = deepClone(obj[sym as keyof T], cache)
    }

    return result as T
}