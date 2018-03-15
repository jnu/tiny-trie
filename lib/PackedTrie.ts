/**
 * @file Small class for querying a binary-encoded Trie
 *
 * TODO - rewrite as a native class. Babel adds a lot of overhead. This class
 * should be tiny and transparent.
 */

import {ITrie, ISearchOpts, ITestOpts} from './BaseTrie';
import {BASE64_CHAR_TO_INT} from './base64';
import {
    TERMINAL,
    VERSION,
    HEADER_WIDTH_FIELD,
    VERSION_FIELD,
    OFFSET_SIGN_FIELD,
    OFFSET_VAL_FIELD,
    CHAR_WIDTH_FIELD,
    POINTER_WIDTH_FIELD
} from './constants';

/**
 * Extract a window of bits from a Base64 encoded sequence
 * @param  {String} binary - base64 encoded sequence
 * @param  {Number} start - first bit to read
 * @param  {Number} len - number of bits to read
 * @return {Number} - bits from string, as number
 */
function readBits(binary: string, start: number, len: number) {
    const startChar = ~~(start / 6);
    const startBitOffset = start % 6;
    const endBit = startBitOffset + len;
    const charLen = Math.ceil(endBit / 6);
    const mask = (0x1 << len) - 1;
    let chunk = 0;

    for (let i = 0; i < charLen; i++) {
        chunk <<= 6;
        chunk |= BASE64_CHAR_TO_INT[binary[startChar + i]];
    }

    let rightPadding = endBit % 6;
    if (rightPadding) {
        chunk >>= (6 - rightPadding);
    }

    return chunk & mask;
}

/**
 * Class for interacting with an encoded trie. The class performs lookups
 * virtually just as fast as a regular trie. The binary data never actually
 * have to be processed as a whole, so instantiation time and memory usage are
 * phenomenally low.
 * @class
 */
class PackedTrie implements ITrie {

    /**
     * Binary string encoded as Base64 representing Trie
     * @type {String}
     */
    public data: string;

    /**
     * Pointer offset. Add this to every pointer read from every word in
     * the trie to obtain the true value of the pointer. This offset is
     * used to avoid signed integers in the word.
     * @type {Number}
     */
    private offset: number;

    /**
     * Character table, mapping character to an integer ID
     * @type {Object}
     */
    private table: {[key: string]: number};

    /**
     * Inverse of character table, mapping integer ID to character.
     * @type {Array}
     */
    private inverseTable: {[key: number]: string};

    /**
     * Number of bits in one word
     * @type {Number}
     */
    private wordWidth: number;

    /**
     * Mask for reading the "last block" flag in a word
     * @type {Number}
     */
    private lastMask = 0x1;

    /**
     * Mask for reading the pointer value from a word
     * @type {Number}
     */
    private pointerMask: number;

    /**
     * Offset of pointer field in a word
     * @type {Number}
     */
    private pointerShift = 1;

    /**
     * Mask for reading the charTable index in a word
     * @type {Number}
     */
    private charMask: number;

    /**
     * Offset of charTable index field in a word
     * @type {Number}
     */
    private charShift: number;

    /**
     * Instantiate a packed binary trie, parsing its headers to configure the
     * instance for queries.
     * @constructor
     * @param  {String} binary - binary string from {@link Trie#encode}
     * @return {PackedTrie}
     */
    constructor(binary: string) {
        let ptr = 0;

        // Split binary into header and content by checking first field
        const headerCharCount = readBits(binary, ptr, HEADER_WIDTH_FIELD);
        ptr += HEADER_WIDTH_FIELD;
        const header = binary.substr(0, headerCharCount);

        const version = readBits(binary, ptr, VERSION_FIELD);
        ptr += VERSION_FIELD;

        if (version !== VERSION) {
            throw new Error(`Version mismatch! Binary: ${version}, Reader: ${VERSION}`);
        }

        // Main trie data
        this.data = binary.substr(headerCharCount);

        // compute pointer offset
        const offsetSign = readBits(header, ptr, OFFSET_SIGN_FIELD);
        ptr += OFFSET_SIGN_FIELD;
        let offset = readBits(header, ptr, OFFSET_VAL_FIELD);
        ptr += OFFSET_VAL_FIELD;

        if (offsetSign) {
            offset = -offset;
        }

        // Pointer offset
        this.offset = offset;

        // interpret the field width within each word
        let charWidth = readBits(header, ptr, CHAR_WIDTH_FIELD);
        ptr += CHAR_WIDTH_FIELD;

        let pointerWidth = readBits(header, ptr, POINTER_WIDTH_FIELD);
        ptr += POINTER_WIDTH_FIELD;

        // Interpret the rest of the header as the charTable
        let headerFieldChars = Math.ceil(ptr / 6);
        let charTable = header.substr(headerFieldChars);

        this.table = charTable.split('').reduce((agg, char, i) => {
            agg[char] = i + 1;
            return agg;
        }, { [TERMINAL]: 0 } as {[key: string]: number});

        // Construct inverse table
        this.inverseTable = [TERMINAL].concat(charTable.split(''));

        // Number of bits in a word
        this.wordWidth = charWidth + pointerWidth + 1;

        // Mask for reading pointer
        this.pointerMask = (0x1 << pointerWidth) - 1;

        // Mask for reading characters
        this.charMask = (0x1 << charWidth) - 1;

        // Offset of charTable
        this.charShift = 1 + pointerWidth;
    }

