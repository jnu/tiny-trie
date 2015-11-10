import Trie from './Trie';
export {default as Trie} from './Trie';


/**
 * Synchronously construct a new Trie out of the given strings.
 * @param  {String[]} words
 * @return {Trie}
 */
export function createSync(strings) {
    let trie = new Trie();

    strings.forEach(s => trie.insert(s));

    return trie;
}

/**
 * Create a frozen Trie out of given words
 * @param  {String[]} words
 * @return {Trie}
 */
export function createFrozenSync(string) {
    return createSync(string).freeze();
}
