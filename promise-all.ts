/**
 * 请手写实现 Promise.all（这次是重新考察，看看你是否掌握了之前指出的问题）：

要求：
- 返回一个 Promise
- 所有 Promise 成功时按输入顺序返回结果数组
- 任一失败则立即 reject
- 处理非 Promise 值
- 空数组直接 resolve
 */

interface PromiseConstructor {
    myAll: (ary: unknown[]) => Promise<unknown[]>
}

Promise.myAll = function(ary: unknown[]) {

    let result = []
    let successCount = 0

    if (ary.length === 0) return Promise.resolve([])
    return new Promise((resolve, reject) => {
        ary.forEach((p, idx) => {
            Promise.resolve(p).then(res => {
                result[idx] = res
                successCount++
                if (successCount === ary.length) {
                    resolve(result)
                }
            }).catch(reject)
        })
    })

}