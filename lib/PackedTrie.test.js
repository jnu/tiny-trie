/* eslint-env mocha */
import Trie from './Trie';
import PackedTrie from './PackedTrie';
import assert from 'assert';


describe('PackedTrie', () => {

    describe('constructor', () => {
        it('should parse header fields on init', () => {
            let encoded = 'BAAAAABAwIfboarzKTbjds1FDB';
            let trie = new PackedTrie(encoded);

            assert.strictEqual(trie.offset, 1);
            assert.deepEqual(trie.table, {
                '\0': 0,
                f: 1,
                b: 2,
                o: 3,
                a: 4,
                r: 5,
                z: 6
            });
            assert.strictEqual(trie.wordWidth, 6);
            assert.strictEqual(trie.lastMask, parseInt('1', 2));
            assert.strictEqual(trie.pointerMask, parseInt('11', 2));
            assert.strictEqual(trie.pointerShift, 1);
            assert.strictEqual(trie.charMask, parseInt('111', 2));
            assert.strictEqual(trie.charShift, 3);
            assert.strictEqual(trie.data, encoded.substr(16));
        });

        it('should throw a version mismatch error if encoded string differs from reader version', () => {
            let encoded = 'BD/wAABAwIfboarzKTbjds1FDB';
            assert.throws(() => new PackedTrie(encoded));
        });
    });

    describe('test', () => {
        it('should determine whether an item is in the Trie', () => {
            let encoded = 'BAAAAABAwIfboarzKTbjds1FDB';
            let trie = new PackedTrie(encoded);

            ['foo', 'bar', 'baz'].forEach(w => assert(trie.test(w)));
            ['fu', 'boer', 'batz'].forEach(w => assert(!trie.test(w)));
        });

        it('should provide the same answers as a full Trie', () => {
            [
                ['Africa', 'Asia', 'North America', 'South America', 'Europe', 'Antarctica'],
                ['red', 'yellow', 'green', 'aliceblue', 'pink', 'rose'],
                ['agricola', 'agricolae', 'agricolae', 'agricolam', 'agricolā'],
                ['любить', 'люблю', 'любишь', 'любит', 'любим', 'любите', 'любят']
            ].forEach(words => {
                let sdrow = words.slice().map(w => w.split('').reverse().join(''));
                let trie = new Trie();
                words.forEach(w => trie.insert(w));
                words.forEach(w => assert(trie.test(w)));
                sdrow.forEach(s => assert(!trie.test(s)));
                let encoded = trie.freeze().encode();
                let packed = new PackedTrie(encoded);
                words.forEach(w => assert(packed.test(w)));
                sdrow.forEach(s => assert(!packed.test(s)));
            });
        });
    });

});
