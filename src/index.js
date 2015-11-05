import Trie from './Trie';
import FrozenTrie from './FrozenTrie';

/**
 * Synchronously construct a new Trie out of the given words.
 * @param  {String[]} words
 * @return {Trie}
 */
export function createSync(words) {
    let trie = new Trie();

    words.sort().map(word => trie.insert(word));

    return trie;
}

/**
 * Freeze a Trie
 * @param  {Trie} trie
 * @return {FrozenTrie}
 */
export function freeze(trie) {
    return FrozenTrie.freeze(trie);
}

/**
 * Freeze a Trie and serialize it in one call.
 * @param  {Trie} trie
 * @return {Object}
 */
export function freezeToJSON(trie) {
    return FrozenTrie.freeze(trie).serialize();
}

/**
 * Create a FrozenTrie out of given words
 * @param  {String[]} words
 * @return {FrozenTrie}
 */
export function createFrozenSync(words) {
    return freeze(createSync(words));
}

/**
 * Create a serialized frozen trie from given words
 * @param  {String[]} words
 * @return {Object}
 */
export function createFrozenJSONSync(words) {
    return freezeToJSON(createSync(words));
}

/**
 * Load a frozen trie from JSON
 * @param  {Object} json
 * @return {FrozenTrie}
 */
export function loadFrozen(json) {
    return FrozenTrie.deserialize(json);
}
