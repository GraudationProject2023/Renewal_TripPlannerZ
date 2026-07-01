// Promise.withResolvers polyfill for Node.js < 21
if (typeof Promise !== 'undefined' && !('withResolvers' in Promise)) {
  ;(Promise as any).withResolvers = function () {
    let resolve: (value: any) => void
    let reject: (reason?: any) => void
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve: resolve!, reject: reject! }
  }
}
