"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Trie_1 = require("./Trie");
var Trie_2 = require("./Trie");
exports.Trie = Trie_2.Trie;
function createSync(strings) {
    const trie = new Trie_1.Trie();
    strings.forEach(s => trie.insert(s));
    return trie;
}
exports.createSync = createSync;
function createFrozenSync(words) {
    return createSync(words).freeze();
}
exports.createFrozenSync = createFrozenSync;
//# sourceMappingURL=index.js.map