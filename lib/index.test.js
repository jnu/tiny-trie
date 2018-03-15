(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./index", "./Trie", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const index_1 = require("./index");
    const Trie_1 = require("./Trie");
    const chai_1 = require("chai");
    describe('index', function () {
        describe('createSync', function () {
            it('creates a valid trie', function () {
                let trie = index_1.createSync(['foo', 'bar', 'zap']);
                chai_1.assert(trie instanceof Trie_1.default);
                ['foo', 'bar', 'zap'].forEach(s => chai_1.assert(trie.test(s)));
            });
        });
        describe('createFrozenSync', function () {
            it('creates a valid frozen trie', function () {
                let frozenTrie = index_1.createFrozenSync(['foo', 'bar', 'zap']);
                chai_1.assert(frozenTrie instanceof Trie_1.default);
                chai_1.assert(frozenTrie.frozen);
                chai_1.assert.throws(() => frozenTrie.insert('bop'));
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map