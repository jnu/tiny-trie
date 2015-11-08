/* eslint-env mocha */

import {
    // freeze,
    // freezeToJSON,
    createSync,
    createFrozenSync,
    // createFrozenJSONSync,
    // loadFrozen
} from './index';
import Trie from './Trie';
// import FrozenTrie from './FrozenTrie';
import assert from 'assert';


describe('index', function() {

    // describe('freeze', function() {
    //     it('creates a frozen trie from a trie', function() {
    //         let trie = createSync(["foo", "bar", "zap"]);
    //         let frozen = freeze(trie);
    //         assert(frozen instanceof FrozenTrie);
    //     });
    // });

    // describe('freeze', function() {
    //     it('creates frozen trie JSON from a trie', function() {
    //         let trie = createSync(["foo", "bar", "zap"]);
    //         let json = freezeToJSON(trie);
    //         assert.deepEqual(
    //             Object.keys(json).sort(),
    //             ['directory', 'nodeCount', 'trie']
    //         );
    //     });
    // });

    describe('createSync', function() {
        it('creates a valid trie', function() {
            let trie = createSync(["foo", "bar", "zap"]);
            assert(trie instanceof Trie);
            ["foo", "bar", "zap"].forEach(s => assert(trie.test(s)));
        });
    });

    describe('createFrozenSync', function() {
        it('creates a valid frozen trie', function() {
            let frozenTrie = createFrozenSync(["foo", "bar", "zap"]);
            assert(frozenTrie instanceof Trie);
            assert(frozenTrie.frozen);
            assert.throws(() => frozenTrie.insert('bop'));
        });
    });

    // describe('createFrozenJSONSync', function() {
    //     it('creates a valid frozen trie as JSON', function() {
    //         let json = createFrozenJSONSync(["foo", "bar", "zap"]);
    //         assert.deepEqual(
    //             Object.keys(json).sort(),
    //             ['directory', 'nodeCount', 'trie']
    //         );
    //     });
    // });

    // describe('loadFrozen', function() {
    //     it('creates a valid frozen trie from JSON', function() {
    //         let json = createFrozenJSONSync(["foo", "bar", "zap"]);
    //         let frozenTrie = loadFrozen(json);
    //         assert(frozenTrie instanceof FrozenTrie);
    //     });
    // });

});
