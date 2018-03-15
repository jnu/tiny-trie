(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Trie", "./PackedTrie", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Trie_1 = require("./Trie");
    const PackedTrie_1 = require("./PackedTrie");
    const chai_1 = require("chai");
    describe('PackedTrie', () => {
        describe('constructor', () => {
            it('should parse header fields on init', () => {
                const encoded = 'BAAAAABAwIfboarzKTbjds1FDB';
                const trie = new PackedTrie_1.default(encoded);
                chai_1.assert.strictEqual(trie['offset'], 1);
                chai_1.assert.deepEqual(trie['table'], {
                    '\0': 0,
                    f: 1,
                    b: 2,
                    o: 3,
                    a: 4,
                    r: 5,
                    z: 6
                });
                chai_1.assert.strictEqual(trie['wordWidth'], 6);
                chai_1.assert.strictEqual(trie['lastMask'], parseInt('1', 2));
                chai_1.assert.strictEqual(trie['pointerMask'], parseInt('11', 2));
                chai_1.assert.strictEqual(trie['pointerShift'], 1);
                chai_1.assert.strictEqual(trie['charMask'], parseInt('111', 2));
                chai_1.assert.strictEqual(trie['charShift'], 3);
                chai_1.assert.strictEqual(trie['data'], encoded.substr(16));
            });
            it('should throw a version mismatch error if encoded string differs from reader version', () => {
                const encoded = 'BD/wAABAwIfboarzKTbjds1FDB';
                chai_1.assert.throws(() => new PackedTrie_1.default(encoded));
            });
        });
        describe('test', () => {
            it('should determine whether an item is in the Trie', () => {
                const encoded = 'BAAAAABAwIfboarzKTbjds1FDB';
                const trie = new PackedTrie_1.default(encoded);
                ['foo', 'bar', 'baz'].forEach(w => chai_1.assert(trie.test(w)));
                ['fu', 'boer', 'batz'].forEach(w => chai_1.assert(!trie.test(w)));
            });
            it('should provide the same answers as a full Trie', () => {
                [
                    ['Africa', 'Asia', 'North America', 'South America', 'Europe', 'Antarctica'],
                    ['red', 'yellow', 'green', 'aliceblue', 'pink', 'rose'],
                    ['agricola', 'agricolae', 'agricolae', 'agricolam', 'agricolā'],
                    ['любить', 'люблю', 'любишь', 'любит', 'любим', 'любите', 'любят']
                ].forEach(words => {
                    const sdrow = words.slice().map(w => w.split('').reverse().join(''));
                    const trie = new Trie_1.default();
                    words.forEach(w => trie.insert(w));
                    words.forEach(w => chai_1.assert(trie.test(w)));
                    sdrow.forEach(s => chai_1.assert(!trie.test(s)));
                    const encoded = trie.freeze().encode();
                    const packed = new PackedTrie_1.default(encoded);
                    words.forEach(w => chai_1.assert(packed.test(w)));
                    sdrow.forEach(s => chai_1.assert(!packed.test(s)));
                });
            });
            it('returns true for fuzzy matches when wildcard is given', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('bar');
                trie.insert('bop');
                trie.insert('baz');
                const packed = new PackedTrie_1.default(trie.freeze().encode());
                chai_1.assert(packed.test('***', { wildcard: '*' }));
                chai_1.assert(packed.test('**r', { wildcard: '*' }));
                chai_1.assert(packed.test('*az', { wildcard: '*' }));
                chai_1.assert(packed.test('f**', { wildcard: '*' }));
                chai_1.assert(packed.test('f*o', { wildcard: '*' }));
                chai_1.assert(!packed.test('**x', { wildcard: '*' }));
            });
            it('returns true for partial matches when searching over prefixes', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('food');
                trie.insert('foodology');
                const packed = new PackedTrie_1.default(trie.freeze().encode());
                chai_1.assert(packed.test('fo', { prefix: true }));
                chai_1.assert(packed.test('foodolog', { prefix: true }));
                chai_1.assert(!packed.test('fob', { prefix: true }));
            });
            it('returns correct value for complex options cases', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('bar');
                trie.insert('foobar');
                const packed = new PackedTrie_1.default(trie.freeze().encode());
                chai_1.assert(packed.test('foo', { wildcard: '*' }));
                chai_1.assert(packed.test('bar', { wildcard: '*' }));
                chai_1.assert(!packed.test('foob', { wildcard: '*', prefix: false }));
                chai_1.assert(packed.test('foobar', { wildcard: '*', prefix: false }));
                chai_1.assert(packed.test('foob*', { wildcard: '*', prefix: true }));
                chai_1.assert(!packed.test('foob*', { wildcard: '*', prefix: false }));
                chai_1.assert(packed.test('**ob*', { wildcard: '*', prefix: true }));
            });
        });
        describe('search', () => {
            const encoded = 'BMAAAAABAQfbgtoarleFBKNiPVzXZyxVzPV6vfbxWqzeazC0VCYQloNBYJg4BAIB';
            const trie = new PackedTrie_1.default(encoded);
            it('returns all matching values with wildcard', () => {
                chai_1.assert.deepEqual(trie.search('*oo', { wildcard: '*' }), ['foo', 'boo', 'goo']);
                chai_1.assert.deepEqual(trie.search('*oo', { wildcard: '*', prefix: true }), [
                    'foo', 'boo', 'goo', 'fool', 'tool'
                ]);
                chai_1.assert.deepEqual(trie.search('f**', { wildcard: '*' }), ['foo', 'far']);
                chai_1.assert.deepEqual(trie.search('*x*', { wildcard: '*' }), []);
            });
            it('returns first match with wildcard', () => {
                chai_1.assert(trie.search('f**', { wildcard: '*', first: true }) === 'foo');
                chai_1.assert(trie.search('**x', { wildcard: '*', first: true }) === null);
                chai_1.assert.deepEqual(trie.search('*', { wildcard: '*', prefix: true }), [
                    'foo', 'far', 'bar', 'boo', 'goo', 'gar', 'fool', 'bare', 'tool'
                ]);
            });
        });
    });
});
//# sourceMappingURL=PackedTrie.test.js.map