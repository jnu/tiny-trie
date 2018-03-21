"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function floor_log2(x) {
    let n = 0;
    while (x >>= 1) {
        n++;
    }
    return n;
}
exports.floor_log2 = floor_log2;
//# sourceMappingURL=floor_log2.js.map