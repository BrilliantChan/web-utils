// 兼容IOS Promise无法请求Finally

if (!Promise.prototype.finally) {
    Promise.prototype.finally = function (callback) {
        const P = this.constructor;
        
        return this.then(
            value => P.resolve(callback && callback()).then(() => value),
            reason => P.resolve(callback && callback()).then(() => {
                    throw reason;
                }
            ));
    };
}