import floor_log2 from './floor_log2';
import BinaryString from './BinaryString';
import {TERMINAL, TERMINUS} from './constants';


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
        let node = this.root;
        let stack = [];
        let depthStack = [node];

        // Iterate over tree nodes, pushing children onto the depthStack so
        // that the items pushed on to the main `stack` are in the correct
        // order for a second traversal.
        while (depthStack.length) {
            node = depthStack.pop();

            Object.keys(node).forEach(char => {
                if (char[1] === '_') {
                    return;
                }
                let current = node[char];
                stack.push({
                    current: current,
                    char: char,
                    parent: node
                });
                depthStack.push(current);
            });
        }

        // Now do node processing, joining / deduping suffix lines.
        while (stack.length) {
            let { char, parent, current } = stack.pop();

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
                    parent[char] = match;
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
        }

        // Flag the tree as frozen
        this.frozen = true;

        return this;
    }

    /**
     * Encode the Trie in a binary format. This format stores the trie or DAWG
     * efficiently and still allows for fast queries.
     * @return {Object}
     */
    encode() {
        let chunks = [];
        let queue = [this.root];
        let charTable = new Set();
        let visitCode = Date.now();
        let offsetMin = Infinity;
        let offsetMax = -Infinity;

        while (queue.length) {
            let node = queue.shift();
            let keys = Object.keys(node).filter(k => k[1] !== '_');
            let n = keys.length;

            node.__visited__ = visitCode;
            let nodeChunkIndex = node.__idx__ = chunks.length;

            // Fill in the parent chunks that are waiting to find out what
            // index this chunk gets assigned
            if (node.__parents__) {
                node.__parents__.forEach(chunk => {
                    let offset = chunk.offset = nodeChunkIndex - chunk.idx;
                    if (offset < offsetMin) {
                        offsetMin = offset;
                    }
                    if (offset > offsetMax) {
                        offsetMax = offset;
                    }
                });
            }

            keys.forEach((char, i) => {
                let child = node[char];
                let chunkIdx = chunks.length;
                let lastInLevel = i === n - 1;

                let newChunk = {
                    char: char,
                    idx: chunkIdx,
                    offset: null,
                    last: lastInLevel
                };

                // If the child has been visited, jump directly to that node
                // instead of creating a new entry.
                if (child.__visited__ === visitCode) {
                    let idx = child.__idx__;
                    let offset = newChunk.offset = idx - chunkIdx;
                    if (offset < offsetMin) {
                        offsetMin = offset;
                    }
                    if (offset > offsetMax) {
                        offsetMax = offset;
                    }
                }
                // If child is novel, add it to the process queue and add an
                // instruction to jump there.
                else {
                    if (child.__willVisit__ === visitCode) {
                        child.__parents__.push(newChunk);
                    } else {
                        child.__willVisit__ = visitCode;
                        child.__parents__ = [newChunk];
                    }
                    queue.push(child);
                }

                // Add a new chunk to the array
                chunks.push(newChunk);

                // Ensure that the char is in the chartable
                charTable.add(char);
            });
        }

        // Assign a unique integer ID to each character. The actual ID is
        // arbitrary. For the convenience of not having to serialize the \0
        // character, the TERMINAL is always encoded at the 0 index, and it is
        // not included in the charTable.
        let charTableAsArray = Array.from(charTable)
            .filter(char => char !== TERMINAL);
        let charMap = charTableAsArray.reduce((agg, char, i) => {
            agg[char] = i + 1;
            return agg;
        }, { [TERMINAL]: 0 });
        // Determine the number of bits that can index the entire charTable.
        let charEncodingWidth = floor_log2(charTableAsArray.length) + 1;

        let pointerRange = offsetMax - offsetMin;
        let pointerEncodingWidth = floor_log2(pointerRange) + 1;

        // The binary with of node encodings is variable. There are three parts
        // that get encoded:
        //
        //  1) character index (corresponding to character table),
        //  2) pointer (as offset from start of word to next node),
        //  3) last (flag to indicate whether this is the last block in this
        //     subtree)
        //
        // The width of the first two items are determined as the binary width
        // of the unsigned integer representing the maximum in the range. The
        // width of the third is a constant 1 binary digit.
        //
        // E.g., if the charTable is 28 characters in length, then the binary
        // digit representing 27 (the last item in the array) is:
        //
        //   1 1011
        //
        // So the width is determined to be 5. If the pointer range has a
        // maximum of 250, represented in binary as:
        //
        //   1111 1010
        //
        // Giving a width of 8. With these specifications, a node such as:
        //
        //   charIndex: 8, pointer: 100, last: false
        //
        // Would be encoded as:
        //
        //   --A---|----B-----|C|XXXXX
        //   0100 0|011 0010 0|1|00 00
        //
        // Which can be represented in Base64 as:
        //
        //   QyQ==
        //
        // TODO could be more clever and combine the first two fields.

        let encodedTrie = new BinaryString();

        chunks.forEach(chunk => {
            let { char, offset, last } = chunk;
            encodedTrie.write(charMap[char], charEncodingWidth);
            encodedTrie.write(offset - offsetMin, pointerEncodingWidth);
            encodedTrie.write(+last, 1);
        });

        encodedTrie.flush();

        return {
            table: charTableAsArray.join(''),
            offset: offsetMin,
            dimensions: [charEncodingWidth, pointerEncodingWidth],
            data: encodedTrie.getData()
        };
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
