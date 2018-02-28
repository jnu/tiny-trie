/**
 * @file Provides the Trie class
 */

import floor_log2 from './floor_log2';
import BinaryString from './BinaryString';
import {
    TERMINAL,
    TERMINUS,
    VERSION,
    HEADER_WIDTH_FIELD,
    VERSION_FIELD,
    OFFSET_SIGN_FIELD,
    OFFSET_VAL_FIELD,
    CHAR_WIDTH_FIELD,
    POINTER_WIDTH_FIELD
} from './constants';


/**
 * A structure to provide efficient membership tests for a set of strings
 * @class
 */
class Trie {

    /**
     * Typically no arguments are needed, but it's possible to instantiate a
     * Trie from a JSON object that represents it (@see Trie#toJSON).
     * @constructor
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
     * Test membership in the trie.
     * @param  {String} string - Search query
     * @param  {String?} opts.wildcard - See #search wildcard doc
     * @param  {Boolean?} opts.prefix - See #search prefix doc
     * @return {Boolean}
     */
    test(string, {wildcard, prefix} = {wildcard: null, prefix: false}) {
        // When there are no wildcards we can use an optimized search.
        if (!wildcard) {
            let node = this.root;
            const match = string.split('').every(char => node = node[char]);
            return !!match && (prefix || node.hasOwnProperty(TERMINAL));
        }

        // Unoptimized path: delegate to #search with short-circuiting.
        return !!this.search(string, {wildcard, prefix, first: true});
    }

    /**
     * Query for matching words in the trie.
     * @param  {String} string - Search query
     * @param  {String?} opts.wildcard - Wildcard to use for fuzzy matching.
     *                                   Default is no wildcard; only match
     *                                   literal query.
     * @param  {Boolean?} opts.prefix - Perform prefix search (returns true if
     *                                  any word exists in the trie starts with
     *                                  the search query). Default is false;
     *                                  only match the full query.
     * @param  {Boolean} opts.first - Return only first match that is found,
     *                                short-circuiting the search. Default is
     *                                false; return all matches.
     * @return {String?|String[]} - Return an optional string result when in
     *                              first-only mode; otherwise return a list
     *                              of strings that match the query.
     */
    search(string, {wildcard, prefix, first} = {wildcard: null, prefix: false, first: false}) {
        // Validate wildcard matching.
        if (wildcard && wildcard.length !== 1) {
            throw new Error(`Wildcard length must be 1; got ${wildcard.length}`);
        }

        // List of search hits. Note: not used in `first` mode.
        const matches = [];

        // Do a BFS over nodes to with fuzzy-matching on the wildcard.
        const queue = [{data: this.root, depth: 0, memo: ''}];
        const lastDepth = string.length;

        while (queue.length) {
            const node = queue.shift();
            // The search is a hit if we've reached the proper depth and the
            // node is terminal. The search can break if the query was for
            // first-only.
            if (node.depth >= lastDepth) {
                if (node.data.hasOwnProperty(TERMINAL)) {
                    if (first) {
                        return node.memo;
                    }
                    // Otherwise store this result and continue searching.
                    matches.push(node.memo);
                }
                // Discard the node and move on if we can; prefix matches need
                // to traverse everything.
                if (!prefix) {
                    continue;
                }
            }
            // Special case: prefix searches overflow the length of the search
            // queries. Treat these overflowing chars as wildcards.
            const isPfXOverflow = prefix && node.depth >= lastDepth;
            // Add any candidate children nodes to the search queue.
            const token = string[node.depth];
            // Wildcard could be any child (except terminal).
            if (token === wildcard || isPfXOverflow) {
                Object.keys(node.data).forEach(n => {
                    if (n !== TERMINAL) {
                        queue.push({
                            data: node.data[n],
                            depth: node.depth + 1,
                            memo: node.memo + n,
                        });
                    }
                });
            } else {
                if (node.data.hasOwnProperty(token)) {
                    queue.push({
                        data: node.data[token],
                        depth: node.depth + 1,
                        memo: node.memo + token,
                    });
                }
            }
        }

        // A `first` search will have broken out and returned a literal by now;
        // other searches just return whatever is in matches.
        return first ? null : matches;
    }

    /**
     * Clone a Trie. This will unfreeze a frozen trie.
     * @return {Trie}
     */
    clone() {
        return new Trie(this.toJSON());
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


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Encode trie
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Encode header
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        let headerString = new BinaryString();
        let outputCharTable = charTableAsArray.join('');

        // Header width designates the ASCII-character count at the beginning
        // of the file that encodes the header.
        let headerWidth = Math.ceil((
            HEADER_WIDTH_FIELD +
            VERSION_FIELD +
            OFFSET_SIGN_FIELD +
            OFFSET_VAL_FIELD +
            CHAR_WIDTH_FIELD +
            POINTER_WIDTH_FIELD
        ) / 6) + outputCharTable.length;
        // Mark the offset as positive or negative
        let offsetSign = +(offsetMin < 0);

        headerString.write(headerWidth, HEADER_WIDTH_FIELD);
        headerString.write(VERSION, VERSION_FIELD);
        headerString.write(offsetSign, OFFSET_SIGN_FIELD);
        headerString.write(offsetSign ? -offsetMin : offsetMin, OFFSET_VAL_FIELD);
        headerString.write(charEncodingWidth, CHAR_WIDTH_FIELD);
        headerString.write(pointerEncodingWidth, POINTER_WIDTH_FIELD);
        headerString.flush();

        // Concat the header, charTable, and trie
        return `${headerString.getData()}${outputCharTable}${encodedTrie.getData()}`;
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
        // Remove any private fields on serialization, e.g. __visited__
        let str = JSON.stringify(this.root, (k, v) => {
             if (k[1] === '_') {
                return undefined;
            }
            return v;
        });
        return JSON.parse(str);
    }

}

export default Trie;
