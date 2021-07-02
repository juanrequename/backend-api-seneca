export function bufferThrottle(fn, threshhold = 250, scope) {
    let last;
    let deferTimer;
    let bufferedArgs = [];
    return function(...args) {
        const context = scope || this;
        const now = +new Date();
        bufferedArgs = [...bufferedArgs, ...args];
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                const buffer = [...bufferedArgs];
                bufferedArgs = [];
                fn.apply(context, [buffer]);
            }, threshhold);
        } else {
            last = now;
            const buffer = [...bufferedArgs];
            bufferedArgs = [];
            return fn.apply(context, [buffer]);
        }
    };
}