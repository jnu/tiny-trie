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
    exports.TERMINAL = '\0';
    exports.TERMINUS = Object.create(null);
    exports.VERSION = 0;
    exports.HEADER_WIDTH_FIELD = 10;
    exports.VERSION_FIELD = 10;
    exports.OFFSET_SIGN_FIELD = 1;
    exports.OFFSET_VAL_FIELD = 21;
    exports.CHAR_WIDTH_FIELD = 8;
    exports.POINTER_WIDTH_FIELD = 8;
});
//# sourceMappingURL=constants.js.map