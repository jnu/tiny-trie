/**
 * String terminal character
 * @type {String}
 */
const TERMINAL = '\0';

/**
 * Terminal edge
 * @type {Object}
 */
const TERMINUS = Object.create(null);


/**
 * A structure to provide efficient lookups for a
 * @class Trie
 */
class Trie {

    /**
     * Typically no arguments are needed.
     * @param  {Object} tree - a trie given as a vanilla JS tree. This will be
     *                         used as the root node.
     * @return {Trie}
     */
    constructor(tree = {}) {
        this.root = tree;
        this.frozen = false;
    }

    /**
     * Insert a word into the trie. Insertions into a frozen trie will throw
     * an error. The
     * @param  {String} string - string to insert. Note the \u0000 character is
     *                           disallowed.
     * @return {Trie} - this
     */
    insert(string) {
        // This trie insert algorithm can't guarantee safe inserts on the DAWG
        // produced by freezing.
        if (this.frozen) {
            throw new SyntaxError("Can't insert into frozen Trie");
        }

        let lastNode = string.split('').reduce((node, char) => {
            if (char === TERMINAL) {
                throw new TypeError(`Illegal string character ${TERMINAL}`);
            }
            let nextNode = node.hasOwnProperty(char) ?
                node[char] :
                (node[char] = {});
            return nextNode;
        }, this.root);

        // Terminate the string. Using a constant terminus is not necessary
        // (and is not be possible in cloned tries), but it uses slightly less
        // memory and could make certain bugs more obvious.
        lastNode[TERMINAL] = TERMINUS;

        return this;
    }

    /**
     * Test membership in the trie
     * @param  {String} string
     * @return {Boolean}
     */
    test(string) {
        let node = this.root;
        let match = string.split('').every(char => node = node[char]);
        return !!match && node.hasOwnProperty(TERMINAL);
    }

    /**
     * Clone a Trie. This will unfreeze a frozen trie.
     * @return {Trie}
     */
    clone() {
        return new Trie(JSON.parse(JSON.stringify(this.root)));
    }

    /**
     * Freeze the Trie, deduping suffixes. Given the assumption that there will
     * not be new entries into a trie, redundant suffix branches can be merged.
     * @return {Trie} - This trie (freezing modifies it in place)
     */
    freeze() {
        // Freezing is idempotent
        if (this.frozen) {
            return this;
        }

        // Create a store for fast lookup of matching suffixes during walk
        let suffixTree = {};

        // Walk the entire trie depth first, de-duping suffixes
        (function walk(node) {
            Object.keys(node).forEach(char => {
                let current = node[char];
                walk(current);

                // Find potential suffix duplicates with a char lookup
                if (suffixTree.hasOwnProperty(char)) {
                    let suffixMeta = suffixTree[char];

                    // Find a matching suffix by comparing children. Since
                    // deduping is depth-first, comparing children by identity
                    // is a valid way to check if this node is a duplicate.
                    let match = suffixMeta.find(other => {
                        let oKeys = Object.keys(other);
                        let cKeys = Object.keys(current);
                        return (
                            oKeys.length === cKeys.length &&
                            oKeys.every(key => other[key] === current[key])
                        );
                    });

                    // If this node is a dupe, update its parent reference to
                    // point to the cached match.
                    if (match) {
                        node[char] = match;
                    }
                    // If the node is novel, cache it for future checks.
                    else {
                        suffixMeta.push(current);
                    }
                }
                // If this char is novel, create a new suffixMeta entry
                else {
                    suffixTree[char] = [current];
                }
            });
        }(this.root));

        // Flag the tree as frozen
        this.frozen = true;

        return this;
    }

    encode() {
        // TODO
        throw new Error("Not implemented");
    }

    /**
     * Implement JSON API for serialization. Tries can be serialized and
     * restored using JSON and the constructor. Note that tries (even frozen
     * ones) *do not serialize efficiently in JSON*. For memory-efficient
     * tries, @see Trie#encode.
     *
     * @example
     *   > trie = new Trie();
     *   > ['foo', 'fudge', 'nudge'].forEach(s => trie.insert(s));
     *   > let jsonStr = JSON.stringify(trie);
     *   > let restored = new Trie(JSON.parse(jsonStr));
     *   > ['foo', 'fudge', 'nudge'].every(s => restored.test(s));
     *   // -> true
     *
     * @return {Object} Vanilla JS object
     */
    toJSON() {
        return JSON.parse(JSON.stringify(this.root));
    }

}

export default Trie;
