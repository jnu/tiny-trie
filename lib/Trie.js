"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const floor_log2_1 = require("./floor_log2");
const BinaryString_1 = require("./BinaryString");
const constants_1 = require("./constants");
class Trie {
    constructor(tree = {}) {
        this.root = tree;
        this.frozen = false;
    }
    insert(str) {
        if (this.frozen) {
            throw new SyntaxError(`Can't insert into frozen Trie`);
        }
        const lastNode = str.split('').reduce((node, char) => {
            if (char === constants_1.TERMINAL) {
                throw new TypeError(`Illegal string character ${constants_1.TERMINAL}`);
            }
            let nextNode = node.hasOwnProperty(char) ?
                node[char] :
                (node[char] = {});
            return nextNode;
        }, this.root);
        lastNode[constants_1.TERMINAL] = constants_1.TERMINUS;
        return this;
    }
    test(str, { wildcard, prefix } = { wildcard: null, prefix: false }) {
        if (!wildcard) {
            let node = this.root;
            const match = str.split('').every(char => !!(node = node[char]));
            return !!match && (prefix || node.hasOwnProperty(constants_1.TERMINAL));
        }
        return !!this.search(str, { wildcard, prefix, first: true });
    }
    search(str, { wildcard, prefix, first } = { wildcard: null, prefix: false, first: false }) {
        if (wildcard && wildcard.length !== 1) {
            throw new Error(`Wildcard length must be 1; got ${wildcard.length}`);
        }
        const matches = [];
        const queue = [{ data: this.root, depth: 0, memo: '' }];
        const lastDepth = str.length;
        while (queue.length) {
            const node = queue.shift();
            if (node.depth >= lastDepth) {
                if (node.data.hasOwnProperty(constants_1.TERMINAL)) {
                    if (first) {
                        return node.memo;
                    }
                    matches.push(node.memo);
                }
                if (!prefix) {
                    continue;
                }
            }
            const isPfXOverflow = prefix && node.depth >= lastDepth;
            const token = str[node.depth];
            if (token === wildcard || isPfXOverflow) {
                Object.keys(node.data).forEach(n => {
                    if (n !== constants_1.TERMINAL) {
                        queue.push({
                            data: node.data[n],
                            depth: node.depth + 1,
                            memo: node.memo + n,
                        });
                    }
                });
            }
            else {
                if (node.data.hasOwnProperty(token)) {
                    queue.push({
                        data: node.data[token],
                        depth: node.depth + 1,
                        memo: node.memo + token,
                    });
                }
            }
        }
        return first ? null : matches;
    }
    clone() {
        return new Trie(this.toJSON());
    }
    freeze() {
        if (this.frozen) {
            return this;
        }
        const suffixTree = {};
        let node = this.root;
        let stack = [];
        let depthStack = [node];
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
        while (stack.length) {
            let { char, parent, current } = stack.pop();
            if (suffixTree.hasOwnProperty(char)) {
                let suffixMeta = suffixTree[char];
                let match = suffixMeta.find(other => {
                    let oKeys = Object.keys(other);
                    let cKeys = Object.keys(current);
                    return (oKeys.length === cKeys.length &&
                        oKeys.every(key => other[key] === current[key]));
                });
                if (match) {
                    parent[char] = match;
                }
                else {
                    suffixMeta.push(current);
                }
            }
            else {
                suffixTree[char] = [current];
            }
        }
        this.frozen = true;
        return this;
    }
    encode() {
        const chunks = [];
        const queue = [this.root];
        const charTable = new Set();
        const visitCode = Date.now();
        let offsetMin = Infinity;
        let offsetMax = -Infinity;
        while (queue.length) {
            let node = queue.shift();
            let keys = Object.keys(node).filter(k => k[1] !== '_');
            let n = keys.length;
            node.__visited__ = visitCode;
            let nodeChunkIndex = node.__idx__ = chunks.length;
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
                else {
                    if (child.__willVisit__ === visitCode) {
                        child.__parents__.push(newChunk);
                    }
                    else {
                        child.__willVisit__ = visitCode;
                        child.__parents__ = [newChunk];
                    }
                    queue.push(child);
                }
                chunks.push(newChunk);
                charTable.add(char);
            });
        }
        const charTableAsArray = Array.from(charTable)
            .filter(char => char !== constants_1.TERMINAL);
        const charMap = charTableAsArray.reduce((agg, char, i) => {
            agg[char] = i + 1;
            return agg;
        }, { [constants_1.TERMINAL]: 0 });
        const charEncodingWidth = floor_log2_1.floor_log2(charTableAsArray.length) + 1;
        const pointerRange = offsetMax - offsetMin;
        const pointerEncodingWidth = floor_log2_1.floor_log2(pointerRange) + 1;
        const encodedTrie = new BinaryString_1.BinaryString();
        chunks.forEach(chunk => {
            let { char, offset, last } = chunk;
            encodedTrie.write(charMap[char], charEncodingWidth);
            encodedTrie.write(offset - offsetMin, pointerEncodingWidth);
            encodedTrie.write(+last, 1);
        });
        encodedTrie.flush();
        const headerString = new BinaryString_1.BinaryString();
        const outputCharTable = charTableAsArray.join('');
        const headerWidth = Math.ceil((constants_1.HEADER_WIDTH_FIELD +
            constants_1.VERSION_FIELD +
            constants_1.OFFSET_SIGN_FIELD +
            constants_1.OFFSET_VAL_FIELD +
            constants_1.CHAR_WIDTH_FIELD +
            constants_1.POINTER_WIDTH_FIELD) / 6) + outputCharTable.length;
        const offsetSign = +(offsetMin < 0);
        headerString.write(headerWidth, constants_1.HEADER_WIDTH_FIELD);
        headerString.write(constants_1.VERSION, constants_1.VERSION_FIELD);
        headerString.write(offsetSign, constants_1.OFFSET_SIGN_FIELD);
        headerString.write(offsetSign ? -offsetMin : offsetMin, constants_1.OFFSET_VAL_FIELD);
        headerString.write(charEncodingWidth, constants_1.CHAR_WIDTH_FIELD);
        headerString.write(pointerEncodingWidth, constants_1.POINTER_WIDTH_FIELD);
        headerString.flush();
        return `${headerString.getData()}${outputCharTable}${encodedTrie.getData()}`;
    }
    toJSON() {
        let str = JSON.stringify(this.root, (k, v) => {
            if (k[1] === '_') {
                return undefined;
            }
            return v;
        });
        return JSON.parse(str);
    }
}
exports.Trie = Trie;
//# sourceMappingURL=Trie.js.map