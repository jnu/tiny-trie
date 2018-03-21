/* eslint-env mocha */

import {
    createSync,
    createFrozenSync
} from './index';
import {Trie} from './Trie';
import {assert} from 'chai';

describe('index', function() {

    describe('createSync', function() {
        it('creates a valid trie', function() {
            let trie = createSync(['foo', 'bar', 'zap']);
            assert(trie instanceof Trie);
            ['foo', 'bar', 'zap'].forEach(s => assert(trie.test(s)));
        });
    });

    describe('createFrozenSync', function() {
        it('creates a valid frozen trie', function() {
            let frozenTrie = createFrozenSync(['foo', 'bar', 'zap']);
            assert(frozenTrie instanceof Trie);
            assert(frozenTrie.frozen);
            assert.throws(() => frozenTrie.insert('bop'));
        });
    });

});
