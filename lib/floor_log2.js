(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function floor_log2(x) {
        let n = 0;
        while (x >>= 1) {
            n++;
        }
        return n;
    }
    exports.default = floor_log2;
});
//# sourceMappingURL=floor_log2.js.map