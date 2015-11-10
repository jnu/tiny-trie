import {BASE64_CHAR_TO_INT} from './base64';
import {TERMINAL} from './constants';

// TODO
// Rewrite as a native class. Babel adds a ton of overhead. This file should
// be under 1kb.

/**
 * Class for interacting with an encoded trie. The class performs lookups
 * virtually just as fast as a regular trie. The binary data never actually
 * have to be processed as a whole, so instantiation time and memory usage are
 * phenomenally low.
 */
class PackedTrie {

    constructor(trieJson) {
        let [charWidth, pointerWidth] = trieJson.dimensions;

        /**
         * Character table, mapping character to an integer ID
         * @type {Object}
         */
        this.table = trieJson.table.split('').reduce((agg, char, i) => {
            agg[char] = i + 1;
            return agg;
        }, { [TERMINAL]: 0 });

        /**
         * Pointer offset. Add this to every pointer read from every word in
         * the trie to obtain the true value of the pointer. This offset is
         * used to avoid signed integers in the word.
         * @type {Number}
         */
        this.offset = trieJson.offset;

        /**
         * Binary string encoded as Base64 representing Trie
         * @type {String}
         */
        this.data = trieJson.data;

        /**
         * Number of bits in one word
         * @type {Number}
         */
        this.wordWidth = this.charWidth + this.pointerWidth + 1;

        /**
         * Maximum length of a chunk of Base64 characters that's needed to
         * view the word. The exact chunk length needed could be determined
         * dynamically on a case-by-case basis. A more clever strategy might
         * be necessary when pushing the limits of wide chartables and long
         * word lists.
         * @type {Number}
         */
        this.chunkLen = Math.ceil(this.wordWidth / 6) + 1;

        /**
         * Mask for reading the "last block" flag in a word
         * @type {Number}
         */
        this.lastMask = 0x1;

        /**
         * Mask for reading the pointer value from a word
         * @type {Number}
         */
        this.pointerMask = (0x1 << pointerWidth);

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
         * @type {[type]}
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
            chunkLen,
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
                if (!queryCharId) {
                    return false;
                }

                let bits = wordPointer * wordWidth;
                let chunkIdx = ~~(bits / 6);
                let chunkOffset = bits % 6;
                let chunk = 0;

                // Interpret each char as Base64
                // TODO buffering here to prevent overflows
                for (let i = 0; i < chunkLen; i++) {
                    chunk <<= 6;
                    chunk |= BASE64_CHAR_TO_INT[data[i + chunkIdx]];
                }

                // Align the word on the right edge of the chunk
                chunk >>= (6 * chunkLen - wordWidth - chunkOffset);

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
