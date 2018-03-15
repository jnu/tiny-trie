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
    exports.BASE64_INT_TO_CHAR = `\
ABCDEFGHIJKLMNOPQRSTUVWXYZ\
abcdefghijklmnopqrstuvwxyz\
0123456789\
+/\
`.split('');
    exports.BASE64_CHAR_TO_INT = exports.BASE64_INT_TO_CHAR.reduce((agg, char, i) => {
        agg[char] = i;
        return agg;
    }, {});
});
//# sourceMappingURL=base64.js.map