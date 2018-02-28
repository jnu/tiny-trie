/* eslint-env mocha */

import Trie from './Trie';
import assert from 'assert';

/**
 * Flatten the trie and output a list of keys representing the unique nodes.
 * This can be used to inspect how nodes have been deduped.
 * @param  {Trie} trie
 * @return {String[]}
 */
function flatKeys(trie) {
    let nodes = [];
    let keys = [];

    (function walk(node, i = 0) {
        Object.keys(node).forEach(key => {
            if (key.substr(0, 2) === '__') {
                return;
            }
            let current = node[key];
            if (!nodes.find(x => x === current)) {
                nodes.push(current);
                keys.push(`${key}_${i}`);
            }
            walk(current, i + 1);
        });
    }(trie.root));

    return keys;
}

/**
 * Stringify an object dropping "private" prefixes, i.e. those that start with
 * the prefix "__".
 * @param  {Object} obj
 * @return {String}
 */
function stringifyNoPrivate(obj) {
    return JSON.stringify(obj, (k, v) =>
        k.substr(0, 2) === '__' ? undefined : v);
}

describe('Trie', () => {

    describe('constructor', () => {
        it('creates an empty Trie', () => {
            let trie = new Trie();
            assert(stringifyNoPrivate(trie.root), '{}');
            assert(trie.frozen === false);
        });
    });

    describe('insert', () => {
        it('inserts a word into the trie', () => {
            let trie = new Trie();
            trie.insert('foo');
            assert.strictEqual(
                stringifyNoPrivate(trie.root),
                '{"f":{"o":{"o":{"\\u0000":{}}}}}'
            );
        });

        it('does not create redundant prefixes', () => {
            let trie = new Trie();
            trie.insert('foo');
            trie.insert('food');
            assert.strictEqual(
                stringifyNoPrivate(trie.root),
                '{"f":{"o":{"o":{"\\u0000":{},"d":{"\\u0000":{}}}}}}'
            );
        });

        it('throws an error if trie is frozen', () => {
            let trie = new Trie();
            trie.freeze();
            assert.throws(() => trie.insert('foo'));
        });
    });

    describe('test', () => {
        it('recalls strings entered into the trie', () => {
            let trie = new Trie();

            trie.insert('foo');
            assert(trie.test('foo'));

            trie.insert('bar');
            assert(trie.test('foo'));
            assert(trie.test('bar'));

            trie.insert('food');
            assert(trie.test('food'));
            assert(trie.test('foo'));
            assert(trie.test('bar'));
        });

        it('returns true for fuzzy matches when wildcard is given', () => {
            const trie = new Trie();
            trie.insert('foo');
            trie.insert('bar');
            trie.insert('bop');
            trie.insert('baz');

            assert(trie.test('***', {wildcard: '*'}));
            assert(trie.test('**r', {wildcard: '*'}));
            assert(trie.test('*az', {wildcard: '*'}));
            assert(trie.test('f**', {wildcard: '*'}));
            assert(trie.test('f*o', {wildcard: '*'}));
            assert(!trie.test('**x', {wildcard: '*'}));
        });

        it('returns true for partial matches when searching over prefixes', () => {
            const trie = new Trie();
            trie.insert('foo');
            trie.insert('food');
            trie.insert('foodology');

            assert(trie.test('fo', {prefix: true}));
            assert(trie.test('foodolog', {prefix: true}));
            assert(!trie.test('fob', {prefix: true}));
        });

        it('returns correct value for complex options cases', () => {
            const trie = new Trie();
            trie.insert('foo');
            trie.insert('bar');
            trie.insert('foobar');

            assert(trie.test('foo', {wildcard: '*'}));
            assert(trie.test('bar', {wildcard: '*'}));
            assert(!trie.test('foob', {wildcard: '*', prefix: false}));
            assert(trie.test('foobar', {wildcard: '*', prefix: false}));
            assert(trie.test('foob*', {wildcard: '*', prefix: true}));
            assert(!trie.test('foob*', {wildcard: '*', prefix: false}));
            assert(trie.test('**ob*', {wildcard: '*', prefix: true}));
        });
    });

    describe('search', () => {
        const strings = ['foo', 'bar', 'bare', 'fool', 'goo', 'far', 'boo', 'gar', 'tool'];

        it('returns all matching values with wildcard', () => {
            const trie = new Trie();
            strings.forEach(s => trie.insert(s));

            assert.deepEqual(trie.search('*oo', {wildcard: '*'}), ['foo', 'boo', 'goo']);
            assert.deepEqual(trie.search('*oo', {wildcard: '*', prefix: true}), [
                'foo', 'boo', 'goo', 'fool', 'tool']);
            assert.deepEqual(trie.search('f**', {wildcard: '*'}), ['foo', 'far']);
            assert.deepEqual(trie.search('*x*', {wildcard: '*'}), []);
        });

        it('returns first match with wildcard', () => {
            const trie = new Trie();
            strings.forEach(s => trie.insert(s));
            assert(trie.search('f**', {wildcard: '*', first: true}) === 'foo');
            assert(trie.search('**x', {wildcard: '*', first: true}) === null);
            assert(trie.search('*', {wildcard: '*', prefix: true}), strings);
        });
    });

    describe('freeze', () => {
        const strings = ['foo', 'bar', 'bare', 'fool', 'goo', 'far', 'boo', 'gar'];
        const strings2 = ['spit', 'spat', 'spot', 'spits', 'spats', 'spots'];

        it('marks trie as frozen', () => {
            let trie = new Trie();
            trie.freeze();
            assert(trie.frozen === true);
        });

        it('preserves stringification', () => {
            let trie = new Trie();
            strings.forEach(s => trie.insert(s));

            const expected = `{\
"f":{"o":{"o":{"\\u0000":{},"l":{"\\u0000":{}}}},"a":{"r":{"\\u0000":{}}}},\
"b":{"a":{"r":{"\\u0000":{},"e":{"\\u0000":{}}}},"o":{"o":{"\\u0000":{}}}},\
"g":{"o":{"o":{"\\u0000":{}}},"a":{"r":{"\\u0000":{}}}}\
}`;
            assert.strictEqual(stringifyNoPrivate(trie.root), expected);

            trie.freeze();

            assert.strictEqual(stringifyNoPrivate(trie.root), expected);
        });

        it('preserves lookup', () => {
            let trie = new Trie();

            strings.forEach(s => trie.insert(s));
            strings.forEach(s => assert(trie.test(s)));

            trie.freeze();

            strings.forEach(s => assert(trie.test(s)));
        });

        it('converts internal structure into a DAWG', () => {
            let trie = new Trie();
            strings.forEach(s => trie.insert(s));
            assert(trie.root.b.o !== trie.root.g.o);
            assert(trie.root.f.a !== trie.root.g.a);
            assert.deepEqual(flatKeys(trie), [
                "f_0",
                "o_1",
                "o_2",
                "\u0000_3",
                "l_3",
                "a_1",
                "r_2",
                "b_0",
                "a_1",
                "r_2",
                "e_3",
                "o_1",
                "o_2",
                "g_0",
                "o_1",
                "o_2",
                "a_1",
                "r_2"
            ]);
            trie.freeze();
            assert(trie.root.b.o === trie.root.g.o);
            assert(trie.root.f.a === trie.root.g.a);
            assert.deepEqual(flatKeys(trie), [
                "f_0",
                "o_1",
                "o_2",
                "\u0000_3",
                "l_3",
                "a_1",
                "r_2",
                "b_0",
                "a_1",
                "r_2",
                "e_3",
                "o_1",
                "o_2",
                "g_0"
            ]);

            let trie2 = new Trie();
            strings2.forEach(s => trie2.insert(s));
            assert.deepEqual(flatKeys(trie2), [
                "s_0",
                "p_1",
                "i_2",
                "t_3",
                "\u0000_4",
                "s_4",
                "a_2",
                "t_3",
                "s_4",
                "o_2",
                "t_3",
                "s_4"
            ]);
            trie2.freeze();
            assert.deepEqual(flatKeys(trie2), [
                "s_0",
                "p_1",
                "i_2",
                "t_3",
                "\u0000_4",
                "s_4",
                "a_2",
                "o_2"
            ]);
            assert(trie2.root.s.p.a.t === trie2.root.s.p.i.t);
            assert(trie2.root.s.p.a.t === trie2.root.s.p.o.t);
        });

        it('has no cycles', () => {
            let trie = new Trie();

            ['yo', 'yolo'].forEach(s => trie.insert(s));

            trie.freeze();

            assert(trie.test('yo'));
            assert(trie.test('yolo'));
            assert(trie.test('yololo') === false);

            assert.strictEqual(
                stringifyNoPrivate(trie.root),
                '{"y":{"o":{"\\u0000":{},"l":{"o":{"\\u0000":{}}}}}}'
            );
        });
    });

    describe('clone', () => {
        const strings = ['foo', 'bar', 'boo', 'far', 'spot', 'spat', 'spots', 'spats'];

        it('produces an identical copy of a trie', () => {
            let trie = new Trie();
            strings.forEach(string => trie.insert(string));

            let clone = trie.clone();

            assert.strictEqual(stringifyNoPrivate(clone), stringifyNoPrivate(trie));
        });

        it('produces a deep copy of the old trie', () => {
            let trie = new Trie();
            trie.insert('foo');
            trie.insert('boo');

            let clone = trie.clone();
            clone.insert('fool');

            assert(stringifyNoPrivate(clone) !== stringifyNoPrivate(trie));
            assert(trie.test('fool') === false);
            assert(clone.test('fool'));
        });

        it('preserves lookup', () => {
            let trie = new Trie();
            strings.forEach(string => trie.insert(string));

            strings.forEach(string => assert(trie.test(string)));

            let clone = trie.clone();

            strings.forEach(string => assert(clone.test(string)));
        });

        it('thaws frozen tries', () => {
            let trie = new Trie();
            trie.freeze();
            let clone = trie.clone();
            assert.throws(() => trie.insert('foo'));
            clone.insert('foo');
            assert(clone.test('foo'));
        });

        it('does not affect ability to refreeze', () => {
            let trie = new Trie();
            trie.insert('foo');
            trie.insert('boo');
            let clone = trie.clone();
            clone.freeze();
            assert.deepEqual(flatKeys(clone), [
                "f_0",
                "o_1",
                "o_2",
                "\u0000_3",
                "b_0"
            ]);
        });
    });

    describe('toJSON', () => {
        it('presents the root node for serialization', () => {
            let trie = new Trie();
            trie.insert('foo');
            trie.insert('fob');
            assert.deepEqual(trie.toJSON(), JSON.parse(stringifyNoPrivate(trie.root)));
            assert.strictEqual(
                stringifyNoPrivate(trie),
                '{"f":{"o":{"o":{"\\u0000":{}},"b":{"\\u0000":{}}}}}'
            );
        });

        it('can restore a serialized trie with the constructor', () => {
            let strings = ['foo', 'bar', 'zap', 'zoology', 'zoo'];
            let trie = new Trie();
            strings.forEach(s => trie.insert(s));
            let json = stringifyNoPrivate(trie);
            let trie2 = new Trie(JSON.parse(json));
            strings.forEach(s => assert(trie2.test(s)));
        });

        it('should return a deep clone of the internal structure', () => {
            let trie = new Trie();
            trie.insert('foo');
            trie.insert('bar');
            let json = trie.toJSON();
            assert(json !== trie.root);
            json.b.hello = "hi!";
            assert(trie.root.b.hello === undefined);
        });
    });

});