    /**
     * Test membership in the trie.
     * @param  {String} str - Search query
     * @param  {String?} opts.wildcard - See PackedTrie#search wildcard doc
     * @param  {Boolean?} opts.prefix - See PackedTrie#search prefix doc
     * @return {Boolean}
     */
    test(str: string, {wildcard, prefix}: ITestOpts = {wildcard: null, prefix: false}) {
        // Delegate to #search with early exit. Could write an optimized path,
        // especially for the prefix search case.
        return this.search(str, {wildcard, prefix, first: true}) !== null;
    }

    /**
     * Query for matching words in the trie.
     * @param  {String} str - Search query
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
    search(str: string, {wildcard, prefix, first}: ISearchOpts = {wildcard: null, prefix: false, first: false}) {
        if (wildcard && wildcard.length !== 1) {
            throw new Error(`Wilcard must be a single character; got ${wildcard}`);
        }

        const {
            data,
            offset,
            table,
            inverseTable,
            wordWidth,
            lastMask,
            pointerShift,
            pointerMask,
            charShift,
            charMask
        } = this;

        // List of matches found in the search.
        const matches = [];

        // Search queue.
        const queue = [{pointer: 0, memo: '', depth: 0}];
        const lastDepth = str.length;

        // Do a BFS over nodes for the search query.
        while (queue.length) {
            const node = queue.shift();
            const isLast = node.depth >= lastDepth;
            const token = isLast ? TERMINAL : str[node.depth];
            // Flag for matching anything. Note that the overflow beyond the
            // length of the query in a prefix search behaves as a wildcard.
            const isWild = token === wildcard || (prefix && isLast);
            // We're committed to an O(N) scan over the entire node even in
            // the simple literal-search case, since our structure doesn't
            // currently guarantee any child ordering.
            // TODO(joen) ordering is a potential future format optimization.
            let wordPointer = node.pointer;
            while (true) {
                // Optimization: Exit immediately if the char was not found in
                // the table (meaning there can't be any children in the trie
                // with this character). Exception is wildcards.
                if (!isWild && !table.hasOwnProperty(token)) {
                    break;
                }

                const bits = wordPointer * wordWidth;
                const chunk = readBits(data, bits, wordWidth);

                // Read the character index
                const charIdx = (chunk >> charShift) & charMask;

                // If this character is matched, jump to the pointer given in
                // this node.
                if (isWild || charIdx === table[token]) {
                    const pointer = (chunk >> pointerShift) & pointerMask;
                    // Find the next char with an inverse map, since we might
                    // be using a wildcard search.
                    const newChar = inverseTable[charIdx];
                    // Stopping condition: searching last block and we hit a terminal
                    if (isLast && newChar === TERMINAL) {
                        // Optimization: early exit if we only need first match.
                        if (first) {
                            return node.memo;
                        }
                        // Store this match.
                        matches.push(node.memo);
                        // If we're not matching everything, break out of the
                        // inner loop.
                        if (!isWild) {
                            break;
                        }
                    }

                    // Push next node for search, if it's non-terminal.
                    if (newChar !== TERMINAL) {
                        queue.push({
                            pointer: wordPointer + offset + pointer,
                            depth: node.depth + 1,
                            memo: node.memo + newChar,
                        });
                    }
                }

                // If this wasn't a match, check if this was the last key in
                // the block.
                const last = chunk & lastMask;

                // If this was the last node, the word was not found.
                if (last) {
                    break;
                }
                // Otherwise increment the pointer to the next sibling key
                else {
                    wordPointer += 1;
                }
            }
        }

        // If first was requested it should have returned by now. Otherwise
        // return the matches list, which may be empty.
        return first ? null : matches;
    }

}

export default PackedTrie;
