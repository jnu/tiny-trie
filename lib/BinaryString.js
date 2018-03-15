(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./floor_log2", "./base64"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const floor_log2_1 = require("./floor_log2");
    const base64_1 = require("./base64");
    class BinaryString {
        constructor() {
            this.buffer = 0;
            this.pointer = 0;
            this.data = '';
        }
        write(val, width = null) {
            let buf = this.buffer;
            let len = width || floor_log2_1.default(val) + 1;
            if (width && val >= (0x1 << width)) {
                throw new Error(`Can't write ${val} in only ${width} bits`);
            }
            this.buffer = (buf << len) | val;
            this.pointer += len;
            this._digest();
        }
        flush() {
            let buffer = this.buffer;
            let pointer = this.pointer;
            while (pointer && pointer < 6) {
                buffer <<= 1;
                pointer += 1;
            }
            this.pointer = pointer;
            this.buffer = buffer;
            this._digest();
        }
        getData() {
            this.flush();
            return this.data;
        }
        _digest() {
            let buffer = this.buffer;
            let pointer = this.pointer;
            let newData = '';
            while (pointer >= 6) {
                let remainder = (pointer - 6);
                let code = buffer >> remainder;
                buffer = buffer ^ (code << remainder);
                pointer = remainder;
                newData += base64_1.BASE64_INT_TO_CHAR[code];
            }
            this.pointer = pointer;
            this.buffer = buffer;
            this.data += newData;
        }
    }
    exports.default = BinaryString;
});
//# sourceMappingURL=BinaryString.js.map