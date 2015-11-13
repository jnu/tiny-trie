/**
 * @file Small class for querying a binary-encoded Trie
 *
 * TODO - rewrite as a native class. Babel adds a lot of overhead. This class
 * should be tiny and transparent.
 */

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
function readBits(binary, start, len) {
    let startChar = ~~(start / 6);
    let startBitOffset = start % 6;
    let endBit = startBitOffset + len;
    let charLen = Math.ceil(endBit / 6);
    let mask = (0x1 << len) - 1;
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
class PackedTrie {

    /**
     * Instantiate a packed binary trie, parsing its headers to configure the
     * instance for queries.
     * @constructor
     * @param  {String} binary - binary string from {@link Trie#encode}
     * @return {PackedTrie}
     */
    constructor(binary) {
        let ptr = 0;

        // Split binary into header and content by checking first field
        let headerCharCount = readBits(binary, ptr, HEADER_WIDTH_FIELD);
        ptr += HEADER_WIDTH_FIELD;
        let header = binary.substr(0, headerCharCount);

        let version = readBits(binary, ptr, VERSION_FIELD);
        ptr += VERSION_FIELD;

        if (version !== VERSION) {
            throw new Error(`Version mismatch! Binary: ${version}, Reader: ${VERSION}`);
        }

        /**
         * Binary string encoded as Base64 representing Trie
         * @type {String}
         */
        this.data = binary.substr(headerCharCount);

        // compute pointer offset

        let offsetSign = readBits(header, ptr, OFFSET_SIGN_FIELD);
        ptr += OFFSET_SIGN_FIELD;
        let offset = readBits(header, ptr, OFFSET_VAL_FIELD);
        ptr += OFFSET_VAL_FIELD;

        if (offsetSign) {
            offset = -offset;
        }
        /**
         * Pointer offset. Add this to every pointer read from every word in
         * the trie to obtain the true value of the pointer. This offset is
         * used to avoid signed integers in the word.
         * @type {Number}
         */
        this.offset = offset;

        // interpret the field width within each word
        let charWidth = readBits(header, ptr, CHAR_WIDTH_FIELD);
        ptr += CHAR_WIDTH_FIELD;

        let pointerWidth = readBits(header, ptr, POINTER_WIDTH_FIELD);
        ptr += POINTER_WIDTH_FIELD;

        // Interpret the rest of the header as the charTable
        let headerFieldChars = Math.ceil(ptr / 6);
        let charTable = header.substr(headerFieldChars);

        /**
         * Character table, mapping character to an integer ID
         * @type {Object}
         */
        this.table = charTable.split('').reduce((agg, char, i) => {
            agg[char] = i + 1;
            return agg;
        }, { [TERMINAL]: 0 });

        /**
         * Number of bits in one word
         * @type {Number}
         */
        this.wordWidth = charWidth + pointerWidth + 1;

        /**
         * Mask for reading the "last block" flag in a word
         * @type {Number}
         */
        this.lastMask = 0x1;

        /**
         * Mask for reading the pointer value from a word
         * @type {Number}
         */
        this.pointerMask = (0x1 << pointerWidth) - 1;

        /**
         * Offset of pointer field in a word
         * @type {Number}
         */
        this.pointerShift = 1;

        /**
         * Mask for reading the charTable index in a word
         * @type {Number}
         */
        this.charMask = (0x1 << charWidth) - 1;

        /**
         * Offset of charTable index field in a word
         * @type {Number}
         */
        this.charShift = 1 + pointerWidth;
    }

    /**
     * Test whether trie contains the given string.
     * @param  {String} string
     * @return {Boolean}
     */
    test(string) {
        let {
            data,
            offset,
            table,
            wordWidth,
            lastMask,
            pointerShift,
            pointerMask,
            charShift,
            charMask
        } = this;

        let wordPointer = 0;

        // Test every character, with a terminal at the end
        let match = string.split('').concat(TERMINAL).every(char => {
            // TODO is binary search possible within blocks? Not sure if the
            // encoder guarantees ordering, plus there's no indication how long
            // a block is, so it'd require extra overhead for each block.
            while (true) {
                let queryCharId = table[char];

                // Exit immediately if the char was not found in the table,
                // (or if it was the TERMINAL character, which has a code of 0)
                if (queryCharId === undefined) {
                    return false;
                }

                let bits = wordPointer * wordWidth;
                let chunk = readBits(data, bits, wordWidth);

                // Read the character index
                let charIdx = (chunk >> charShift) & charMask;

                // If this character is matched, jump to the pointer given in
                // this node.
                if (charIdx === queryCharId) {
                    let pointer = (chunk >> pointerShift) & pointerMask;
                    wordPointer += offset + pointer;
                    return true;
                }

                // If this wasn't a match, check if this was the last key in
                // the block.
                let last = chunk & lastMask;

                // If this was the last node, the word was not found.
                if (last) {
                    return false;
                }
                // Otherwise increment the pointer to the next sibling key
                else {
                    wordPointer += 1;
                }
            }
        });

        return match;
    }

}

export default PackedTrie;
