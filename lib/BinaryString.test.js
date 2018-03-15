(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BinaryString", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const BinaryString_1 = require("./BinaryString");
    const chai_1 = require("chai");
    describe('BinaryString', () => {
        describe('constructor', () => {
            it('creates an empty binary string', () => {
                let bs = new BinaryString_1.default();
                chai_1.assert.strictEqual(bs['buffer'], 0);
                chai_1.assert.strictEqual(bs['pointer'], 0);
                chai_1.assert.strictEqual(bs['data'], '');
                chai_1.assert.strictEqual(bs.getData(), '');
            });
        });
        describe('write', () => {
            it('should add an item to the buffer', () => {
                let bs = new BinaryString_1.default();
                bs.write(1);
                chai_1.assert.strictEqual(bs['buffer'], 1);
                chai_1.assert.strictEqual(bs['pointer'], 1);
                chai_1.assert.strictEqual(bs['data'], '');
                bs.write(0);
                chai_1.assert.strictEqual(bs['buffer'], 2);
                chai_1.assert.strictEqual(bs['pointer'], 2);
                chai_1.assert.strictEqual(bs['data'], '');
                bs.write(3);
                chai_1.assert.strictEqual(bs['buffer'], 11);
                chai_1.assert.strictEqual(bs['pointer'], 4);
                chai_1.assert.strictEqual(bs['data'], '');
            });
            it('should write encoded data whenever buffer is sufficently full', () => {
                let bs = new BinaryString_1.default();
                bs.write(1);
                bs.write(1);
                bs.write(1);
                bs.write(1);
                bs.write(1);
                chai_1.assert.strictEqual(bs['buffer'], 31);
                chai_1.assert.strictEqual(bs['pointer'], 5);
                chai_1.assert.strictEqual(bs['data'], '');
                bs.write(1);
                chai_1.assert.strictEqual(bs['buffer'], 0);
                chai_1.assert.strictEqual(bs['pointer'], 0);
                chai_1.assert.strictEqual(bs['data'], '/');
                bs.write(64);
                chai_1.assert.strictEqual(bs['buffer'], 0);
                chai_1.assert.strictEqual(bs['pointer'], 1);
                chai_1.assert.strictEqual(bs['data'], '/g');
            });
            it('should write data into a specified width', () => {
                let bs = new BinaryString_1.default();
                bs.write(0, 2);
                chai_1.assert.strictEqual(bs['buffer'], 0);
                chai_1.assert.strictEqual(bs['pointer'], 2);
                chai_1.assert.strictEqual(bs['data'], '');
                bs.write(1, 4);
                chai_1.assert.strictEqual(bs['buffer'], 0);
                chai_1.assert.strictEqual(bs['pointer'], 0);
                chai_1.assert.strictEqual(bs['data'], 'B');
            });
            it('should throw an error if trying to write into too small a width', () => {
                let bs = new BinaryString_1.default();
                chai_1.assert.throws(() => bs.write(2, 1));
            });
        });
        describe('flush', () => {
            it('should empty the buffer, padding remaining contents with 0', () => {
                let bs = new BinaryString_1.default();
                bs.write(2);
                bs.flush();
                chai_1.assert.strictEqual(bs['buffer'], 0);
                chai_1.assert.strictEqual(bs['pointer'], 0);
                chai_1.assert.strictEqual(bs['data'], 'g');
                chai_1.assert.strictEqual(bs.getData(), 'g');
            });
        });
        describe('getData', () => {
            it('should get the data as a base-64 encoded string', () => {
                let bs = new BinaryString_1.default();
                bs.write(1, 6);
                chai_1.assert.strictEqual(bs['buffer'], 0);
                chai_1.assert.strictEqual(bs['pointer'], 0);
                chai_1.assert.strictEqual(bs['data'], 'B');
                chai_1.assert.strictEqual(bs.getData(), 'B');
            });
            it('should flush the buffer when getting data', () => {
                let bs = new BinaryString_1.default();
                bs.write(1, 2);
                chai_1.assert.strictEqual(bs['buffer'], 1);
                chai_1.assert.strictEqual(bs['pointer'], 2);
                chai_1.assert.strictEqual(bs['data'], '');
                chai_1.assert.strictEqual(bs.getData(), 'Q');
                chai_1.assert.strictEqual(bs['data'], 'Q');
            });
        });
    });
});
//# sourceMappingURL=BinaryString.test.js.map