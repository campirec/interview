interface Function {
  myBind: (ctx: unknown, ...args: unknown[]) => Function;
}

Function.prototype.myBind = function (ctx: unknown, ...params: unknown[]) {
  const fn = this;
  return function (...args: unknown[]) {
    return fn.apply(ctx, [...params, ...args])
  };
};
