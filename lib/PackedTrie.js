(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./base64", "./constants"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const base64_1 = require("./base64");
    const constants_1 = require("./constants");
    function readBits(binary, start, len) {
        const startChar = ~~(start / 6);
        const startBitOffset = start % 6;
        const endBit = startBitOffset + len;
        const charLen = Math.ceil(endBit / 6);
        const mask = (0x1 << len) - 1;
        let chunk = 0;
        for (let i = 0; i < charLen; i++) {
            chunk <<= 6;
            chunk |= base64_1.BASE64_CHAR_TO_INT[binary[startChar + i]];
        }
        let rightPadding = endBit % 6;
        if (rightPadding) {
            chunk >>= (6 - rightPadding);
        }
        return chunk & mask;
    }
    class PackedTrie {
        constructor(binary) {
            this.lastMask = 0x1;
            this.pointerShift = 1;
            let ptr = 0;
            const headerCharCount = readBits(binary, ptr, constants_1.HEADER_WIDTH_FIELD);
            ptr += constants_1.HEADER_WIDTH_FIELD;
            const header = binary.substr(0, headerCharCount);
            const version = readBits(binary, ptr, constants_1.VERSION_FIELD);
            ptr += constants_1.VERSION_FIELD;
            if (version !== constants_1.VERSION) {
                throw new Error(`Version mismatch! Binary: ${version}, Reader: ${constants_1.VERSION}`);
            }
            this.data = binary.substr(headerCharCount);
            const offsetSign = readBits(header, ptr, constants_1.OFFSET_SIGN_FIELD);
            ptr += constants_1.OFFSET_SIGN_FIELD;
            let offset = readBits(header, ptr, constants_1.OFFSET_VAL_FIELD);
            ptr += constants_1.OFFSET_VAL_FIELD;
            if (offsetSign) {
                offset = -offset;
            }
            this.offset = offset;
            let charWidth = readBits(header, ptr, constants_1.CHAR_WIDTH_FIELD);
            ptr += constants_1.CHAR_WIDTH_FIELD;
            let pointerWidth = readBits(header, ptr, constants_1.POINTER_WIDTH_FIELD);
            ptr += constants_1.POINTER_WIDTH_FIELD;
            let headerFieldChars = Math.ceil(ptr / 6);
            let charTable = header.substr(headerFieldChars);
            this.table = charTable.split('').reduce((agg, char, i) => {
                agg[char] = i + 1;
                return agg;
            }, { [constants_1.TERMINAL]: 0 });
            this.inverseTable = [constants_1.TERMINAL].concat(charTable.split(''));
            this.wordWidth = charWidth + pointerWidth + 1;
            this.pointerMask = (0x1 << pointerWidth) - 1;
            this.charMask = (0x1 << charWidth) - 1;
            this.charShift = 1 + pointerWidth;
        }
        test(str, { wildcard, prefix } = { wildcard: null, prefix: false }) {
            return this.search(str, { wildcard, prefix, first: true }) !== null;
        }
        search(str, { wildcard, prefix, first } = { wildcard: null, prefix: false, first: false }) {
            if (wildcard && wildcard.length !== 1) {
                throw new Error(`Wilcard must be a single character; got ${wildcard}`);
            }
            const { data, offset, table, inverseTable, wordWidth, lastMask, pointerShift, pointerMask, charShift, charMask } = this;
            const matches = [];
            const queue = [{ pointer: 0, memo: '', depth: 0 }];
            const lastDepth = str.length;
            while (queue.length) {
                const node = queue.shift();
                const isLast = node.depth >= lastDepth;
                const token = isLast ? constants_1.TERMINAL : str[node.depth];
                const isWild = token === wildcard || (prefix && isLast);
                let wordPointer = node.pointer;
                while (true) {
                    if (!isWild && !table.hasOwnProperty(token)) {
                        break;
                    }
                    const bits = wordPointer * wordWidth;
                    const chunk = readBits(data, bits, wordWidth);
                    const charIdx = (chunk >> charShift) & charMask;
                    if (isWild || charIdx === table[token]) {
                        const pointer = (chunk >> pointerShift) & pointerMask;
                        const newChar = inverseTable[charIdx];
                        if (isLast && newChar === constants_1.TERMINAL) {
                            if (first) {
                                return node.memo;
                            }
                            matches.push(node.memo);
                            if (!isWild) {
                                break;
                            }
                        }
                        if (newChar !== constants_1.TERMINAL) {
                            queue.push({
                                pointer: wordPointer + offset + pointer,
                                depth: node.depth + 1,
                                memo: node.memo + newChar,
                            });
                        }
                    }
                    const last = chunk & lastMask;
                    if (last) {
                        break;
                    }
                    else {
                        wordPointer += 1;
                    }
                }
            }
            return first ? null : matches;
        }
    }
    exports.default = PackedTrie;
});
//# sourceMappingURL=PackedTrie.js.map