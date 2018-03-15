(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./floor_log2", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const floor_log2_1 = require("./floor_log2");
    const chai_1 = require("chai");
    describe('floor_log2', () => {
        it('should compute the floored log base 2 of a number', () => {
            chai_1.assert.strictEqual(floor_log2_1.default(0), 0);
            chai_1.assert.strictEqual(floor_log2_1.default(1), 0);
            chai_1.assert.strictEqual(floor_log2_1.default(2), 1);
            chai_1.assert.strictEqual(floor_log2_1.default(3), 1);
            chai_1.assert.strictEqual(floor_log2_1.default(4), 2);
            chai_1.assert.strictEqual(floor_log2_1.default(5), 2);
            chai_1.assert.strictEqual(floor_log2_1.default(6), 2);
            chai_1.assert.strictEqual(floor_log2_1.default(7), 2);
            chai_1.assert.strictEqual(floor_log2_1.default(8), 3);
            chai_1.assert.strictEqual(floor_log2_1.default(15), 3);
            chai_1.assert.strictEqual(floor_log2_1.default(16), 4);
        });
    });
});
//# sourceMappingURL=floor_log2.test.js.map