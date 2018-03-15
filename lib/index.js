(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Trie", "./Trie"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Trie_1 = require("./Trie");
    var Trie_2 = require("./Trie");
    exports.Trie = Trie_2.default;
    function createSync(strings) {
        const trie = new Trie_1.default();
        strings.forEach(s => trie.insert(s));
        return trie;
    }
    exports.createSync = createSync;
    function createFrozenSync(words) {
        return createSync(words).freeze();
    }
    exports.createFrozenSync = createFrozenSync;
});
//# sourceMappingURL=index.js.map