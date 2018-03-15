(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Trie", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Trie_1 = require("./Trie");
    const chai_1 = require("chai");
    function flatKeys(trie) {
        const nodes = [];
        const keys = [];
        (function walk(node, i = 0) {
            Object.keys(node).forEach(key => {
                if (key.substr(0, 2) === '__') {
                    return;
                }
                const current = node[key];
                if (!nodes.find(x => x === current)) {
                    nodes.push(current);
                    keys.push(`${key}_${i}`);
                }
                walk(current, i + 1);
            });
        }(trie.root));
        return keys;
    }
    function stringifyNoPrivate(obj) {
        return JSON.stringify(obj, (k, v) => k.substr(0, 2) === '__' ? undefined : v);
    }
    describe('Trie', () => {
        describe('constructor', () => {
            it('creates an empty Trie', () => {
                const trie = new Trie_1.default();
                chai_1.assert(stringifyNoPrivate(trie.root), '{}');
                chai_1.assert(trie.frozen === false);
            });
        });
        describe('insert', () => {
            it('inserts a word into the trie', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                chai_1.assert.strictEqual(stringifyNoPrivate(trie.root), '{"f":{"o":{"o":{"\\u0000":{}}}}}');
            });
            it('does not create redundant prefixes', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('food');
                chai_1.assert.strictEqual(stringifyNoPrivate(trie.root), '{"f":{"o":{"o":{"\\u0000":{},"d":{"\\u0000":{}}}}}}');
            });
            it('throws an error if trie is frozen', () => {
                const trie = new Trie_1.default();
                trie.freeze();
                chai_1.assert.throws(() => trie.insert('foo'));
            });
        });
        describe('test', () => {
            it('recalls strings entered into the trie', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                chai_1.assert(trie.test('foo'));
                trie.insert('bar');
                chai_1.assert(trie.test('foo'));
                chai_1.assert(trie.test('bar'));
                trie.insert('food');
                chai_1.assert(trie.test('food'));
                chai_1.assert(trie.test('foo'));
                chai_1.assert(trie.test('bar'));
            });
            it('returns true for fuzzy matches when wildcard is given', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('bar');
                trie.insert('bop');
                trie.insert('baz');
                chai_1.assert(trie.test('***', { wildcard: '*' }));
                chai_1.assert(trie.test('**r', { wildcard: '*' }));
                chai_1.assert(trie.test('*az', { wildcard: '*' }));
                chai_1.assert(trie.test('f**', { wildcard: '*' }));
                chai_1.assert(trie.test('f*o', { wildcard: '*' }));
                chai_1.assert(!trie.test('**x', { wildcard: '*' }));
            });
            it('returns true for partial matches when searching over prefixes', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('food');
                trie.insert('foodology');
                chai_1.assert(trie.test('fo', { prefix: true }));
                chai_1.assert(trie.test('foodolog', { prefix: true }));
                chai_1.assert(!trie.test('fob', { prefix: true }));
            });
            it('returns correct value for complex options cases', () => {
                const trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('bar');
                trie.insert('foobar');
                chai_1.assert(trie.test('foo', { wildcard: '*' }));
                chai_1.assert(trie.test('bar', { wildcard: '*' }));
                chai_1.assert(!trie.test('foob', { wildcard: '*', prefix: false }));
                chai_1.assert(trie.test('foobar', { wildcard: '*', prefix: false }));
                chai_1.assert(trie.test('foob*', { wildcard: '*', prefix: true }));
                chai_1.assert(!trie.test('foob*', { wildcard: '*', prefix: false }));
                chai_1.assert(trie.test('**ob*', { wildcard: '*', prefix: true }));
            });
        });
        describe('search', () => {
            const strings = ['foo', 'bar', 'bare', 'fool', 'goo', 'far', 'boo', 'gar', 'tool'];
            it('returns all matching values with wildcard', () => {
                const trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                chai_1.assert.deepEqual(trie.search('*oo', { wildcard: '*' }), ['foo', 'boo', 'goo']);
                chai_1.assert.deepEqual(trie.search('*oo', { wildcard: '*', prefix: true }), [
                    'foo', 'boo', 'goo', 'fool', 'tool'
                ]);
                chai_1.assert.deepEqual(trie.search('f**', { wildcard: '*' }), ['foo', 'far']);
                chai_1.assert.deepEqual(trie.search('*x*', { wildcard: '*' }), []);
            });
            it('returns first match with wildcard', () => {
                const trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                chai_1.assert(trie.search('f**', { wildcard: '*', first: true }) === 'foo');
                chai_1.assert(trie.search('**x', { wildcard: '*', first: true }) === null);
                chai_1.assert.deepEqual(trie.search('*', { wildcard: '*', prefix: true }), [
                    'foo', 'far', 'bar', 'boo', 'goo', 'gar', 'fool', 'bare', 'tool',
                ]);
            });
        });
        describe('freeze', () => {
            const strings = ['foo', 'bar', 'bare', 'fool', 'goo', 'far', 'boo', 'gar'];
            const strings2 = ['spit', 'spat', 'spot', 'spits', 'spats', 'spots'];
            it('marks trie as frozen', () => {
                let trie = new Trie_1.default();
                trie.freeze();
                chai_1.assert(trie.frozen === true);
            });
            it('preserves stringification', () => {
                let trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                const expected = `{\
"f":{"o":{"o":{"\\u0000":{},"l":{"\\u0000":{}}}},"a":{"r":{"\\u0000":{}}}},\
"b":{"a":{"r":{"\\u0000":{},"e":{"\\u0000":{}}}},"o":{"o":{"\\u0000":{}}}},\
"g":{"o":{"o":{"\\u0000":{}}},"a":{"r":{"\\u0000":{}}}}\
}`;
                chai_1.assert.strictEqual(stringifyNoPrivate(trie.root), expected);
                trie.freeze();
                chai_1.assert.strictEqual(stringifyNoPrivate(trie.root), expected);
            });
            it('preserves lookup', () => {
                let trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                strings.forEach(s => chai_1.assert(trie.test(s)));
                trie.freeze();
                strings.forEach(s => chai_1.assert(trie.test(s)));
            });
            it('converts internal structure into a DAWG', () => {
                let trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                chai_1.assert(trie.root.b.o !== trie.root.g.o);
                chai_1.assert(trie.root.f.a !== trie.root.g.a);
                chai_1.assert.deepEqual(flatKeys(trie), [
                    'f_0',
                    'o_1',
                    'o_2',
                    '\u0000_3',
                    'l_3',
                    'a_1',
                    'r_2',
                    'b_0',
                    'a_1',
                    'r_2',
                    'e_3',
                    'o_1',
                    'o_2',
                    'g_0',
                    'o_1',
                    'o_2',
                    'a_1',
                    'r_2',
                ]);
                trie.freeze();
                chai_1.assert(trie.root.b.o === trie.root.g.o);
                chai_1.assert(trie.root.f.a === trie.root.g.a);
                chai_1.assert.deepEqual(flatKeys(trie), [
                    'f_0',
                    'o_1',
                    'o_2',
                    '\u0000_3',
                    'l_3',
                    'a_1',
                    'r_2',
                    'b_0',
                    'a_1',
                    'r_2',
                    'e_3',
                    'o_1',
                    'o_2',
                    'g_0',
                ]);
                let trie2 = new Trie_1.default();
                strings2.forEach(s => trie2.insert(s));
                chai_1.assert.deepEqual(flatKeys(trie2), [
                    's_0',
                    'p_1',
                    'i_2',
                    't_3',
                    '\u0000_4',
                    's_4',
                    'a_2',
                    't_3',
                    's_4',
                    'o_2',
                    't_3',
                    's_4',
                ]);
                trie2.freeze();
                chai_1.assert.deepEqual(flatKeys(trie2), [
                    's_0',
                    'p_1',
                    'i_2',
                    't_3',
                    '\u0000_4',
                    's_4',
                    'a_2',
                    'o_2',
                ]);
                chai_1.assert(trie2.root.s.p.a.t === trie2.root.s.p.i.t);
                chai_1.assert(trie2.root.s.p.a.t === trie2.root.s.p.o.t);
            });
            it('has no cycles', () => {
                let trie = new Trie_1.default();
                ['yo', 'yolo'].forEach(s => trie.insert(s));
                trie.freeze();
                chai_1.assert(trie.test('yo'));
                chai_1.assert(trie.test('yolo'));
                chai_1.assert(trie.test('yololo') === false);
                chai_1.assert.strictEqual(stringifyNoPrivate(trie.root), '{"y":{"o":{"\\u0000":{},"l":{"o":{"\\u0000":{}}}}}}');
            });
        });
        describe('clone', () => {
            const strings = ['foo', 'bar', 'boo', 'far', 'spot', 'spat', 'spots', 'spats'];
            it('produces an identical copy of a trie', () => {
                let trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                let clone = trie.clone();
                chai_1.assert.strictEqual(stringifyNoPrivate(clone), stringifyNoPrivate(trie));
            });
            it('produces a deep copy of the old trie', () => {
                let trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('boo');
                let clone = trie.clone();
                clone.insert('fool');
                chai_1.assert(stringifyNoPrivate(clone) !== stringifyNoPrivate(trie));
                chai_1.assert(trie.test('fool') === false);
                chai_1.assert(clone.test('fool'));
            });
            it('preserves lookup', () => {
                let trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                strings.forEach(s => chai_1.assert(trie.test(s)));
                let clone = trie.clone();
                strings.forEach(s => chai_1.assert(clone.test(s)));
            });
            it('thaws frozen tries', () => {
                let trie = new Trie_1.default();
                trie.freeze();
                let clone = trie.clone();
                chai_1.assert.throws(() => trie.insert('foo'));
                clone.insert('foo');
                chai_1.assert(clone.test('foo'));
            });
            it('does not affect ability to refreeze', () => {
                let trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('boo');
                let clone = trie.clone();
                clone.freeze();
                chai_1.assert.deepEqual(flatKeys(clone), [
                    'f_0',
                    'o_1',
                    'o_2',
                    '\u0000_3',
                    'b_0',
                ]);
            });
        });
        describe('toJSON', () => {
            it('presents the root node for serialization', () => {
                let trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('fob');
                chai_1.assert.deepEqual(trie.toJSON(), JSON.parse(stringifyNoPrivate(trie.root)));
                chai_1.assert.strictEqual(stringifyNoPrivate(trie), '{"f":{"o":{"o":{"\\u0000":{}},"b":{"\\u0000":{}}}}}');
            });
            it('can restore a serialized trie with the constructor', () => {
                let strings = ['foo', 'bar', 'zap', 'zoology', 'zoo'];
                let trie = new Trie_1.default();
                strings.forEach(s => trie.insert(s));
                let json = stringifyNoPrivate(trie);
                let trie2 = new Trie_1.default(JSON.parse(json));
                strings.forEach(s => chai_1.assert(trie2.test(s)));
            });
            it('should return a deep clone of the internal structure', () => {
                let trie = new Trie_1.default();
                trie.insert('foo');
                trie.insert('bar');
                let json = trie.toJSON();
                chai_1.assert(json !== trie.root);
                json.b.hello = 'hi!';
                chai_1.assert(trie.root.b.hello === undefined);
            });
        });
    });
});
//# sourceMappingURL=Trie.test.js.map